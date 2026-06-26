"use client";

import Link from "next/link";
import { useState } from "react";
import { CATEGORIES, PRIMARY_CATEGORIES } from "@/lib/categories";

export function CategoryGrid() {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? CATEGORIES : PRIMARY_CATEGORIES;

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
        {shown.map((c, i) => (
          <Link
            key={c.id}
            href={`/search?category=${c.id}`}
            className="fm-fade-up group flex flex-col items-center gap-2 rounded-3xl border border-border bg-surface-2 p-4 text-center transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md active:scale-[0.97]"
            style={{ animationDelay: `${Math.min(i, 14) * 25}ms` }}
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-background text-2xl shadow-sm transition group-hover:scale-110">
              {c.emoji}
            </span>
            <span className="text-[13px] font-medium leading-tight">{c.name}</span>
          </Link>
        ))}

        {!expanded && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="flex flex-col items-center gap-2 rounded-3xl border border-dashed border-border p-4 text-center text-muted transition hover:border-accent/40 hover:text-foreground active:scale-[0.97]"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface text-2xl">
              ➕
            </span>
            <span className="text-[13px] font-medium leading-tight">View More</span>
          </button>
        )}
      </div>

      {expanded && (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="mx-auto mt-4 block text-sm font-medium text-muted transition hover:text-foreground"
        >
          Show less
        </button>
      )}
    </div>
  );
}
