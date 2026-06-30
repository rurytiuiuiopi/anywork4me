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
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
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

// Sarah, the auto-reply assistant. Rule-based (no external AI needed) so she
// answers instantly and for free. A human can still follow up from the admin
// support inbox afterwards.
function sarahReply(userText: string, name?: string): string {
  const t = userText.toLowerCase();
  const who = (name ?? "").trim().split(" ")[0];
  const hi = who ? `${who}, ` : "";
  const has = (...words: string[]) => words.some((w) => t.includes(w));

  if (t.length < 26 && has("hi", "hello", "hey", "good morning", "good afternoon", "good evening", "yo"))
    return `Hey ${who || "there"}! 😊 Lovely to have you on AnyWork4Me. Are you here to find a service, or to list your own? I can point you the right way.`;
  if (has("list", "post a", "register", "sign up", "add my", "create profile", "advertise", "sell", "offer my"))
    return `${hi}listing is quick and free — tap “Create profile” on the home page, add your service, area and price, and you’re live in minutes. Want me to walk you through it?`;
  if (has("pro", "price", "cost", "pay", "payment", "subscribe", "upgrade", "charge", "fee", "money"))
    return `Great question! Listing is free forever. Pro (about GH₵99/month) puts you at the top of search and adds a verified badge — upgrade anytime from your own profile, no lock-in. 💜`;
  if (has("book", "booking", "appointment"))
    return `When someone books you, it appears under the 🔔 Notifications tab right here, and you can reply to them in this inbox. Nothing to set up!`;
  if (has("message", "chat", "reply", "contact", "talk", "dm"))
    return `${hi}you can chat with anyone right here — when a customer or provider messages you, it shows under Messages and you just reply, like texting a friend. No email needed. 😊`;
  if (has("delete", "remove", "edit", "update my", "change my"))
    return `${hi}open your profile and tap “Edit my listing” to change or remove anything. Want the link to your profile?`;
  if (has("find", "search", "hire", "looking for", "need a", "where can", "who can"))
    return `Just type what you need — like “plumber” or “DJ” — in the search bar on the home page. You’ll see trusted people near you with ratings, and can message or book them instantly.`;
  if (has("thank", "thanks", "appreciate"))
    return `Anytime, ${who || "friend"}! 💜 I’m always right here if you need anything else.`;
  if (has("how", "help", "what can", "guide", "?"))
    return `${hi}happy to help! On AnyWork4Me you can: 🔎 find services near you, 📣 list your own work for free, 💬 message people, and 📅 take bookings. What would you like to do first?`;
  return `Thanks ${who || "so much"}! 😊 I’ve noted that. You can find people, list your own service, message, or book — all from the home page. Is there anything specific I can help with? Our team reads every message too.`;
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
      // Sarah replies instantly (best-effort; a human can still follow up).
      await db
        .from("support_messages")
        .insert({ thread_token: token, sender: "admin", body: sarahReply(text, body?.name) });
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
