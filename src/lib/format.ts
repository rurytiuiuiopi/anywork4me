import type { Pricing } from "./types";

/** Locale-aware money formatting. Falls back gracefully for unknown currencies. */
export function formatMoney(
  amount: number,
  currency: string,
  locale = "en",
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}

const UNIT_LABEL: Record<string, string> = {
  hour: "/hr",
  day: "/day",
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
