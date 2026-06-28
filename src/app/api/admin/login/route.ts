import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminSecured, adminToken, checkPassword } from "@/lib/admin-auth";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  if (!rateLimit(clientKey(req, "admin-login"), 8, 5 * 60_000)) {
    return NextResponse.json({ error: "Too many attempts. Try again shortly." }, { status: 429 });
  }
  if (!adminSecured()) return NextResponse.json({ ok: true, secured: false });
  let body: { password?: string } | null = null;
  try {
    body = await req.json();
  } catch {
    body = null;
  }
  if (!checkPassword(body?.password ?? "")) {
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, adminToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
