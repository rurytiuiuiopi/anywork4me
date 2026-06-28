"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { IconPlus } from "@/components/Icons";
import { ProviderCard } from "@/components/ProviderCard";
import { searchProviders } from "@/lib/api";
import { useLocation } from "@/lib/location/LocationProvider";
import type { SearchResult } from "@/lib/types";

export function FeaturedListings() {
  const { ctx, location } = useLocation();
  const [results, setResults] = useState<SearchResult[] | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    searchProviders({ ctx, limit: 6, signal: ac.signal })
      .then(setResults)
      .catch(() => setResults([]));
    return () => ac.abort();
  }, [ctx]);

  if (results === null) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="fm-skeleton h-32 rounded-3xl" />
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <Link
        href="/signup"
        className="flex flex-col items-center gap-2 rounded-3xl border border-dashed border-border bg-background p-10 text-center transition hover:border-accent/40"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
          <IconPlus className="h-6 w-6" />
        </span>
        <span className="font-semibold">Be the first to post here</span>
        <span className="text-sm text-muted">Create your profile and add a listing.</span>
      </Link>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {results.map((r) => (
        <ProviderCard
          key={r.provider.id}
          result={r}
          locale={location.locale}
          precise={location.source === "gps"}
        />
      ))}
    </div>
  );
}
