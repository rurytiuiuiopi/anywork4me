import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { Message } from "@/lib/types";

/* eslint-disable @typescript-eslint/no-explicit-any */
function rowToMessage(r: any): Message {
  return {
    id: r.id,
    listingId: r.listing_id,
    senderName: r.sender_name,
    senderContact: r.sender_contact ?? undefined,
    body: r.body,
    kind: r.kind === "booking" ? "booking" : "message",
    read: !!r.read,
    createdAt: r.created_at,
    threadToken: r.thread_token ?? undefined,
    sender: r.sender === "owner" ? "owner" : "client",
  };
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(req: Request) {
  let body: any = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ messages: [], unread: 0 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.json({ messages: [], unread: 0 });

  // ── Owner replies in-app to a conversation ───────────────────────────────
  if (body?.reply) {
    const { listingId, threadToken, fromName, body: text } = body.reply;
    if (!UUID.test(listingId || "") || !UUID.test(threadToken || "") || !String(text || "").trim()) {
      return NextResponse.json({ error: "Bad reply." }, { status: 400 });
    }
    try {
      const db = createClient(url, key, { auth: { persistSession: false } });
      const { error } = await db.from("messages").insert({
        listing_id: listingId,
        thread_token: threadToken,
        sender: "owner",
        sender_name: String(fromName || "Provider").slice(0, 80),
        body: String(text).slice(0, 2000),
        kind: "message",
      });
      if (error) throw new Error(error.message);
      return NextResponse.json({ ok: true });
    } catch {
      return NextResponse.json({ error: "In-app replies need the latest migration." }, { status: 503 });
    }
  }

  // ── Client reads the conversations they started (as a sender) ────────────
  if (body?.client) {
    const token = String(body.client);
    if (!UUID.test(token)) return NextResponse.json({ messages: [] });
    try {
      const db = createClient(url, key, {
        auth: { persistSession: false },
        global: { headers: { "x-message-token": token } },
      });
      const { data } = await db
        .from("messages")
        .select("*")
        .eq("thread_token", token)
        .order("created_at", { ascending: true })
        .limit(200);
      const messages = (data ?? []).map(rowToMessage);
      const unreadIds = messages.filter((m) => m.sender === "owner" && !m.read).map((m) => m.id);
      if (unreadIds.length) await db.from("messages").update({ read: true }).in("id", unreadIds);
      return NextResponse.json({ messages });
    } catch {
      return NextResponse.json({ messages: [] });
    }
  }

  // ── Provider reads messages for the listings they own ────────────────────
  const owned = (Array.isArray(body?.owned) ? body.owned : []).slice(0, 20);
  const markRead = !!body?.markRead;
  const all: Message[] = [];
  try {
    for (const item of owned) {
      if (!item?.id || !item?.token) continue;
      const db = createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false },
        global: { headers: { "x-edit-token": String(item.token) } },
      });
      const { data } = await db
        .from("messages")
        .select("*")
        .eq("listing_id", item.id)
        .order("created_at", { ascending: false })
        .limit(100);
      const msgs = (data ?? []).map(rowToMessage);
      for (const m of msgs) all.push(m);
      if (markRead) {
        const ids = msgs.filter((m) => m.sender !== "owner" && !m.read).map((m) => m.id);
        if (ids.length) await db.from("messages").update({ read: true }).in("id", ids);
      }
    }
  } catch {
    return NextResponse.json({ messages: [], unread: 0 });
  }

  all.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  const unread = all.filter((m) => m.sender !== "owner" && !m.read).length;
  return NextResponse.json({ messages: all, unread });
}
