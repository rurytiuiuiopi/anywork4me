import type { GeoPoint } from "./types";

const EARTH_RADIUS_KM = 6371;
const toRad = (d: number) => (d * Math.PI) / 180;

/** Great-circle distance in kilometres. */
export function distanceKm(a: GeoPoint, b: GeoPoint): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

/**
 * Offset a base point by east/north kilometres. Used to place mock providers
 * *relative to the viewer*, so everyone sees a believable local marketplace.
 */
export function offsetPoint(
  base: GeoPoint,
  eastKm: number,
  northKm: number,
): GeoPoint {
  const dLat = northKm / 110.574;
  const dLng = eastKm / (111.32 * Math.cos(toRad(base.lat)) || 1);
  return { lat: base.lat + dLat, lng: base.lng + dLng };
}

export function formatDistance(km: number, locale = "en"): string {
  // Honest precision: no fabricated minimum. Very close = "just around you".
  if (km < 0.1) return "just around you";
  if (km < 1) {
    const m = Math.round((km * 1000) / 50) * 50; // nearest 50 m
    return new Intl.NumberFormat(locale).format(m) + " m away";
  }
  const rounded = km < 10 ? Math.round(km * 10) / 10 : Math.round(km);
  return new Intl.NumberFormat(locale).format(rounded) + " km away";
}
