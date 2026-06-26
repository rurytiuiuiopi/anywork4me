import { formatRating } from "@/lib/format";

export function Rating({
  rating,
  count,
  locale = "en",
  variant = "compact",
}: {
  rating: number;
  count: number;
  locale?: string;
  variant?: "compact" | "full";
}) {
  if (count === 0) {
    return <span className="text-sm text-muted">New</span>;
  }

  if (variant === "full") {
    return (
      <div className="flex items-center gap-2">
        <div className="flex" aria-hidden>
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={i < Math.round(rating) ? "text-amber-400" : "text-border"}
            >
              ★
            </span>
          ))}
        </div>
        <span className="text-sm font-medium">{formatRating(rating, locale)}</span>
        <span className="text-sm text-muted">
          ({new Intl.NumberFormat(locale).format(count)} reviews)
        </span>
      </div>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-sm">
      <span className="text-amber-400">★</span>
      <span className="font-semibold">{formatRating(rating, locale)}</span>
      <span className="text-muted">
        ({new Intl.NumberFormat(locale).format(count)})
      </span>
    </span>
  );
}
