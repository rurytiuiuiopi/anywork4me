"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { IconBell, IconPlus } from "@/components/Icons";
import { fetchInbox } from "@/lib/api";
import { getOwnedListings } from "@/lib/ownership";
import type { Message } from "@/lib/types";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}

function replyLink(contact?: string): { href: string; label: string } | null {
  if (!contact) return null;
  if (contact.includes("@")) return { href: `mailto:${contact}`, label: "Reply by email" };
  const digits = contact.replace(/[^\d]/g, "");
  if (digits.length >= 7) return { href: `https://wa.me/${digits}`, label: "Reply on WhatsApp" };
  return null;
}

export default function InboxPage() {
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [hasListings, setHasListings] = useState(true);

  useEffect(() => {
    const owned = getOwnedListings();
    setHasListings(owned.length > 0);
    fetchInbox(owned, true)
      .then((r) => setMessages(r.messages))
      .catch(() => setMessages([]));
  }, []);

  return (
    <main className="mx-auto min-h-dvh w-full max-w-2xl px-5 pb-16">
      <header className="flex items-center gap-3 py-5">
        <Link
          href="/"
          aria-label="Back"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background shadow-sm transition hover:bg-surface active:scale-95"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
          </svg>
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Inbox</h1>
      </header>

      {messages === null ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="fm-skeleton h-24 rounded-3xl" />
          ))}
        </div>
      ) : messages.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
            <IconBell className="h-7 w-7" />
          </span>
          <h2 className="text-lg font-semibold">No messages yet</h2>
          <p className="max-w-xs text-sm text-muted">
            {hasListings
              ? "When someone books you or sends a message, it shows up here."
              : "Post a listing and your bookings & messages will land here."}
          </p>
          {!hasListings && (
            <Link
              href="/available"
              className="brand-gradient mt-1 inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold text-accent-foreground"
            >
              <IconPlus className="h-4 w-4" /> Post a listing
            </Link>
          )}
        </div>
      ) : (
        <ul className="space-y-3">
          {messages.map((m) => {
            const reply = replyLink(m.senderContact);
            return (
              <li
                key={m.id}
                className={`rounded-3xl border bg-background p-4 ${
                  m.read ? "border-border" : "border-accent/40 bg-accent/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="brand-gradient flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-accent-foreground">
                    {m.senderName.slice(0, 1).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-semibold">{m.senderName}</span>
                      {m.kind === "booking" && (
                        <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-semibold text-accent">
                          Booking
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted">{timeAgo(m.createdAt)}</span>
                  </div>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-[15px] leading-relaxed">{m.body}</p>
                {(reply || m.senderContact) && (
                  <div className="mt-3 flex items-center gap-3">
                    {reply && (
                      <a
                        href={reply.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="brand-gradient rounded-full px-4 py-2 text-sm font-semibold text-accent-foreground"
                      >
                        {reply.label}
                      </a>
                    )}
                    {!reply && m.senderContact && (
                      <span className="text-sm text-muted">Contact: {m.senderContact}</span>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
