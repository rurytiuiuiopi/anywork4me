"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { IconCheck, IconUsers } from "@/components/Icons";
import { hasProfile } from "@/lib/profile";
import { fetchReferralCount, inviteLink, inviteMessage, referralBadge } from "@/lib/referral";

const TIERS = [
  { label: "Inviter", at: 1 },
  { label: "Recruiter", at: 3 },
  { label: "Top Recruiter", at: 10 },
  { label: "Ambassador", at: 25 },
];

export default function InvitePage() {
  const [signedIn, setSignedIn] = useState<boolean | undefined>(undefined);
  const [link, setLink] = useState("");
  const [count, setCount] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const has = hasProfile();
    setSignedIn(has);
    if (has) {
      setLink(inviteLink());
      fetchReferralCount().then(setCount);
    }
  }, []);

  function copy() {
    navigator.clipboard
      ?.writeText(link)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  }

  function share() {
    const text = inviteMessage();
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: "AnyWork4Me", text, url: link }).catch(() => {});
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    }
  }

  if (signedIn === undefined) return null;

  if (!signedIn) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-3 px-5 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
          <IconUsers className="h-7 w-7" />
        </span>
        <h1 className="text-xl font-semibold">Get your invite link</h1>
        <p className="text-sm text-muted">Create a profile to start inviting and earning badges.</p>
        <Link
          href="/signup"
          className="brand-gradient mt-2 rounded-2xl px-5 py-3 text-sm font-semibold text-accent-foreground"
        >
          Create a profile
        </Link>
      </main>
    );
  }

  const badge = count != null ? referralBadge(count) : null;
  const wa = `https://wa.me/?text=${encodeURIComponent(inviteMessage())}`;

  return (
    <main className="mx-auto min-h-dvh w-full max-w-md px-5 pb-16">
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
        <h1 className="text-2xl font-semibold tracking-tight">Invite &amp; earn</h1>
      </header>

      <div className="brand-gradient rounded-4xl px-6 py-8 text-center text-accent-foreground">
        <p className="text-5xl font-semibold">{count ?? "—"}</p>
        <p className="mt-1 opacity-90">friends joined through you</p>
        {badge && (
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-background/20 px-3 py-1 text-sm font-semibold">
            {badge.emoji} {badge.label}
          </span>
        )}
      </div>

      <p className="mt-5 text-center text-muted">
        The more people who join, the more work and customers for everyone. Share your link 👇
      </p>

      {/* Invite link */}
      <div className="mt-5">
        <p className="mb-1 text-sm font-semibold">Your invite link</p>
        <div className="flex gap-2">
          <input
            readOnly
            value={link}
            onFocus={(e) => e.currentTarget.select()}
            className="h-12 min-w-0 flex-1 rounded-2xl border border-border bg-surface-2 px-3.5 text-sm outline-none"
          />
          <button
            onClick={copy}
            className="shrink-0 rounded-2xl border border-border px-4 text-sm font-semibold transition hover:bg-surface"
          >
            {copied ? "Copied ✓" : "Copy"}
          </button>
        </div>
      </div>

      {/* Share buttons */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-2xl bg-green-500 py-3 font-semibold text-white transition active:scale-95"
        >
          WhatsApp
        </a>
        <button
          onClick={share}
          className="brand-gradient flex items-center justify-center gap-2 rounded-2xl py-3 font-semibold text-accent-foreground transition active:scale-95"
        >
          Share…
        </button>
      </div>

      {/* Badge ladder */}
      <div className="mt-8">
        <p className="text-sm font-semibold">Earn recognition</p>
        <ul className="mt-3 space-y-2">
          {TIERS.map((t) => {
            const done = (count ?? 0) >= t.at;
            return (
              <li
                key={t.label}
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm ${
                  done ? "border-accent/40 bg-accent/5" : "border-border"
                }`}
              >
                <span className="flex items-center gap-2 font-medium">
                  {done && <IconCheck className="h-4 w-4 text-accent" />}
                  {t.label}
                </span>
                <span className="text-muted">{t.at} invites</span>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
