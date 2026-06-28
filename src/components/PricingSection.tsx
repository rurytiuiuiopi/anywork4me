"use client";

import Link from "next/link";
import { IconArrowRight, IconCheck, IconStar } from "@/components/Icons";
import { formatMoney } from "@/lib/format";
import { useLocation } from "@/lib/location/LocationProvider";
import { PRO_PLAN, proCharge } from "@/lib/pricing";

const FREE_FEATURES = [
  "List your service in minutes",
  "Get discovered by nearby customers",
  "Receive messages & bookings on the site",
  "Collect ratings & reviews",
];

export function PricingSection() {
  const { location } = useLocation();
  const { currency, amount } = proCharge(location.currency);
  const price = formatMoney(amount, currency, location.locale);

  return (
    <section className="mt-16">
      <h2 className="text-center text-xl font-semibold sm:text-2xl">
        Start free. Grow when you’re ready.
      </h2>
      <p className="mx-auto mt-2 max-w-md text-balance text-center text-sm text-muted">
        Listing your service is free — forever. Upgrade to Pro whenever you want to stand out and get
        booked more.
      </p>

      <div className="mx-auto mt-6 grid max-w-3xl gap-4 sm:grid-cols-2">
        {/* Free — the headline plan */}
        <div className="relative rounded-4xl border-2 border-accent/50 bg-background p-6 shadow-sm">
          <span className="absolute right-5 top-6 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
            Start here
          </span>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">Free</p>
          <p className="mt-2 text-3xl font-semibold">
            Free<span className="text-base font-normal text-muted"> forever</span>
          </p>
          <p className="mt-1 text-sm text-muted">Everything you need to get found and get work.</p>
          <ul className="mt-5 space-y-2.5">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm">
                <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/signup"
            className="brand-gradient mt-6 flex items-center justify-center gap-2 rounded-2xl py-3 font-semibold text-accent-foreground transition active:scale-[0.99]"
          >
            Create your profile <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Pro — the optional upgrade */}
        <div className="rounded-4xl border border-border bg-background p-6">
          <p className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-amber-500">
            <IconStar className="h-4 w-4" /> Pro
          </p>
          <p className="mt-2 text-3xl font-semibold">
            {price}
            <span className="text-base font-normal text-muted">/month</span>
          </p>
          <p className="mt-1 text-sm text-muted">For pros ready to stand out and get booked more.</p>
          <ul className="mt-5 space-y-2.5">
            <li className="flex items-start gap-2.5 text-sm font-medium">
              <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span>Everything in Free, plus:</span>
            </li>
            {PRO_PLAN.benefits.map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-sm">
                <IconStar className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/signup"
            className="mt-6 flex items-center justify-center gap-2 rounded-2xl border border-border bg-surface-2 py-3 font-semibold transition hover:border-accent/40 active:scale-[0.99]"
          >
            List free, then upgrade
          </Link>
          <p className="mt-2 text-center text-xs text-muted">
            Upgrade anytime from your own profile — no lock-in.
          </p>
        </div>
      </div>
    </section>
  );
}
