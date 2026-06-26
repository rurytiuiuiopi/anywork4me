"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AvailabilityBadge } from "@/components/AvailabilityBadge";
import { BookingSheet } from "@/components/BookingSheet";
import { Rating } from "@/components/Rating";
import { SaveButton } from "@/components/SaveButton";
import { Thumb } from "@/components/Thumb";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { fetchProvider } from "@/lib/api";
import { getCategory } from "@/lib/categories";
import { features } from "@/lib/config";
import { formatPricing } from "@/lib/format";
import { distanceKm, formatDistance } from "@/lib/geo";
import { useLocation } from "@/lib/location/LocationProvider";
import type { Provider } from "@/lib/types";

const tel = (phone?: string) => `tel:${(phone ?? "").replace(/\s+/g, "")}`;
const wa = (phone?: string) => `https://wa.me/${(phone ?? "").replace(/[^\d]/g, "")}`;

function timeAgo(iso: string, locale = "en"): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.round(diff / 86_400_000);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  if (days < 1) return "today";
  if (days < 30) return rtf.format(-days, "day");
  if (days < 365) return rtf.format(-Math.round(days / 30), "month");
  return rtf.format(-Math.round(days / 365), "year");
}

export function ProfileClient({ id }: { id: string }) {
  const { ctx, location } = useLocation();
  const [provider, setProvider] = useState<Provider | null | undefined>(undefined);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const ac = new AbortController();
    fetchProvider(id, ctx, ac.signal)
      .then(setProvider)
      .catch((e: Error) => {
        if (e.name !== "AbortError") setProvider(null);
      });
    return () => ac.abort();
  }, [id, ctx]);

  if (provider === undefined) return <ProfileSkeleton />;
  if (provider === null) return <NotFound />;

  const emoji = getCategory(provider.categories[0])?.emoji;
  const dist = ctx.point ? distanceKm(ctx.point, provider.location.point) : null;

  return (
    <main className="mx-auto min-h-dvh w-full max-w-2xl pb-28">
      {/* Hero */}
      <div className="relative">
        <Thumb
          seed={provider.photos[0] ?? provider.id}
          emoji={emoji}
          rounded="rounded-none sm:rounded-b-4xl"
          className="aspect-[5/3] w-full sm:aspect-[2/1]"
          emojiClassName="text-7xl"
        />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
          <Link
            href="/search"
            aria-label="Back"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-background/85 shadow-sm backdrop-blur transition active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
            </svg>
          </Link>
          <SaveButton id={provider.id} />
        </div>
        <div className="absolute bottom-3 left-4">
          <span className="rounded-full bg-background/85 px-3 py-1.5 shadow-sm backdrop-blur">
            <AvailabilityBadge status={provider.availability} />
          </span>
        </div>
      </div>

      <div className="px-5">
        {/* Identity */}
        <section className="pt-5">
          <div className="flex items-start gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              {provider.business ?? provider.name}
            </h1>
            {provider.verified && features.trust.verifiedBadges && (
              <span className="mt-1.5">
                <VerifiedBadge />
              </span>
            )}
          </div>
          {provider.business && provider.business !== provider.name && (
            <p className="mt-0.5 text-muted">with {provider.name}</p>
          )}
          {provider.tagline && <p className="mt-2 text-[15px]">{provider.tagline}</p>}

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
            <Rating rating={provider.rating} count={provider.reviewsCount} locale={location.locale} variant="full" />
          </div>

          <div className="mt-2 flex items-center gap-1.5 text-sm text-muted">
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-accent" fill="currentColor">
              <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z" />
            </svg>
            <span>{provider.location.label}</span>
            {dist !== null && <span>· {formatDistance(dist, location.locale)}</span>}
          </div>
        </section>

        {/* Categories */}
        <section className="mt-4 flex flex-wrap gap-2">
          {provider.categories.map((c) => {
            const cat = getCategory(c);
            if (!cat) return null;
            return (
              <Link
                key={c}
                href={`/search?category=${c}`}
                className="rounded-full border border-border bg-surface-2 px-3 py-1.5 text-sm font-medium transition hover:border-accent/40"
              >
                {cat.emoji} {cat.name}
              </Link>
            );
          })}
        </section>

        {/* Pricing */}
        {provider.pricing && (
          <section className="mt-5 flex items-center justify-between rounded-3xl border border-border bg-surface-2 px-5 py-4">
            <div>
              <p className="text-sm text-muted">Starting price</p>
              <p className="text-lg font-semibold">
                {formatPricing(provider.pricing, location.locale)}
              </p>
            </div>
            <span className="text-2xl">💸</span>
          </section>
        )}

        {/* About */}
        {provider.bio && (
          <section className="mt-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">About</h2>
            <p className="mt-2 leading-relaxed">{provider.bio}</p>
          </section>
        )}

        {/* Gallery */}
        <section className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Portfolio</h2>
          <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto pb-1">
            {provider.photos.map((seed) => (
              <Thumb
                key={seed}
                seed={seed}
                emoji={emoji}
                className="h-28 w-28 shrink-0"
                emojiClassName="text-3xl"
              />
            ))}
          </div>
        </section>

        {/* Reviews */}
        {features.trust.reviews && provider.reviews.length > 0 && (
          <section className="mt-7">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              Reviews ({new Intl.NumberFormat(location.locale).format(provider.reviewsCount)})
            </h2>
            <ul className="mt-3 space-y-4">
              {provider.reviews.map((rv) => (
                <li key={rv.id} className="flex gap-3">
                  <Thumb seed={rv.author} className="h-10 w-10 shrink-0" rounded="rounded-full" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium">{rv.author}</span>
                      <span className="text-xs text-muted">{timeAgo(rv.createdAt, location.locale)}</span>
                    </div>
                    <div className="text-sm text-amber-400" aria-label={`${rv.rating} stars`}>
                      {"★".repeat(rv.rating)}
                      <span className="text-border">{"★".repeat(5 - rv.rating)}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted">{rv.comment}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* Sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center gap-2 px-5 py-3">
          {features.actions.call && (
            <a
              href={tel(provider.phone)}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-border font-semibold transition hover:bg-surface active:scale-[0.98]"
            >
              <PhoneIcon /> Call
            </a>
          )}
          {features.actions.chat && (
            <a
              href={wa(provider.whatsapp ?? provider.phone)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-border font-semibold transition hover:bg-surface active:scale-[0.98]"
            >
              <ChatIcon /> Chat
            </a>
          )}
          {features.actions.book && (
            <button
              onClick={() => setBooking(true)}
              className="brand-gradient flex h-12 flex-[1.4] items-center justify-center gap-2 rounded-2xl font-semibold text-accent-foreground transition active:scale-[0.98]"
            >
              Book now
            </button>
          )}
        </div>
      </div>

      <BookingSheet provider={provider} open={booking} onClose={() => setBooking(false)} />
    </main>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5.5C3 4 4 3 5.5 3H7l2 5-2 1.5a13 13 0 005.5 5.5L14 13l5 2v1.5c0 1.5-1 2.5-2.5 2.5A13.5 13.5 0 013 5.5z" />
    </svg>
  );
}
function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 5h16v11H8l-4 4V5z" />
    </svg>
  );
}

function ProfileSkeleton() {
  return (
    <main className="mx-auto min-h-dvh w-full max-w-2xl pb-28">
      <div className="fm-skeleton aspect-[5/3] w-full sm:aspect-[2/1] sm:rounded-b-4xl" />
      <div className="space-y-3 px-5 pt-5">
        <div className="fm-skeleton h-7 w-2/3 rounded-lg" />
        <div className="fm-skeleton h-4 w-1/2 rounded-md" />
        <div className="fm-skeleton h-4 w-1/3 rounded-md" />
        <div className="fm-skeleton h-24 w-full rounded-3xl" />
        <div className="fm-skeleton h-20 w-full rounded-3xl" />
      </div>
    </main>
  );
}

function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col items-center justify-center gap-3 px-5 text-center">
      <span className="text-5xl">🤔</span>
      <h1 className="text-xl font-semibold">Provider not found</h1>
      <p className="text-sm text-muted">This profile may have been removed.</p>
      <Link href="/" className="mt-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition hover:bg-surface">
        Back to home
      </Link>
    </main>
  );
}
