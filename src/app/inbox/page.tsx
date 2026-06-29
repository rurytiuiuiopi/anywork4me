"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Conversations } from "@/components/Conversations";
import { Notifications } from "@/components/Notifications";
import { SupportThread } from "@/components/SupportThread";

type Tab = "notifications" | "messages";

export default function InboxPage() {
  const [tab, setTab] = useState<Tab>("messages");

  // Open on the tab the icon pointed at (bell → notifications, chat → messages).
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("tab");
    if (t === "notifications") setTab("notifications");
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

      <div className="mb-5 inline-flex rounded-2xl border border-border bg-surface-2 p-1 text-sm font-semibold">
        {(["notifications", "messages"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-xl px-4 py-1.5 capitalize transition ${
              tab === t ? "bg-background shadow-sm" : "text-muted hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "notifications" ? (
        <Notifications />
      ) : (
        <>
          <SupportThread />
          <div className="mt-6">
            <Conversations />
          </div>
        </>
      )}
    </main>
  );
}
