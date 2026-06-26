import { getCategory } from "../categories";
import { features } from "../config";
import type { Provider } from "../types";

// Shared relevance + ranking logic, used by every repository implementation so
// search behaves identically regardless of the backing data source.

export function matchesText(p: Provider, needle: string): boolean {
  if (!needle) return true;
  const haystack = [
    p.name,
    p.business ?? "",
    p.tagline ?? "",
    p.bio ?? "",
    ...p.categories,
    ...p.categories.flatMap((c) => getCategory(c)?.keywords ?? []),
    ...p.categories.map((c) => getCategory(c)?.name ?? ""),
  ]
    .join(" ")
    .toLowerCase();
  return needle
    .toLowerCase()
    .split(/\s+/)
    .every((tok) => haystack.includes(tok));
}

export function scoreProvider(
  p: Provider,
  distanceKm: number,
  q: string | undefined,
  catId: string | undefined,
): number {
  let s = 0;
  if (catId && p.categories.includes(catId)) s += 50;
  if (q && matchesText(p, q)) s += 25;
  s += p.rating * 6; // quality
  s += Math.log10(p.reviewsCount + 1) * 4; // social proof
  if (p.availability === "available") s += 8;
  else if (p.availability === "busy") s += 2;
  s += Math.max(0, 12 - distanceKm * 1.5); // proximity, gentle

  // Monetization signals — only count when the flags are enabled (Phase 2+).
  if (features.monetization.premiumPlacement && p.featured) s += 15;
  if (features.monetization.sponsoredResults && p.sponsored) s += 10;
  return s;
}
