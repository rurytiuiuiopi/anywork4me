"use client";

import { useEffect, useState } from "react";
import { useLocation } from "@/lib/location/LocationProvider";

export function LocationControl({ compact = false }: { compact?: boolean }) {
  const { location, countries, setCountry, usePreciseLocation } = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-sm font-medium shadow-sm transition hover:border-accent/40 active:scale-95"
      >
        <PinIcon />
        <span className="truncate">
          {compact ? location.city : location.label}
        </span>
        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-muted" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
          />
          <div className="fm-fade-up relative z-10 max-h-[80vh] w-full overflow-hidden rounded-t-4xl border border-border bg-background shadow-lg sm:max-w-md sm:rounded-4xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold">Your location</h2>
                <p className="text-sm text-muted">Results adapt to where you are.</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-muted transition hover:text-foreground"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                usePreciseLocation();
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 border-b border-border px-5 py-3.5 text-left transition hover:bg-surface"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent">
                <PinIcon />
              </span>
              <span className="text-sm font-medium text-accent">Use my precise location</span>
            </button>

            <ul className="max-h-[52vh] overflow-y-auto py-1">
              {countries.map((c) => {
                const active = c.code === location.country;
                return (
                  <li key={c.code}>
                    <button
                      type="button"
                      onClick={() => {
                        setCountry(c.code);
                        setOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 px-5 py-3 text-left transition hover:bg-surface ${active ? "bg-surface" : ""}`}
                    >
                      <span className="text-xl">{c.flag}</span>
                      <span className="flex-1">
                        <span className="block text-sm font-medium">{c.name}</span>
                        <span className="block text-xs text-muted">
                          {c.capital} · {c.currency}
                        </span>
                      </span>
                      {active && (
                        <svg viewBox="0 0 24 24" className="h-5 w-5 text-accent" fill="none" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-accent" fill="currentColor" aria-hidden>
      <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z" />
    </svg>
  );
}
