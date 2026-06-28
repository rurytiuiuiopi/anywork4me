// What kind of listing this is. Chosen up-front when posting so a listing can
// show the right intent badge ("Hiring", "For sale", "Open to work"...).

export const LISTING_TYPES = [
  { id: "service", label: "I offer a service", hint: "Sell your skills or service", badge: "Service" },
  { id: "product", label: "I’m selling a product", hint: "List something for sale", badge: "For sale" },
  { id: "work", label: "I’m looking for work", hint: "Get hired for jobs", badge: "Open to work" },
  { id: "hiring", label: "I’m hiring", hint: "Find people to hire", badge: "Hiring" },
  { id: "need", label: "I need someone", hint: "Request help or a quote", badge: "Request" },
] as const;

export type ListingType = (typeof LISTING_TYPES)[number]["id"];

/** Only accept a known listing type (defence in depth for the API). */
export function cleanIntent(value: unknown): string | undefined {
  return typeof value === "string" && LISTING_TYPES.some((t) => t.id === value)
    ? value
    : undefined;
}

/** Short badge label for a listing's intent, e.g. "Hiring". */
export function intentBadge(id?: string): string | undefined {
  return LISTING_TYPES.find((t) => t.id === id)?.badge;
}
