import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminSecured, isAuthed } from "@/lib/admin-auth";
import { repository } from "@/lib/data";
import { getSupabase } from "@/lib/data/supabase/client";

/** Is the messages table provisioned? (best-effort health signal) */
async function messagingLive(): Promise<boolean> {
  try {
    const { error } = await getSupabase()
      .from("messages")
      .select("id", { count: "exact", head: true });
    return !error;
  } catch {
    return false;
  }
}

export async function GET() {
  const cookie = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!isAuthed(cookie)) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  try {
    const [stats, messaging] = await Promise.all([repository.adminStats(), messagingLive()]);
    return NextResponse.json({
      stats,
      secured: adminSecured(),
      serviceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      messaging,
    });
  } catch {
    return NextResponse.json({ error: "Could not load stats." }, { status: 500 });
  }
}
