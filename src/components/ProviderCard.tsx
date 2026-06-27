import Link from "next/link";
import { getCategory } from "@/lib/categories";
import { formatPricing } from "@/lib/format";
import { formatDistance } from "@/lib/geo";
import type { SearchResult } from "@/lib/types";
import { AvailabilityBadge } from "./AvailabilityBadge";
import { Rating } from "./Rating";
import { SaveButton } from "./SaveButton";
import { Thumb } from "./Thumb";
import { VerifiedBadge } from "./VerifiedBadge";

export function ProviderCard({
  result,
  locale = "en",
  precise = false,
}: {
  result: SearchResult;
  locale?: string;
  /** True only when the viewer shared precise GPS — otherwise we show the area, not a fake distance. */
  precise?: boolean;
}) {
  const { provider: p, distanceKm } = result;
  const emoji = getCategory(p.categories[0])?.emoji;

  return (
    <Link
      href={`/provider/${p.id}`}
      className="group relative flex gap-4 rounded-3xl border border-border bg-background p-3 transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]"
    >
      <div className="relative shrink-0">
        <Thumb seed={p.photos[0] ?? p.id} emoji={emoji} className="h-24 w-24" emojiClassName="text-4xl" />
        <div className="absolute right-1.5 top-1.5">
          <SaveButton id={p.id} />
        </div>
      </div>

      <div className="min-w-0 flex-1 py-0.5">
        <div className="flex items-center gap-1.5">
          <h3 className="truncate font-semibold leading-tight">
            {p.business ?? p.name}
          </h3>
          {p.verified && <VerifiedBadge className="shrink-0" />}
        </div>
        {p.tagline && (
          <p className="mt-0.5 truncate text-sm text-muted">{p.tagline}</p>
        )}

        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
          <Rating rating={p.rating} count={p.reviewsCount} locale={locale} />
          <span className="text-sm text-muted">·</span>
          <span className="text-sm text-muted">
            {precise ? formatDistance(distanceKm, locale) : p.location.city}
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <AvailabilityBadge status={p.availability} />
          {p.pricing && (
            <span className="text-sm font-semibold">
              {formatPricing(p.pricing, locale)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
