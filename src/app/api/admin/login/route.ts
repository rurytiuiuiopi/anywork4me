import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminSecured, adminToken, checkPassword } from "@/lib/admin-auth";

export async function POST(req: Request) {
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
