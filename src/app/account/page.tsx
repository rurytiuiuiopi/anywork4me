"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { IconUser } from "@/components/Icons";
import { deleteProvider } from "@/lib/api";
import { signOutAuth } from "@/lib/auth";
import { forgetListing, getOwnedListings } from "@/lib/ownership";
import { getProfile, isSignedIn, type LocalProfile } from "@/lib/profile";

export default function AccountPage() {
  const [profile, setProfile] = useState<LocalProfile | null | undefined>(undefined);
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(false);

  useEffect(() => setProfile(isSignedIn() ? getProfile() : null), []);

  function exportData() {
    const data = {
      profile: getProfile(),
      listings: getOwnedListings().map((l) => l.id),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "anywork4me-data.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function deleteAccount() {
    if (!confirm) {
      setConfirm(true);
      return;
    }
    setBusy(true);
    for (const { id, token } of getOwnedListings()) {
      try {
        await deleteProvider(id, token);
      } catch {
        /* best-effort */
      }
      forgetListing(id);
    }
    await signOutAuth();
    window.location.href = "/";
  }

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
        <h1 className="text-2xl font-semibold tracking-tight">Account & data</h1>
      </header>

      {profile === undefined ? null : !profile ? (
        <div className="rounded-3xl border border-border bg-background p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
            <IconUser className="h-6 w-6" />
          </div>
          <p className="mt-3 text-muted">Sign in to manage your account.</p>
          <Link
            href="/signin"
            className="brand-gradient mt-4 inline-flex rounded-2xl px-5 py-3 text-sm font-semibold text-accent-foreground"
          >
            Sign in
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-3xl border border-border bg-background p-5">
            <span className="brand-gradient flex h-12 w-12 items-center justify-center rounded-full font-semibold text-accent-foreground">
              {profile.name.slice(0, 1).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate font-semibold">{profile.name}</p>
              <p className="truncate text-sm text-muted">{profile.email ?? "—"}</p>
            </div>
          </div>

          <section className="rounded-3xl border border-border bg-background p-5">
            <h2 className="font-semibold">Export your data</h2>
            <p className="mt-1 text-sm text-muted">Download a copy of your profile and listings.</p>
            <button
              onClick={exportData}
              className="mt-3 rounded-2xl border border-border px-4 py-2.5 text-sm font-semibold transition hover:bg-surface"
            >
              Download my data (JSON)
            </button>
          </section>

          <section className="rounded-3xl border border-red-200 bg-red-50/60 p-5 dark:border-red-900/50 dark:bg-red-950/30">
            <h2 className="font-semibold text-red-700 dark:text-red-300">Delete my account</h2>
            <p className="mt-1 text-sm text-muted">
              Removes your listings and signs you out on this device. This can’t be undone.
            </p>
            <button
              onClick={deleteAccount}
              disabled={busy}
              className="mt-3 rounded-2xl border border-red-300 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition active:scale-[0.99] disabled:opacity-50 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
            >
              {busy ? "Deleting…" : confirm ? "Tap again to permanently delete" : "Delete my account"}
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
