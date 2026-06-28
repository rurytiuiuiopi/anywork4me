import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, isAuthed } from "@/lib/admin-auth";

/* eslint-disable @typescript-eslint/no-explicit-any */

// Server-only key that matches the RLS policy in 0009_support.sql — lets the
// password-gated admin read/write every support thread without the service key.
const ADMIN_KEY = "aw4m_support_2f9a4c7e8b1d3f60a5e9c2b4d7f1a8e3";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "x-support-admin": ADMIN_KEY } },
  });
}

async function authed(): Promise<boolean> {
  const c = (await cookies()).get(ADMIN_COOKIE)?.value;
  return isAuthed(c);
}

function rowToMsg(r: any) {
  return {
    id: r.id,
    sender: r.sender as "system" | "user" | "admin",
    body: r.body as string,
    read: !!r.read,
    createdAt: r.created_at as string,
  };
}

export async function GET(req: Request) {
  if (!(await authed())) return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  const db = adminClient();
  if (!db) return NextResponse.json({ threads: [] });

  const token = new URL(req.url).searchParams.get("token");
  try {
    if (token && UUID.test(token)) {
      const { data } = await db
        .from("support_messages")
        .select("*")
        .eq("thread_token", token)
        .order("created_at", { ascending: true })
        .limit(200);
      await db
        .from("support_messages")
        .update({ read: true })
        .eq("thread_token", token)
        .eq("sender", "user")
        .eq("read", false);
      return NextResponse.json({ messages: (data ?? []).map(rowToMsg) });
    }

    const { data } = await db
      .from("support_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(2000);
    const map = new Map<string, any>();
    for (const r of data ?? []) {
      const t = r.thread_token as string;
      if (!map.has(t)) {
        map.set(t, { token: t, name: r.user_name, email: r.user_email, last: r.body, lastAt: r.created_at, unread: 0 });
      }
      const th = map.get(t);
      if (!th.name && r.user_name) th.name = r.user_name;
      if (!th.email && r.user_email) th.email = r.user_email;
      if (r.sender === "user" && !r.read) th.unread += 1;
    }
    return NextResponse.json({ threads: [...map.values()] });
  } catch {
    return NextResponse.json({ threads: [], error: "Support isn’t set up yet." }, { status: 503 });
  }
}

export async function POST(req: Request) {
  if (!(await authed())) return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  let body: { token?: string; body?: string } | null = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const token = typeof body?.token === "string" ? body.token : "";
  const text = (body?.body ?? "").trim();
  if (!UUID.test(token) || !text) {
    return NextResponse.json({ error: "Missing thread or message." }, { status: 400 });
  }
  const db = adminClient();
  if (!db) return NextResponse.json({ error: "Support not configured." }, { status: 503 });
  try {
    const { error } = await db
      .from("support_messages")
      .insert({ thread_token: token, sender: "admin", body: text.slice(0, 2000) });
    if (error) throw new Error(error.message);
    await db
      .from("support_messages")
      .update({ read: true })
      .eq("thread_token", token)
      .eq("sender", "user")
      .eq("read", false);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Couldn’t send the reply." }, { status: 503 });
  }
}
