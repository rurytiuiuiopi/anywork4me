"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconSearch } from "@/components/Icons";
import { LocationControl } from "@/components/LocationControl";

export function HomeSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");

  function go(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    router.push(term ? `/search?q=${encodeURIComponent(term)}` : "/search");
  }

  return (
    <form onSubmit={go} className="mx-auto w-full max-w-xl">
      <div className="flex items-center gap-2 rounded-2xl border border-border bg-background p-2 shadow-sm transition focus-within:border-accent">
        <span className="pl-2 text-muted">
          <IconSearch className="h-5 w-5" />
        </span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="What are you looking for?"
          aria-label="What are you looking for?"
          className="h-11 min-w-0 flex-1 bg-transparent text-[15px] outline-none"
        />
        <button
          type="submit"
          className="brand-gradient shrink-0 rounded-xl px-5 py-2.5 text-sm font-semibold text-accent-foreground transition active:scale-95"
        >
          Search
        </button>
      </div>
      <div className="mt-3 flex justify-center">
        <LocationControl compact />
      </div>
    </form>
  );
}
