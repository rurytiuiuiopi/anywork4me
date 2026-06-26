// FINDME — global feature configuration.
//
// Monetization and advanced features live in the architecture but stay OFF
// until later phases. Flip a flag here (or via env) to enable — no code changes
// elsewhere required.

export const features = {
  /** Revenue features — disabled in Phase 1. */
  monetization: {
    premiumPlacement: false, // boost `featured` providers in ranking
    sponsoredResults: false, // surface `sponsored` providers
    featuredProviders: false, // "Featured" badges/shelves
    commission: false,
    advertising: false,
    subscriptions: false,
    businessAnalytics: false,
  },
  /** Phase 1 trust + transaction features. */
  trust: {
    verifiedBadges: true,
    reviews: true,
    ratings: true,
  },
  actions: {
    call: true,
    chat: true,
    book: true,
    favorites: true,
  },
  auth: {
    // No login wall. Providers register; browsing is always open.
    required: false,
  },
} as const;

/** Which data backend the repository layer uses. Swap mock → supabase later. */
export const dataBackend = (process.env.NEXT_PUBLIC_DATA_BACKEND ?? "mock") as
  | "mock"
  | "supabase";

export const app = {
  name: "anywork4me",
  tagline: "Find anyone, anything, nearby.",
} as const;
