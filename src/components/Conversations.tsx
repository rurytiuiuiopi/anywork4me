"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchInbox, fetchMyThreads, replyToThread, sendMessage } from "@/lib/api";
import { getClientToken, getOwnedListings } from "@/lib/ownership";
import { getProfile } from "@/lib/profile";
import type { Message } from "@/lib/types";

interface Convo {
  key: string;
  listingId: string;
  threadToken: string;
  role: "owner" | "client";
  messages: Message[];
  otherName: string;
  unread: number;
}

function timeAgo(iso: string): string {
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.round(h / 24)}d`;
}

function replyLink(contact?: string): { href: string; label: string } | null {
  if (!contact) return null;
  if (contact.includes("@")) return { href: `mailto:${contact}`, label: "Reply by email" };
  const digits = contact.replace(/[^\d]/g, "");
  if (digits.length >= 7) return { href: `https://wa.me/${digits}`, label: "Reply on WhatsApp" };
  return null;
}

export function Conversations() {
  const [convos, setConvos] = useState<Convo[] | null>(null);
  const [legacy, setLegacy] = useState<Message[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    const owned = getOwnedListings();
    const clientToken = getClientToken();
    const [inbox, mine] = await Promise.all([
      owned.length ? fetchInbox(owned, true) : Promise.resolve({ messages: [], unread: 0 }),
      fetchMyThreads(clientToken),
    ]);

    const map = new Map<string, Convo>();
    const seen = new Set<string>();
    const add = (m: Message, role: "owner" | "client") => {
      if (!m.threadToken) return;
      const key = `${m.listingId}:${m.threadToken}`;
      if (!map.has(key)) {
        map.set(key, {
          key,
          listingId: m.listingId,
          threadToken: m.threadToken,
          role,
          messages: [],
          otherName: "",
          unread: 0,
        });
      }
      if (seen.has(m.id)) return;
      seen.add(m.id);
      map.get(key)!.messages.push(m);
    };

    const legacyMsgs: Message[] = [];
    for (const m of inbox.messages) {
      if (m.threadToken) add(m, "owner");
      else legacyMsgs.push(m);
    }
    for (const m of mine) add(m, "client");

    for (const c of map.values()) {
      c.messages.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
      const cm = c.messages.find((m) => m.sender === "client");
      const om = c.messages.find((m) => m.sender === "owner");
      c.otherName = c.role === "owner" ? cm?.senderName || "Customer" : om?.senderName || "Provider";
      c.unread = c.messages.filter(
        (m) => !m.read && (c.role === "owner" ? m.sender !== "owner" : m.sender === "owner"),
      ).length;
    }

    const list = [...map.values()].sort((a, b) =>
      (a.messages.at(-1)?.createdAt ?? "") < (b.messages.at(-1)?.createdAt ?? "") ? 1 : -1,
    );
    setConvos(list);
    setLegacy(legacyMsgs);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const activeConvo = convos?.find((c) => c.key === active) ?? null;

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!activeConvo || !reply.trim() || sending) return;
    setSending(true);
    const myName = getProfile()?.name || "You";
    if (activeConvo.role === "owner") {
      await replyToThread(activeConvo.listingId, activeConvo.threadToken, myName, reply.trim());
    } else {
      await sendMessage(activeConvo.listingId, { senderName: myName, body: reply.trim() });
    }
    setReply("");
    await load();
    setSending(false);
  }

  // ── Open conversation ────────────────────────────────────────────────────
  if (activeConvo) {
    const mine = (m: Message) =>
      activeConvo.role === "owner" ? m.sender === "owner" : m.sender === "client";
    return (
      <div>
        <button onClick={() => setActive(null)} className="mb-3 text-sm font-semibold text-accent">
          ‹ All conversations
        </button>
        <div className="rounded-3xl border border-border bg-background p-4">
          <p className="border-b border-border pb-3 font-semibold">{activeConvo.otherName}</p>
          <div className="mt-3 max-h-[55vh] space-y-3 overflow-y-auto">
            {activeConvo.messages.map((m) => (
              <div key={m.id} className={`flex ${mine(m) ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${
                    mine(m) ? "brand-gradient text-accent-foreground" : "bg-surface-2"
                  }`}
                >
                  {m.kind === "booking" && (
                    <p className="mb-1 text-[11px] font-bold uppercase tracking-wide opacity-70">
                      📅 Booking request
                    </p>
                  )}
                  <p className="whitespace-pre-wrap leading-relaxed">{m.body}</p>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={send} className="mt-3 flex items-center gap-2">
            <input
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Reply…"
              className="h-11 min-w-0 flex-1 rounded-2xl border border-border bg-surface-2 px-3.5 text-sm outline-none focus:border-accent"
            />
            <button
              type="submit"
              disabled={sending || !reply.trim()}
              className="brand-gradient shrink-0 rounded-2xl px-4 py-2.5 text-sm font-semibold text-accent-foreground disabled:opacity-50"
            >
              {sending ? "…" : "Send"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Conversation list ────────────────────────────────────────────────────
  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Conversations</h2>

      {convos === null ? (
        <div className="space-y-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="fm-skeleton h-16 rounded-3xl" />
          ))}
        </div>
      ) : convos.length === 0 && legacy.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-border bg-background p-5 text-center text-sm text-muted">
          No conversations yet. Messages and bookings show up here, and you can reply right on the
          site.
        </p>
      ) : (
        <ul className="space-y-2">
          {convos.map((c) => {
            const last = c.messages.at(-1);
            return (
              <li key={c.key}>
                <button
                  onClick={() => setActive(c.key)}
                  className="flex w-full items-center gap-3 rounded-3xl border border-border bg-background p-4 text-left transition hover:border-accent/40"
                >
                  <span className="brand-gradient flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-semibold text-accent-foreground">
                    {c.otherName.slice(0, 1).toUpperCase()}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate font-semibold">{c.otherName}</span>
                      <span className="shrink-0 text-xs text-muted">
                        {last ? timeAgo(last.createdAt) : ""}
                      </span>
                    </span>
                    <span className="block truncate text-sm text-muted">{last?.body}</span>
                  </span>
                  {c.unread > 0 && (
                    <span className="shrink-0 rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                      {c.unread}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {legacy.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
            Earlier messages
          </h3>
          <ul className="space-y-2">
            {legacy.map((m) => {
              const r = replyLink(m.senderContact);
              return (
                <li key={m.id} className="rounded-3xl border border-border bg-background p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{m.senderName}</span>
                    <span className="text-xs text-muted">{timeAgo(m.createdAt)}</span>
                  </div>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-muted">{m.body}</p>
                  {r && (
                    <a
                      href={r.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-sm font-semibold text-accent"
                    >
                      {r.label}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
