import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminSecured, isAuthed } from "@/lib/admin-auth";
import { repository } from "@/lib/data";

export async function GET() {
  const cookie = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!isAuthed(cookie)) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  try {
    const stats = await repository.adminStats();
    return NextResponse.json({
      stats,
      secured: adminSecured(),
      serviceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    });
  } catch {
    return NextResponse.json({ error: "Could not load stats." }, { status: 500 });
  }
}
