"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { IconSearch } from "@/components/Icons";
import { LocationControl } from "@/components/LocationControl";
import { CATEGORIES } from "@/lib/categories";

export function HomeSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const term = q.trim().toLowerCase();
  const suggestions = useMemo(() => {
    if (term.length < 1) return [];
    return CATEGORIES.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.keywords.some((k) => k.toLowerCase().includes(term)),
    ).slice(0, 6);
  }, [term]);

  function goSearch(text: string) {
    const t = text.trim();
    router.push(t ? `/search?q=${encodeURIComponent(t)}` : "/search");
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        goSearch(q);
      }}
      className="relative mx-auto w-full max-w-xl"
    >
      <div className="flex items-center gap-2 rounded-2xl border border-border bg-background p-2 shadow-sm transition focus-within:border-accent">
        <span className="pl-2 text-muted">
          <IconSearch className="h-5 w-5" />
        </span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="What do you need? e.g. plumber, photographer, DJ…"
          aria-label="What do you need?"
          className="h-11 min-w-0 flex-1 bg-transparent text-[15px] outline-none"
        />
        <button
          type="submit"
          className="brand-gradient shrink-0 rounded-xl px-5 py-2.5 text-sm font-semibold text-accent-foreground transition active:scale-95"
        >
          Search
        </button>
      </div>

      {open && term.length >= 1 && (
        <div className="absolute inset-x-0 z-30 mt-2 overflow-hidden rounded-2xl border border-border bg-background text-left shadow-lg">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              goSearch(q);
            }}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm transition hover:bg-surface"
          >
            <IconSearch className="h-4 w-4 text-muted" />
            <span>
              Search “<span className="font-medium">{q.trim()}</span>”
            </span>
          </button>
          {suggestions.map((c) => (
            <button
              key={c.id}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                router.push(`/search?category=${c.id}`);
              }}
              className="flex w-full items-center gap-3 border-t border-border px-4 py-3 text-sm transition hover:bg-surface"
            >
              <span>{c.emoji}</span>
              <span className="font-medium">{c.name}</span>
              <span className="text-muted">· browse nearby</span>
            </button>
          ))}
        </div>
      )}

      <div className="mt-3 flex justify-center">
        <LocationControl compact />
      </div>
    </form>
  );
}
