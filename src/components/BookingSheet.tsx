"use client";

import { useEffect, useState } from "react";
import type { Provider } from "@/lib/types";

// Phase 1 booking request. Captures intent locally and confirms — the booking
// pipeline (payments, provider acceptance, commission) is architected for later
// phases behind feature flags.
export function BookingSheet({
  provider,
  open,
  onClose,
}: {
  provider: Provider;
  open: boolean;
  onClose: () => void;
}) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!open) return;
    setDone(false);
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" />
      <div className="fm-fade-up relative z-10 w-full rounded-t-4xl border border-border bg-background p-6 shadow-lg sm:max-w-md sm:rounded-4xl">
        {done ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <span className="brand-gradient flex h-14 w-14 items-center justify-center rounded-full text-2xl text-accent-foreground">
              ✓
            </span>
            <h2 className="text-xl font-semibold">Request sent</h2>
            <p className="max-w-xs text-balance text-sm text-muted">
              {provider.business ?? provider.name} will confirm your booking shortly. You’ll
              see it under Bookings.
            </p>
            <button
              onClick={onClose}
              className="brand-gradient mt-2 h-11 rounded-2xl px-6 font-semibold text-accent-foreground"
            >
              Done
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setDone(true);
            }}
          >
            <h2 className="text-xl font-semibold">Book {provider.name}</h2>
            <p className="mt-1 text-sm text-muted">Pick a time that works for you.</p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1 block text-sm font-medium">Date</span>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-12 w-full rounded-2xl border border-border bg-surface-2 px-3 outline-none focus:border-accent"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium">Time</span>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="h-12 w-full rounded-2xl border border-border bg-surface-2 px-3 outline-none focus:border-accent"
                />
              </label>
            </div>

            <label className="mt-3 block">
              <span className="mb-1 block text-sm font-medium">Details (optional)</span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="What do you need?"
                className="w-full resize-none rounded-2xl border border-border bg-surface-2 px-3 py-2.5 outline-none focus:border-accent"
              />
            </label>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="h-12 flex-1 rounded-2xl border border-border font-semibold transition hover:bg-surface"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="brand-gradient h-12 flex-1 rounded-2xl font-semibold text-accent-foreground transition active:scale-[0.98]"
              >
                Request booking
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
