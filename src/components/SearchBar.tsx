"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBar({
  initialQuery = "",
  size = "lg",
  autoFocus = false,
  placeholder = "Search DJ, plumber, food…",
}: {
  initialQuery?: string;
  size?: "lg" | "md";
  autoFocus?: boolean;
  placeholder?: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
  };

  const big = size === "lg";

  return (
    <form onSubmit={submit} role="search" className="w-full">
      <div
        className={`group flex items-center gap-3 rounded-full border border-border bg-background shadow-sm transition focus-within:border-accent focus-within:shadow-md ${
          big ? "px-5" : "h-12 px-4"
        }`}
        style={big ? { height: "3.75rem" } : undefined}
      >
        <SearchIcon className={big ? "h-5 w-5 shrink-0 text-muted" : "h-4 w-4 shrink-0 text-muted"} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoFocus={autoFocus}
          enterKeyHint="search"
          inputMode="search"
          aria-label="Search"
          placeholder={placeholder}
          className={`w-full bg-transparent outline-none placeholder:text-muted ${big ? "text-lg" : "text-base"}`}
        />
        {q && (
          <button
            type="button"
            onClick={() => setQ("")}
            aria-label="Clear"
            className="text-muted transition hover:text-foreground"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        )}
        <button
          type="submit"
          aria-label="Search"
          className={`brand-gradient -mr-2 flex shrink-0 items-center justify-center rounded-full text-accent-foreground transition active:scale-95 ${
            big ? "h-12 w-12" : "h-9 w-9"
          }`}
        >
          <SearchIcon className={big ? "h-5 w-5" : "h-4 w-4"} />
        </button>
      </div>
    </form>
  );
}

function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="11" cy="11" r="7" />
      <path strokeLinecap="round" d="M21 21l-4.3-4.3" />
    </svg>
  );
}
