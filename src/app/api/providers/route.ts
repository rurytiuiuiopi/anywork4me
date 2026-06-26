import { NextResponse } from "next/server";
import { repository } from "@/lib/data";
import type { ProviderRegistration } from "@/lib/types";
import { ctxFromParams } from "../_ctx";

// GET /api/providers?q=dj&category=dj&lat=&lng=&city=&country=&currency=&locale=
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const ctx = ctxFromParams(searchParams);
    const results = await repository.search(
      {
        q: searchParams.get("q") ?? undefined,
        categoryId: searchParams.get("category") ?? undefined,
        limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
      },
      ctx,
    );
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ error: "Search failed." }, { status: 500 });
  }
}

// POST /api/providers  — "I'm Available" registration. Body: { ...registration, ctx }
export async function POST(req: Request) {
  let body: (Partial<ProviderRegistration> & { ctx?: Record<string, unknown> }) | null = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  if (!body?.name || !body.name.trim()) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  if (!body.categories?.length) {
    return NextResponse.json({ error: "Pick at least one category." }, { status: 400 });
  }

  const ctxParams = new URLSearchParams();
  for (const [k, v] of Object.entries(body.ctx ?? {})) {
    if (v != null) ctxParams.set(k, String(v));
  }

  try {
    const provider = await repository.register(
      {
        name: body.name.trim(),
        business: body.business,
        categories: body.categories,
        tagline: body.tagline,
        bio: body.bio,
        phone: body.phone,
        area: body.area,
        priceFrom: body.priceFrom,
        priceUnit: body.priceUnit,
        bannerUrl:
          typeof body.bannerUrl === "string" &&
          /^(data:image\/|https:\/\/)/.test(body.bannerUrl) &&
          body.bannerUrl.length < 3_900_000
            ? body.bannerUrl
            : undefined,
      },
      ctxFromParams(ctxParams),
    );
    return NextResponse.json({ provider }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Could not create your profile." }, { status: 500 });
  }
}
