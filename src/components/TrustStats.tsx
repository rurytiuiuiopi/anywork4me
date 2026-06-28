"use client";

import { useEffect, useState } from "react";
import { fetchStats } from "@/lib/api";

export function TrustStats() {
  const [s, setS] = useState<{ providers: number; reviews: number; categories: number } | null>(
    null,
  );

  useEffect(() => {
    fetchStats().then(setS);
  }, []);

  const items = [
    { label: "Professionals", value: s?.providers },
    { label: "Reviews", value: s?.reviews },
    { label: "Categories", value: s?.categories },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map((it) => (
        <div key={it.label} className="rounded-3xl border border-border bg-background p-4 text-center">
          <p className="text-2xl font-semibold sm:text-3xl">
            {it.value == null ? "—" : `${it.value.toLocaleString()}${it.value > 0 ? "+" : ""}`}
          </p>
          <p className="mt-0.5 text-xs text-muted sm:text-sm">{it.label}</p>
        </div>
      ))}
    </div>
  );
}
