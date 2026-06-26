import { CATEGORIES, matchCategory } from "../../categories";
import { distanceKm } from "../../geo";
import { DEFAULT_COUNTRY, getCountry } from "../../location/countries";
import type {
  Category,
  Provider,
  ProviderRegistration,
  Review,
  ReviewInput,
  SearchQuery,
  SearchResult,
  UserContext,
} from "../../types";
import { createClient } from "@supabase/supabase-js";
import { matchesText, scoreProvider } from "../ranking";
import type { ProviderRepository } from "../repository";
import { getSupabase } from "./client";

// Real, persistent backend. Implements the exact same ProviderRepository
// contract as the mock — so no UI, API route, or component changes were needed
// to go live. Providers store their real coordinates; search ranks by genuine
// distance from the viewer.
//
// Scale note: candidate filtering (category/country/text) happens in SQL; the
// distance sort happens in JS over the bounded candidate set. For very large
// per-country catalogs, add PostGIS + a `nearby` RPC and order in the database.

/* eslint-disable @typescript-eslint/no-explicit-any */
const isImageRef = (s: unknown): s is string =>
  typeof s === "string" && (s.startsWith("data:image") || /^https?:\/\//.test(s));

function rowToProvider(row: any, reviews: Review[] = []): Provider {
  const label = [row.area, row.city].filter(Boolean).join(" · ") || row.city || "";
  // A flyer, when present, is stored as the first `photos` entry (an image ref).
  const banner = isImageRef(row.photos?.[0]) ? row.photos[0] : (row.banner_url ?? undefined);
  return {
    id: row.id,
    name: row.name,
    business: row.business ?? undefined,
    categories: row.categories ?? [],
    tagline: row.tagline ?? undefined,
    bio: row.bio ?? undefined,
    phone: row.phone ?? undefined,
    whatsapp: row.whatsapp ?? row.phone ?? undefined,
    location: {
      label,
      area: row.area ?? "",
      city: row.city ?? "",
      country: row.country,
      point: { lat: row.lat, lng: row.lng },
    },
    photos: row.photos?.length ? row.photos : [row.id],
    bannerUrl: banner,
    pricing:
      row.price_from != null
        ? {
            from: Number(row.price_from),
            to: row.price_to != null ? Number(row.price_to) : undefined,
            unit: row.price_unit ?? "job",
            currency: row.currency ?? "USD",
          }
        : undefined,
    availability: row.availability ?? "available",
    rating: Number(row.rating ?? 0),
    reviewsCount: row.reviews_count ?? 0,
    reviews,
    tier: row.tier ?? "standard",
    verified: !!row.verified,
    featured: !!row.featured,
    sponsored: !!row.sponsored,
    createdAt: row.created_at,
  };
}

export class SupabaseProviderRepository implements ProviderRepository {
  async listCategories(): Promise<Category[]> {
    return CATEGORIES;
  }

  async search(query: SearchQuery, ctx: UserContext): Promise<SearchResult[]> {
    const supabase = getSupabase();
    const q = query.q?.trim();
    const targetCat = query.categoryId ?? (q ? matchCategory(q)?.id : undefined);

    let builder = supabase.from("providers").select("*");
    if (targetCat) builder = builder.contains("categories", [targetCat]);
    if (ctx.country) builder = builder.eq("country", ctx.country);

    const { data, error } = await builder.limit(200);
    if (error) throw new Error(error.message);

    let providers = (data ?? []).map((r) => rowToProvider(r));
    if (q) {
      const textMatched = providers.filter((p) => matchesText(p, q));
      if (textMatched.length || targetCat) providers = textMatched;
    }

    const base = ctx.point ?? (getCountry(ctx.country) ?? DEFAULT_COUNTRY).point;
    const results = providers.map<SearchResult>((p) => {
      const d = distanceKm(base, p.location.point);
      return { provider: p, distanceKm: d, score: scoreProvider(p, d, q, targetCat) };
    });
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, query.limit ?? 40);
  }

  async getById(id: string): Promise<Provider | null> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("providers")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return null;

    const { data: reviewRows, count } = await supabase
      .from("reviews")
      .select("*", { count: "exact" })
      .eq("provider_id", id)
      .order("created_at", { ascending: false })
      .limit(50);

    const reviews: Review[] = (reviewRows ?? []).map((r) => ({
      id: r.id,
      author: r.author,
      rating: r.rating,
      comment: r.comment ?? "",
      createdAt: r.created_at,
    }));

    const provider = rowToProvider(data, reviews);
    // Live aggregate computed from real reviews (no stored-counter drift).
    if (reviews.length) {
      provider.reviewsCount = count ?? reviews.length;
      provider.rating =
        Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10;
    }
    return provider;
  }

  async addReview(providerId: string, input: ReviewInput): Promise<Review> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("reviews")
      .insert({
        provider_id: providerId,
        author: input.author,
        rating: input.rating,
        comment: input.comment || null,
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return {
      id: data.id,
      author: data.author,
      rating: data.rating,
      comment: data.comment ?? "",
      createdAt: data.created_at,
    };
  }

  async register(input: ProviderRegistration, ctx: UserContext): Promise<Provider> {
    const supabase = getSupabase();
    const country = getCountry(ctx.country) ?? DEFAULT_COUNTRY;
    const base = ctx.point ?? country.point;
    const id = globalThis.crypto.randomUUID();
    const phone = input.phone ? `${country.dialCode} ${input.phone}` : null;

    const row = {
      id,
      name: input.name,
      business: input.business ?? null,
      categories: input.categories.length ? input.categories : ["food"],
      tagline: input.tagline ?? null,
      bio: input.bio ?? null,
      phone,
      whatsapp: phone,
      area: input.area ?? null,
      city: ctx.city ?? country.capital,
      country: country.code,
      lat: base.lat,
      lng: base.lng,
      photos: input.bannerUrl
        ? [input.bannerUrl, `${id}-2`, `${id}-3`]
        : [id, `${id}-2`, `${id}-3`],
      price_from: input.priceFrom ?? null,
      price_to: null,
      price_unit: input.priceUnit ?? "job",
      currency: ctx.currency ?? country.currency,
      availability: "available",
      rating: 0,
      reviews_count: 0,
      tier: "standard",
      verified: false,
      featured: false,
      sponsored: false,
    };
    const editToken = globalThis.crypto.randomUUID();

    let { data, error } = await supabase
      .from("providers")
      .insert({ ...row, edit_token: editToken })
      .select("*")
      .single();
    // If the edit_token column isn't provisioned yet, register without it so
    // sign-ups never break (editing simply turns on once the migration runs).
    if (error && /edit_token/i.test(error.message)) {
      ({ data, error } = await supabase.from("providers").insert(row).select("*").single());
    }
    if (error) throw new Error(error.message);
    const provider = rowToProvider(data);
    provider.editToken = data.edit_token ?? undefined;
    return provider;
  }

  async update(
    id: string,
    input: ProviderRegistration,
    editToken: string,
    ctx: UserContext,
  ): Promise<Provider> {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key =
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error("Supabase not configured.");

    // Per-request client carrying the secret token; the RLS "owner can update"
    // policy permits the write only when it matches the listing's stored token.
    const db = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { "x-edit-token": editToken } },
    });

    const country = getCountry(ctx.country) ?? DEFAULT_COUNTRY;
    const phone = input.phone ? `${country.dialCode} ${input.phone}` : null;
    const patch: Record<string, unknown> = {
      name: input.name,
      business: input.business ?? null,
      categories: input.categories.length ? input.categories : ["food"],
      tagline: input.tagline ?? null,
      bio: input.bio ?? null,
      phone,
      whatsapp: phone,
      area: input.area ?? null,
      price_from: input.priceFrom ?? null,
      price_unit: input.priceUnit ?? "job",
      photos: input.bannerUrl
        ? [input.bannerUrl, `${id}-2`, `${id}-3`]
        : [id, `${id}-2`, `${id}-3`],
    };

    const { data, error } = await db.from("providers").update(patch).eq("id", id).select("*");
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) throw new Error("Not authorized to edit this listing.");
    return rowToProvider(data[0]);
  }
}
