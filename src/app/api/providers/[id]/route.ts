import { NextResponse } from "next/server";
import { repository } from "@/lib/data";
import { cleanIntent } from "@/lib/listing";
import { cleanLinks } from "@/lib/links";
import type { ProviderRegistration } from "@/lib/types";
import { ctxFromParams } from "../../_ctx";

// GET /api/providers/:id?lat=&lng=&city=&country=&currency=&locale=
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const provider = await repository.getById(id, ctxFromParams(searchParams));
  if (!provider) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  return NextResponse.json({ provider });
}

// PATCH /api/providers/:id  — owner edit. Body: { ...registration, editToken, ctx }
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  let body:
    | (Partial<ProviderRegistration> & { editToken?: string; ctx?: Record<string, unknown> })
    | null = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  if (!body?.editToken) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }
  if (!body.name || !body.name.trim()) {
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
    const provider = await repository.update(
      id,
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
        links: cleanLinks(body.links),
        intent: cleanIntent(body.intent),
      },
      body.editToken,
      ctxFromParams(ctxParams),
    );
    return NextResponse.json({ provider });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (/not authorized|not found/i.test(msg)) {
      return NextResponse.json({ error: "You can only edit your own listing." }, { status: 403 });
    }
    // Most likely the edit feature isn't provisioned in the DB yet.
    return NextResponse.json(
      { error: "Editing isn’t available yet. Please try again later." },
      { status: 503 },
    );
  }
}

// DELETE /api/providers/:id  — owner delete. Token via the x-edit-token header.
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const editToken = req.headers.get("x-edit-token") ?? "";
  if (!editToken) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }
  try {
    await repository.remove(id, editToken, ctxFromParams(new URLSearchParams()));
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (/not authorized|not found/i.test(msg)) {
      return NextResponse.json({ error: "You can only delete your own listing." }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Deleting isn’t available yet. Please try again later." },
      { status: 503 },
    );
  }
}
