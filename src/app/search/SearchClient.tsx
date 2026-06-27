"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CardSkeletonList } from "@/components/CardSkeleton";
import { LocationControl } from "@/components/LocationControl";
import { ProviderCard } from "@/components/ProviderCard";
import { SearchBar } from "@/components/SearchBar";
import { searchProviders } from "@/lib/api";
import { getCategory } from "@/lib/categories";
import { useLocation } from "@/lib/location/LocationProvider";
import type { SearchResult } from "@/lib/types";

export function SearchClient() {
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const category = params.get("category") ?? "";
  const { ctx, location } = useLocation();

  const cat = category ? getCategory(category) : undefined;
  const heading = cat ? `${cat.emoji} ${cat.name}` : q ? `“${q}”` : "Nearby";

  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    setResults(null);
    setError(null);
    searchProviders({
      q: q || undefined,
      category: category || undefined,
      ctx,
      signal: ac.signal,
    })
      .then(setResults)
      .catch((e: Error) => {
        if (e.name !== "AbortError") setError("Something went wrong. Try again.");
      });
    return () => ac.abort();
  }, [q, category, ctx]);

  return (
    <main className="mx-auto min-h-dvh w-full max-w-2xl px-5 pb-20">
      <header className="sticky top-0 z-20 -mx-5 bg-background/85 px-5 pb-3 pt-4 backdrop-blur-md">
        <div className="mb-3 flex items-center gap-3">
          <Link
            href="/"
            aria-label="Back"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-background shadow-sm transition hover:bg-surface active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
            </svg>
          </Link>
          <div className="flex-1">
            <SearchBar size="md" initialQuery={q} placeholder={cat ? `Search in ${cat.name}…` : "Search…"} />
          </div>
        </div>
      </header>

      <div className="flex items-end justify-between gap-3 pt-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{heading}</h1>
          <p className="mt-0.5 text-sm text-muted">
            {results === null
              ? `Searching near ${location.city}…`
              : `${results.length} ${results.length === 1 ? "result" : "results"} near ${location.city}`}
          </p>
        </div>
        <LocationControl compact />
      </div>

      <div className="mt-5">
        {error ? (
          <EmptyState
            emoji="⚠️"
            title="Couldn’t load results"
            body={error}
          />
        ) : results === null ? (
          <CardSkeletonList />
        ) : results.length === 0 ? (
          <EmptyState
            emoji="🔍"
            title="No matches yet"
            body={`We couldn't find providers for ${heading} near ${location.city}. Try another search.`}
            cta
          />
        ) : (
          <ul className="space-y-3">
            {results.map((r, i) => (
              <li
                key={r.provider.id}
                className="fm-fade-up"
                style={{ animationDelay: `${Math.min(i, 12) * 35}ms` }}
              >
                <ProviderCard result={r} locale={location.locale} precise={location.source === "gps"} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

function EmptyState({
  emoji,
  title,
  body,
  cta = false,
}: {
  emoji: string;
  title: string;
  body: string;
  cta?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-surface-2 px-6 py-14 text-center">
      <span className="text-4xl">{emoji}</span>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="max-w-sm text-balance text-sm text-muted">{body}</p>
      {cta && (
        <Link
          href="/"
          className="mt-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition hover:bg-surface"
        >
          Back to home
        </Link>
      )}
    </div>
  );
}
