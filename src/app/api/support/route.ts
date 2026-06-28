import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

/* eslint-disable @typescript-eslint/no-explicit-any */

const WELCOME =
  "Hi, this is Sarah 👋 Welcome to AnyWork4Me.com. We’re happy to have you here. " +
  "You can post your work, list your products or services, apply for jobs, hire workers, " +
  "and connect with people who need your skills. If you need help, just reply to this " +
  "message and our team will assist you.";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function clientFor(token: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "x-support-token": token } },
  });
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

export async function POST(req: Request) {
  let body:
    | { token?: string; op?: string; name?: string; email?: string; body?: string }
    | null = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const token = typeof body?.token === "string" ? body.token : "";
  if (!UUID.test(token)) return NextResponse.json({ messages: [], unread: 0 });

  const db = clientFor(token);
  if (!db) return NextResponse.json({ messages: [], unread: 0 });
  const op = body?.op;

  try {
    if (op === "welcome") {
      const { data: existing } = await db
        .from("support_messages")
        .select("id")
        .eq("thread_token", token)
        .limit(1);
      if (!existing || existing.length === 0) {
        await db.from("support_messages").insert({
          thread_token: token,
          sender: "system",
          user_name: (body?.name ?? "").slice(0, 80) || null,
          user_email: (body?.email ?? "").slice(0, 120) || null,
          body: WELCOME,
        });
      }
      return NextResponse.json({ ok: true });
    }

    if (op === "reply") {
      const text = (body?.body ?? "").trim();
      if (!text) return NextResponse.json({ error: "Write a message." }, { status: 400 });
      const { error } = await db.from("support_messages").insert({
        thread_token: token,
        sender: "user",
        user_name: (body?.name ?? "").slice(0, 80) || null,
        body: text.slice(0, 2000),
      });
      if (error) throw new Error(error.message);
      return NextResponse.json({ ok: true });
    }

    if (op === "count") {
      const { count } = await db
        .from("support_messages")
        .select("id", { count: "exact", head: true })
        .eq("thread_token", token)
        .neq("sender", "user")
        .eq("read", false);
      return NextResponse.json({ unread: count ?? 0 });
    }

    // default: sync — return the thread, mark incoming messages read
    const { data } = await db
      .from("support_messages")
      .select("*")
      .eq("thread_token", token)
      .order("created_at", { ascending: true })
      .limit(200);
    const messages = (data ?? []).map(rowToMsg);
    const unread = messages.filter((m) => !m.read && m.sender !== "user").length;
    await db
      .from("support_messages")
      .update({ read: true })
      .eq("thread_token", token)
      .neq("sender", "user")
      .eq("read", false);
    return NextResponse.json({ messages, unread });
  } catch {
    return NextResponse.json(
      { error: "Support isn’t set up yet.", messages: [], unread: 0 },
      { status: 503 },
    );
  }
}
