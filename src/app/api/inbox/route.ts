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
  };
}

// POST /api/inbox  — body: { owned: [{id, token}], markRead?: boolean }
// Returns the messages for the listings this device owns (token-authenticated).
export async function POST(req: Request) {
  let body: { owned?: { id: string; token: string }[]; markRead?: boolean } | null = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ messages: [], unread: 0 });
  }

  const owned = (Array.isArray(body?.owned) ? body.owned : []).slice(0, 20);
  const markRead = !!body?.markRead;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.json({ messages: [], unread: 0 });

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
      for (const r of data ?? []) all.push(rowToMessage(r));
      if (markRead) {
        await db.from("messages").update({ read: true }).eq("listing_id", item.id).eq("read", false);
      }
    }
  } catch {
    return NextResponse.json({ messages: [], unread: 0 });
  }

  all.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  const unread = all.filter((m) => !m.read).length;
  return NextResponse.json({ messages: all, unread });
}
