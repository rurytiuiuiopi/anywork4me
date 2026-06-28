import { NextResponse } from "next/server";
import { repository } from "@/lib/data";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { ctxFromParams } from "../../../_ctx";

// POST /api/providers/:id/reviews  — submit a review. Body: { author, rating, comment, ctx }
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!rateLimit(clientKey(req, "review"), 6, 60_000)) {
    return NextResponse.json({ error: "Too many reviews too fast. Try again shortly." }, { status: 429 });
  }
  const { id } = await params;

  let body:
    | { author?: string; rating?: number; comment?: string; ctx?: Record<string, unknown> }
    | null = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const author = body?.author?.trim();
  const rating = Number(body?.rating);
  if (!author) {
    return NextResponse.json({ error: "Your name is required." }, { status: 400 });
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Pick a rating from 1 to 5." }, { status: 400 });
  }

  const ctxParams = new URLSearchParams();
  for (const [k, v] of Object.entries(body?.ctx ?? {})) {
    if (v != null) ctxParams.set(k, String(v));
  }

  try {
    const review = await repository.addReview(
      id,
      { author, rating, comment: body?.comment?.trim() ?? "" },
      ctxFromParams(ctxParams),
    );
    return NextResponse.json({ review }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Could not post your review." }, { status: 500 });
  }
}
