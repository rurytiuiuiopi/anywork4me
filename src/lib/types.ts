// FINDME — core domain model.
// Country-agnostic by design: nothing here assumes a specific nation, currency,
// or language. Localization is resolved at request time from the user's context.

export type CategoryId = string;

export interface Category {
  id: CategoryId;
  name: string;
  emoji: string;
  /** Search synonyms so "mechanic" finds "Auto Repair", etc. */
  keywords: string[];
  group: string;
  /** Shown on the home screen when true. */
  primary?: boolean;
}

export interface GeoPoint {
  lat: number;
  lng: number;
}

export type AvailabilityStatus = "available" | "busy" | "offline";
export type ProviderTier = "standard" | "verified" | "premium";
export type PricingUnit = "hour" | "day" | "job" | "session" | "person" | "km";

export interface Pricing {
  from: number;
  to?: number;
  unit: PricingUnit;
  /** ISO 4217. Resolved from the viewer's locale for mock data. */
  currency: string;
  note?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number; // 1..5
  comment: string;
  createdAt: string; // ISO
}

export interface ReviewInput {
  author: string;
  rating: number; // 1..5
  comment: string;
}

export interface ProviderLocation {
  /** Human label, e.g. "Old Town · Accra". */
  label: string;
  area: string;
  city: string;
  country: string; // ISO 3166-1 alpha-2
  point: GeoPoint;
}

export interface Provider {
  id: string;
  name: string;
  business?: string;
  categories: CategoryId[];
  tagline?: string;
  bio?: string;
  phone?: string;
  whatsapp?: string;
  location: ProviderLocation;
  /** Deterministic gradient seeds (no external image assets required). */
  photos: string[];
  /** Optional uploaded flyer/banner image shown across the profile hero. */
  bannerUrl?: string;
  pricing?: Pricing;
  availability: AvailabilityStatus;
  rating: number; // 0..5 aggregate
  reviewsCount: number;
  reviews: Review[];

  // ── Marketplace / monetization hooks ──────────────────────────────
  // Present in the model so the architecture supports them, but gated by
  // feature flags (see lib/config.ts) until later phases.
  tier: ProviderTier;
  verified: boolean;
  featured: boolean; // premium placement
  sponsored: boolean; // sponsored result
  /** Pro subscription expiry (ISO). When in the future, the provider is "Pro". */
  proUntil?: string;

  createdAt: string;

  /**
   * Secret returned ONLY to the creator at registration (never on public
   * reads), saved on their device so they can edit their own listing.
   */
  editToken?: string;
}

/** The viewer's resolved locale/place — drives localization + ranking. */
export interface UserContext {
  point?: GeoPoint;
  city?: string;
  country?: string; // ISO2
  currency?: string; // ISO 4217
  locale?: string; // BCP-47
}

export interface SearchQuery {
  q?: string;
  categoryId?: CategoryId;
  limit?: number;
}

export interface SearchResult {
  provider: Provider;
  distanceKm: number;
  score: number;
}

/** Aggregated numbers for the private owner dashboard. */
export interface AdminStats {
  totalListings: number;
  availableNow: number;
  totalReviews: number;
  proSubscribers: number;
  categoriesUsed: number;
  recent: Array<{
    id: string;
    name: string;
    business?: string;
    categoryId: CategoryId;
    city: string;
    createdAt: string;
  }>;
  topCategories: Array<{ id: CategoryId; count: number }>;
  signupsByDay: Array<{ date: string; count: number }>; // last 14 days
}

export interface ProviderRegistration {
  name: string;
  business?: string;
  categories: CategoryId[];
  tagline?: string;
  bio?: string;
  phone?: string;
  area?: string;
  priceFrom?: number;
  priceUnit?: PricingUnit;
  /** Public URL of an uploaded flyer/banner (Supabase Storage). */
  bannerUrl?: string;
}
