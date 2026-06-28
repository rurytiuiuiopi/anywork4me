import type { Pricing } from "./types";

/** The largest price a provider can set, to keep listings sane. */
export const MAX_PRICE = 100_000_000;

/**
 * Locale-aware money formatting. Big amounts use compact notation
 * (e.g. "GHS 2.5M") so a price never renders as a wall of digits.
 */
export function formatMoney(
  amount: number,
  currency: string,
  locale = "en",
): string {
  const value = Math.min(Math.max(Number.isFinite(amount) ? amount : 0, 0), MAX_PRICE);
  const compact = value >= 100_000;
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      notation: compact ? "compact" : "standard",
      maximumFractionDigits: compact ? 1 : value % 1 === 0 ? 0 : 2,
    }).format(value);
  } catch {
    return `${currency} ${new Intl.NumberFormat(locale).format(value)}`;
  }
}

const UNIT_LABEL: Record<string, string> = {
  hour: "/hr",
  day: "/day",
  week: "/wk",
  month: "/mo",
  job: "/job",
  session: "/session",
  person: "/person",
  km: "/km",
};

export function formatPricing(p: Pricing, locale = "en"): string {
  const unit = UNIT_LABEL[p.unit] ?? "";
  const from = formatMoney(p.from, p.currency, locale);
  if (p.to && p.to > p.from) {
    const to = formatMoney(p.to, p.currency, locale);
    return `${from}–${to}${unit}`;
  }
  return `From ${from}${unit}`;
}

export function formatRating(rating: number, locale = "en"): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(rating);
}
