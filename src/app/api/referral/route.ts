import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/data/supabase/client";

const CODE = /^[a-z0-9]{4,16}$/i;

// POST /api/referral { code } — record a signup attributed to an inviter.
export async function POST(req: Request) {
  let body: { code?: string } | null = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const code = typeof body?.code === "string" ? body.code.trim() : "";
  if (!CODE.test(code)) return NextResponse.json({ ok: false }, { status: 400 });
  try {
    await getSupabase().from("referrals").insert({ referrer_code: code });
  } catch {
    /* graceful — table may not exist yet */
  }
  return NextResponse.json({ ok: true });
}

// GET /api/referral?code=CODE — how many signups this code has referred.
export async function GET(req: Request) {
  const code = new URL(req.url).searchParams.get("code") ?? "";
  if (!CODE.test(code)) return NextResponse.json({ count: 0 });
  try {
    const { count } = await getSupabase()
      .from("referrals")
      .select("id", { count: "exact", head: true })
      .eq("referrer_code", code);
    return NextResponse.json({ count: count ?? 0 });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
