"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Brand } from "@/components/Brand";
import { CardSkeletonList } from "@/components/CardSkeleton";
import { ProviderCard } from "@/components/ProviderCard";
import { fetchProvider } from "@/lib/api";
import { useFavorites } from "@/lib/favorites/FavoritesProvider";
import { distanceKm } from "@/lib/geo";
import { useLocation } from "@/lib/location/LocationProvider";
import type { SearchResult } from "@/lib/types";

export default function SavedPage() {
  const { ids } = useFavorites();
  const { ctx, location } = useLocation();
  const [results, setResults] = useState<SearchResult[] | null>(null);

  useEffect(() => {
    if (ids.length === 0) {
      setResults([]);
      return;
    }
    const ac = new AbortController();
    setResults(null);
    Promise.all(ids.map((id) => fetchProvider(id, ctx, ac.signal).catch(() => null)))
      .then((providers) => {
        const list = providers
          .filter((p): p is NonNullable<typeof p> => Boolean(p))
          .map<SearchResult>((p) => ({
            provider: p,
            distanceKm: ctx.point ? distanceKm(ctx.point, p.location.point) : 0,
            score: 0,
          }));
        setResults(list);
      })
      .catch(() => setResults([]));
    return () => ac.abort();
  }, [ids, ctx]);

  return (
    <main className="mx-auto min-h-dvh w-full max-w-2xl px-5 pb-16">
      <header className="flex items-center justify-between gap-3 py-5">
        <Brand />
        <Link
          href="/"
          aria-label="Back"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background shadow-sm transition hover:bg-surface active:scale-95"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </Link>
      </header>

      <h1 className="pt-2 text-3xl font-semibold tracking-tight">Saved</h1>
      <p className="mt-1 text-muted">
        {results === null
          ? "Loading…"
          : results.length === 0
            ? "Tap the heart on any provider to save them here."
            : `${results.length} saved provider${results.length === 1 ? "" : "s"}`}
      </p>

      <div className="mt-6">
        {results === null ? (
          <CardSkeletonList count={3} />
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-surface-2 px-6 py-16 text-center">
            <span className="text-4xl">🤍</span>
            <h2 className="text-lg font-semibold">Nothing saved yet</h2>
            <p className="max-w-sm text-balance text-sm text-muted">
              Save your favourite people and businesses so they’re one tap away.
            </p>
            <Link
              href="/"
              className="brand-gradient mt-2 rounded-full px-5 py-2.5 text-sm font-semibold text-accent-foreground"
            >
              Start searching
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {results.map((r) => (
              <li key={r.provider.id}>
                <ProviderCard result={r} locale={location.locale} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
