"use client";

import Link from "next/link";
import { useFavorites } from "@/lib/favorites/FavoritesProvider";

export function SavedLink() {
  const { count } = useFavorites();
  return (
    <Link
      href="/saved"
      aria-label={`Saved${count ? ` (${count})` : ""}`}
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background shadow-sm transition hover:border-accent/40 active:scale-95"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21s-7.5-4.6-10-9.2C.7 9 1.6 5.5 4.7 4.6 6.8 4 8.8 5 12 8c3.2-3 5.2-4 7.3-3.4 3.1.9 4 4.4 2.7 7.2C19.5 16.4 12 21 12 21z"
        />
      </svg>
      {count > 0 && (
        <span className="brand-gradient absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-bold text-accent-foreground">
          {count}
        </span>
      )}
    </Link>
  );
}
