"use client";

import { useState } from "react";
import { startUpgrade } from "@/lib/api";
import { formatMoney } from "@/lib/format";
import { PRO_PLAN, proCharge } from "@/lib/pricing";
import type { Provider } from "@/lib/types";

export function UpgradeSheet({
  provider,
  locale,
  onClose,
}: {
  provider: Provider;
  locale: string;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { currency, amount } = proCharge(provider.pricing?.currency);
  const price = formatMoney(amount, currency, locale);

  async function pay() {
    if (!/.+@.+\..+/.test(email.trim())) {
      setError("Enter a valid email for your receipt.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const url = await startUpgrade(provider.id, email.trim());
      window.location.href = url; // → Paystack checkout
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
    >
      <button
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-t-4xl bg-background p-6 shadow-xl sm:rounded-4xl">
        <div className="brand-gradient mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-3xl text-accent-foreground shadow-sm">
          ⭐
        </div>
        <h2 className="mt-4 text-center text-2xl font-semibold tracking-tight">
          Go Pro — get found first
        </h2>
        <p className="mt-1 text-center text-muted">
          Stand out and win more customers for <span className="font-semibold text-foreground">{price}/month</span>.
        </p>

        <ul className="mt-5 space-y-2.5">
          {PRO_PLAN.benefits.map((b) => (
            <li key={b} className="flex items-start gap-2.5 text-[15px]">
              <span className="mt-0.5 font-bold text-accent">✓</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          inputMode="email"
          placeholder="Email for your receipt"
          className="mt-5 h-12 w-full rounded-2xl border border-border bg-surface-2 px-4 text-[15px] outline-none transition focus:border-accent"
        />
        {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}

        <button
          onClick={pay}
          disabled={submitting}
          className="brand-gradient mt-4 flex w-full items-center justify-center rounded-2xl text-base font-semibold text-accent-foreground transition active:scale-[0.99] disabled:opacity-50"
          style={{ height: "3.25rem" }}
        >
          {submitting ? "Starting payment…" : `Pay ${price} with Paystack`}
        </button>
        <p className="mt-2 text-center text-xs text-muted">
          Mobile money or card · secured by Paystack · renew anytime
        </p>
        <button onClick={onClose} className="mt-3 w-full text-center text-sm text-muted">
          Maybe later
        </button>
      </div>
    </div>
  );
}
