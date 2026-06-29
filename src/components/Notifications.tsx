"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchInbox } from "@/lib/api";
import { getOwnedListings } from "@/lib/ownership";
import { hasProfile } from "@/lib/profile";
import { supportUnread } from "@/lib/support";
import type { Message } from "@/lib/types";

function timeAgo(iso: string): string {
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.round(h / 24)}d`;
}

// The bell's view: a chronological feed of things that happened — booking
// requests + new customer messages + support replies. Distinct from Messages
// (the conversations you reply in). Tapping jumps to the relevant chat.
export function Notifications() {
  const [events, setEvents] = useState<Message[] | null>(null);
  const [support, setSupport] = useState(0);

  useEffect(() => {
    let alive = true;
    (async () => {
      const owned = getOwnedListings();
      const [inbox, sup] = await Promise.all([
        owned.length ? fetchInbox(owned) : Promise.resolve({ messages: [], unread: 0 }),
        hasProfile() ? supportUnread().catch(() => 0) : Promise.resolve(0),
      ]);
      if (!alive) return;
      const inbound = inbox.messages
        .filter((m) => m.sender !== "owner")
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
      setEvents(inbound);
      setSupport(sup);
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (events === null) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="fm-skeleton h-16 rounded-3xl" />
        ))}
      </div>
    );
  }

  const isEmpty = events.length === 0 && support === 0;

  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Notifications</h2>

      {isEmpty ? (
        <p className="rounded-3xl border border-dashed border-border bg-background p-5 text-center text-sm text-muted">
          You’re all caught up. Booking requests, new messages, and updates show up here.
        </p>
      ) : (
        <ul className="space-y-2">
          {support > 0 && (
            <li>
              <Link
                href="/inbox?tab=messages"
                className="flex items-center gap-3 rounded-3xl border border-accent/30 bg-accent/5 p-4 transition hover:border-accent/50"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/15 text-lg">
                  ⭐
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">Sarah from anywork4me</span>
                  <span className="block truncate text-sm text-muted">
                    You have {support} new {support === 1 ? "reply" : "replies"} in support.
                  </span>
                </span>
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-red-500" />
              </Link>
            </li>
          )}

          {events.map((m) => {
            const booking = m.kind === "booking";
            return (
              <li key={m.id}>
                <Link
                  href="/inbox?tab=messages"
                  className="flex items-center gap-3 rounded-3xl border border-border bg-background p-4 transition hover:border-accent/40"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-2 text-lg">
                    {booking ? "📅" : "💬"}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate font-semibold">
                        {booking ? "Booking request" : "New message"} · {m.senderName}
                      </span>
                      <span className="shrink-0 text-xs text-muted">{timeAgo(m.createdAt)}</span>
                    </span>
                    <span className="block truncate text-sm text-muted">{m.body}</span>
                  </span>
                  {!m.read && <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-red-500" />}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
