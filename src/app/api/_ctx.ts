import type { UserContext } from "@/lib/types";

/** Build the viewer context from request query params. */
export function ctxFromParams(params: URLSearchParams): UserContext {
  const lat = params.get("lat");
  const lng = params.get("lng");
  return {
    point: lat && lng ? { lat: Number(lat), lng: Number(lng) } : undefined,
    city: params.get("city") ?? undefined,
    country: params.get("country") ?? undefined,
    currency: params.get("currency") ?? undefined,
    locale: params.get("locale") ?? undefined,
    precise: ["1", "true"].includes(params.get("precise") ?? ""),
  };
}
