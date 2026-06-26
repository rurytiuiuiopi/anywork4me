import { CATEGORIES, matchCategory } from "../categories";
import { distanceKm, offsetPoint } from "../geo";
import { DEFAULT_COUNTRY, getCountry } from "../location/countries";
import type {
  Category,
  Provider,
  ProviderRegistration,
  Review,
  ReviewInput,
  SearchQuery,
  SearchResult,
  UserContext,
} from "../types";
import type { ProviderRepository } from "./repository";
import { matchesText, scoreProvider } from "./ranking";
import { SEEDS, type Seed } from "./mock-seeds";

const DAY_MS = 86_400_000;

/** Resolve a location-relative seed into a concrete Provider for this viewer. */
function resolveSeed(seed: Seed, ctx: UserContext): Provider {
  const country = getCountry(ctx.country) ?? DEFAULT_COUNTRY;
  const base = ctx.point ?? country.point;
  const city = ctx.city ?? country.capital;
  const currency = ctx.currency ?? country.currency;
  const now = Date.now();

  const reviews: Review[] = seed.reviews.map((rv, i) => ({
    id: `${seed.id}-r${i}`,
    author: rv.author,
    rating: rv.rating,
    comment: rv.comment,
    createdAt: new Date(now - rv.daysAgo * DAY_MS).toISOString(),
  }));

  return {
    id: seed.id,
    name: seed.name,
    business: seed.business,
    categories: seed.categories,
    tagline: seed.tagline,
    bio: seed.bio,
    phone: `${country.dialCode} ${seed.phoneLocal}`,
    whatsapp: `${country.dialCode} ${seed.phoneLocal}`,
    location: {
      label: `${seed.area} · ${city}`,
      area: seed.area,
      city,
      country: country.code,
      point: offsetPoint(base, seed.offset[0], seed.offset[1]),
    },
    photos: ["a", "b", "c", "d"].map((s) => `${seed.id}-${s}`),
    pricing: {
      from: seed.priceFrom,
      to: seed.priceTo,
      unit: seed.priceUnit,
      currency,
    },
    availability: seed.availability,
    rating: seed.rating,
    reviewsCount: seed.reviewsCount,
    reviews,
    tier: seed.tier,
    verified: seed.verified,
    featured: seed.featured,
    sponsored: seed.sponsored,
    createdAt: new Date(now - 120 * DAY_MS).toISOString(),
  };
}

export class MockProviderRepository implements ProviderRepository {
  /** Providers registered live this session via "I'm Available". */
  private registered: Provider[] = [];
  /** Reviews added this session for seed providers (seeds are recomputed per request). */
  private extraReviews = new Map<string, Review[]>();
  /** Secret edit tokens, kept OUT of the stored provider so reads never leak them. */
  private editTokens = new Map<string, string>();

  /** Merge session-added reviews into a resolved seed provider. */
  private applyExtra(p: Provider): Provider {
    const extra = this.extraReviews.get(p.id);
    if (!extra?.length) return p;
    const count = p.reviewsCount + extra.length;
    const sum = p.rating * p.reviewsCount + extra.reduce((s, r) => s + r.rating, 0);
    return {
      ...p,
      reviews: [...extra, ...p.reviews],
      reviewsCount: count,
      rating: count ? Math.round((sum / count) * 10) / 10 : 0,
    };
  }

  async listCategories(): Promise<Category[]> {
    return CATEGORIES;
  }

  async search(query: SearchQuery, ctx: UserContext): Promise<SearchResult[]> {
    const all = [
      ...SEEDS.map((s) => this.applyExtra(resolveSeed(s, ctx))),
      ...this.registered,
    ];
    const q = query.q?.trim();
    const targetCat = query.categoryId ?? (q ? matchCategory(q)?.id : undefined);

    let candidates = all;
    if (targetCat) {
      const inCat = all.filter((p) => p.categories.includes(targetCat));
      candidates = inCat.length ? inCat : all;
    }
    if (q) {
      const textMatched = candidates.filter((p) => matchesText(p, q));
      if (textMatched.length) candidates = textMatched;
      else if (!targetCat) candidates = all.filter((p) => matchesText(p, q));
    }

    const base = ctx.point ?? (getCountry(ctx.country) ?? DEFAULT_COUNTRY).point;
    const results = candidates.map<SearchResult>((p) => {
      const d = distanceKm(base, p.location.point);
      return { provider: p, distanceKm: d, score: scoreProvider(p, d, q, targetCat) };
    });

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, query.limit ?? 40);
  }

  async getById(id: string, ctx: UserContext): Promise<Provider | null> {
    const reg = this.registered.find((p) => p.id === id);
    if (reg) return reg;
    const seed = SEEDS.find((s) => s.id === id);
    return seed ? this.applyExtra(resolveSeed(seed, ctx)) : null;
  }

  async addReview(providerId: string, input: ReviewInput): Promise<Review> {
    const review: Review = {
      id: `${providerId}-x${this.extraReviews.get(providerId)?.length ?? 0}-${Date.now()}`,
      author: input.author,
      rating: input.rating,
      comment: input.comment,
      createdAt: new Date().toISOString(),
    };
    const reg = this.registered.find((p) => p.id === providerId);
    if (reg) {
      reg.reviews.unshift(review);
      const count = reg.reviewsCount + 1;
      reg.rating = Math.round(((reg.rating * reg.reviewsCount + review.rating) / count) * 10) / 10;
      reg.reviewsCount = count;
      return review;
    }
    if (!SEEDS.some((s) => s.id === providerId)) throw new Error("Provider not found");
    const list = this.extraReviews.get(providerId) ?? [];
    list.unshift(review);
    this.extraReviews.set(providerId, list);
    return review;
  }

  async register(input: ProviderRegistration, ctx: UserContext): Promise<Provider> {
    const country = getCountry(ctx.country) ?? DEFAULT_COUNTRY;
    const base = ctx.point ?? country.point;
    const id = `me-${this.registered.length + 1}-${input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    const provider: Provider = {
      id,
      name: input.name,
      business: input.business,
      categories: input.categories.length ? input.categories : ["food"],
      tagline: input.tagline,
      bio: input.bio,
      phone: input.phone ? `${country.dialCode} ${input.phone}` : undefined,
      whatsapp: input.phone ? `${country.dialCode} ${input.phone}` : undefined,
      location: {
        label: `${input.area ?? "Your area"} · ${ctx.city ?? country.capital}`,
        area: input.area ?? "Your area",
        city: ctx.city ?? country.capital,
        country: country.code,
        point: offsetPoint(base, 0.3, 0.3),
      },
      photos: input.bannerUrl
        ? [input.bannerUrl, `${id}-2`, `${id}-3`]
        : [id, `${id}-2`, `${id}-3`],
      bannerUrl: input.bannerUrl,
      pricing: input.priceFrom
        ? {
            from: input.priceFrom,
            unit: input.priceUnit ?? "job",
            currency: ctx.currency ?? country.currency,
          }
        : undefined,
      availability: "available",
      rating: 0,
      reviewsCount: 0,
      reviews: [],
      tier: "standard",
      verified: false,
      featured: false,
      sponsored: false,
      createdAt: new Date().toISOString(),
    };
    this.registered.unshift(provider);
    const editToken = globalThis.crypto.randomUUID();
    this.editTokens.set(id, editToken);
    // Token returned ONLY here (to the creator), never stored on the shared object.
    return { ...provider, editToken };
  }

  async update(
    id: string,
    input: ProviderRegistration,
    editToken: string,
    ctx: UserContext,
  ): Promise<Provider> {
    const idx = this.registered.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Listing not found.");
    const existing = this.registered[idx];
    if (this.editTokens.get(id) !== editToken) {
      throw new Error("Not authorized to edit this listing.");
    }
    const country = getCountry(ctx.country) ?? DEFAULT_COUNTRY;
    const phone = input.phone ? `${country.dialCode} ${input.phone}` : undefined;
    const area = input.area ?? existing.location.area;
    const updated: Provider = {
      ...existing,
      name: input.name,
      business: input.business,
      categories: input.categories.length ? input.categories : existing.categories,
      tagline: input.tagline,
      bio: input.bio,
      phone,
      whatsapp: phone,
      location: { ...existing.location, area, label: `${area} · ${existing.location.city}` },
      photos: input.bannerUrl ? [input.bannerUrl, `${id}-2`, `${id}-3`] : existing.photos,
      bannerUrl: input.bannerUrl,
      pricing: input.priceFrom
        ? {
            from: input.priceFrom,
            unit: input.priceUnit ?? "job",
            currency: existing.pricing?.currency ?? ctx.currency ?? country.currency,
          }
        : undefined,
    };
    this.registered[idx] = updated;
    return updated;
  }

  async remove(id: string, editToken: string): Promise<void> {
    const idx = this.registered.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Listing not found.");
    if (this.editTokens.get(id) !== editToken) {
      throw new Error("Not authorized to edit this listing.");
    }
    this.registered.splice(idx, 1);
    this.editTokens.delete(id);
  }
}
