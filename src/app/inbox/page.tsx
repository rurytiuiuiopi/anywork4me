"use client";

import Link from "next/link";
import { Conversations } from "@/components/Conversations";
import { SupportThread } from "@/components/SupportThread";

export default function InboxPage() {
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

      <SupportThread />

      <div className="mt-6">
        <Conversations />
      </div>
    </main>
  );
}
