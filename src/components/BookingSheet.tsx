"use client";

import { useEffect, useState } from "react";
import { IconCheck } from "@/components/Icons";
import { sendMessage } from "@/lib/api";
import { markChatStarted } from "@/lib/ownership";
import type { Provider } from "@/lib/types";

const waNumber = (p: Provider) => (p.whatsapp ?? p.phone ?? "").replace(/[^\d]/g, "");

// Booking request → delivered to the provider's WhatsApp instantly, so they're
// notified the moment someone books them. No accounts or email setup needed —
// WhatsApp is the fastest, most reliable channel for this audience.
export function BookingSheet({
  provider,
  open,
  onClose,
}: {
  provider: Provider;
  open: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!open) return;
    setDone(false);
    setName("");
    setDate("");
    setTime("");
    setNote("");
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const number = waNumber(provider);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // Drop the booking into the provider's in-app inbox (best-effort).
    void sendMessage(provider.id, {
      senderName: name.trim() || "A customer",
      body: `Booking request\nDate: ${date}\nTime: ${time}${note ? `\nDetails: ${note}` : ""}`,
      kind: "booking",
    }).catch(() => {});
    markChatStarted(); // so the customer can read the provider's reply in their Messages
    if (number) {
      const text = encodeURIComponent(
        `Hi ${provider.name}, I'd like to book you (via anywork4me).\n\n` +
          `Name: ${name}\nDate: ${date}\nTime: ${time}` +
          (note ? `\nDetails: ${note}` : ""),
      );
      window.open(`https://wa.me/${number}?text=${text}`, "_blank", "noopener,noreferrer");
    }
    setDone(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" />
      <div className="fm-fade-up relative z-10 w-full rounded-t-4xl border border-border bg-background p-6 shadow-lg sm:max-w-md sm:rounded-4xl">
        {done ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <span className="brand-gradient flex h-14 w-14 items-center justify-center rounded-full text-accent-foreground">
              <IconCheck className="h-7 w-7" />
            </span>
            <h2 className="text-xl font-semibold">Booking sent</h2>
            <p className="max-w-xs text-balance text-sm text-muted">
              {number
                ? `We’ve opened WhatsApp so ${provider.business ?? provider.name} gets your booking right away. Tap send to confirm.`
                : `${provider.business ?? provider.name} hasn’t added a contact yet — try the Call or Chat buttons.`}
            </p>
            <button
              onClick={onClose}
              className="brand-gradient mt-2 h-11 rounded-2xl px-6 font-semibold text-accent-foreground"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <h2 className="text-xl font-semibold">Book {provider.name}</h2>
            <p className="mt-1 text-sm text-muted">
              They’ll get your request on WhatsApp instantly.
            </p>

            <label className="mt-5 block">
              <span className="mb-1 block text-sm font-medium">Your name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Ama"
                className="h-12 w-full rounded-2xl border border-border bg-surface-2 px-3.5 outline-none focus:border-accent"
              />
            </label>

            <div className="mt-3 grid grid-cols-2 gap-3">
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
                Send booking
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
