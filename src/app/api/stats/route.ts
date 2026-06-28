import { NextResponse } from "next/server";
import { CATEGORIES } from "@/lib/categories";
import { getSupabase } from "@/lib/data/supabase/client";

// Public, lightweight platform counts for the homepage trust section.
// Counts only — no personal data. Cached briefly at the edge.
export async function GET() {
  let providers = 0;
  let reviews = 0;
  try {
    const db = getSupabase();
    const [p, r] = await Promise.all([
      db.from("providers").select("id", { count: "exact", head: true }),
      db.from("reviews").select("id", { count: "exact", head: true }),
    ]);
    providers = p.count ?? 0;
    reviews = r.count ?? 0;
  } catch {
    /* counts stay 0 if the backend isn't reachable */
  }
  return NextResponse.json(
    { providers, reviews, categories: CATEGORIES.length },
    { headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600" } },
  );
}
