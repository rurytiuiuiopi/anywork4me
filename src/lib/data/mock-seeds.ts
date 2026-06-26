import type { AvailabilityStatus, PricingUnit, ProviderTier } from "../types";

// Location-relative seeds. Each provider is positioned by an [east, north] km
// offset from the *viewer*, and its city/currency/dial-code are resolved at
// request time. Result: every user — Accra, Lagos, New York — sees a believable
// local marketplace from the same seed data. No country is hardcoded.

export interface SeedReview {
  author: string;
  rating: number;
  comment: string;
  daysAgo: number;
}

export interface Seed {
  id: string;
  name: string;
  business?: string;
  categories: string[];
  tagline: string;
  bio: string;
  area: string; // neutral neighbourhood label, works in any city
  offset: [eastKm: number, northKm: number];
  priceFrom: number;
  priceTo?: number;
  priceUnit: PricingUnit;
  availability: AvailabilityStatus;
  rating: number;
  reviewsCount: number;
  phoneLocal: string; // local subscriber number; dial code added per country
  tier: ProviderTier;
  verified: boolean;
  featured: boolean;
  sponsored: boolean;
  reviews: SeedReview[];
}

const r = (author: string, rating: number, comment: string, daysAgo: number): SeedReview => ({
  author,
  rating,
  comment,
  daysAgo,
});

export const SEEDS: Seed[] = [
  // ── DJs ──
  {
    id: "dj-kojo", name: "Kojo Mensah", business: "Pulse Sound", categories: ["dj"],
    tagline: "Weddings, clubs & private parties", bio: "10+ years on the decks. Open-format DJ with pro sound and lighting for any crowd.",
    area: "Old Town", offset: [1.2, 0.8], priceFrom: 150, priceUnit: "hour", availability: "available",
    rating: 4.9, reviewsCount: 214, phoneLocal: "24 555 0148", tier: "premium", verified: true, featured: true, sponsored: false,
    reviews: [r("Ama", 5, "Kept the dance floor full all night. Booking again!", 6), r("Daniel", 5, "Read the room perfectly. Pro setup.", 21)],
  },
  {
    id: "dj-lena", name: "Lena Cruz", business: "Nightshift DJs", categories: ["dj", "mc"],
    tagline: "Afrobeats • Amapiano • House", bio: "Versatile DJ + hype MC. I bring the energy and handle the announcements so you can enjoy your event.",
    area: "Riverside", offset: [-2.1, 1.4], priceFrom: 120, priceUnit: "hour", availability: "busy",
    rating: 4.7, reviewsCount: 88, phoneLocal: "24 555 0192", tier: "verified", verified: true, featured: false, sponsored: false,
    reviews: [r("Priya", 5, "So much energy, everyone was dancing.", 11)],
  },

  // ── Plumbers ──
  {
    id: "plm-sam", name: "Samuel Owusu", business: "FlowFix Plumbing", categories: ["plumber"],
    tagline: "Emergency repairs, 24/7", bio: "Licensed plumber. Leaks, blockages, installations — fast, clean, and guaranteed.",
    area: "Harbour", offset: [0.6, -1.1], priceFrom: 60, priceUnit: "job", availability: "available",
    rating: 4.8, reviewsCount: 156, phoneLocal: "20 555 0173", tier: "verified", verified: true, featured: false, sponsored: false,
    reviews: [r("Grace", 5, "Came within the hour and fixed a burst pipe. Lifesaver.", 3), r("Tom", 4, "Solid work, fair price.", 30)],
  },
  {
    id: "plm-ravi", name: "Ravi Patel", categories: ["plumber"],
    tagline: "Bathrooms & kitchens", bio: "Renovations and fittings specialist. Tidy, reliable, on time.",
    area: "Garden District", offset: [3.0, 2.2], priceFrom: 45, priceUnit: "hour", availability: "available",
    rating: 4.6, reviewsCount: 73, phoneLocal: "20 555 0145", tier: "standard", verified: false, featured: false, sponsored: false,
    reviews: [r("Bisi", 5, "Re-did our whole bathroom, looks great.", 14)],
  },

  // ── Drivers ──
  {
    id: "drv-fatima", name: "Fatima Bello", business: "City Rides", categories: ["driver"],
    tagline: "Airport runs & all-day hire", bio: "Safe, punctual driver with a clean sedan. Airport transfers and full-day bookings welcome.",
    area: "Downtown", offset: [-0.9, 0.5], priceFrom: 25, priceUnit: "hour", availability: "available",
    rating: 4.9, reviewsCount: 301, phoneLocal: "26 555 0110", tier: "verified", verified: true, featured: false, sponsored: false,
    reviews: [r("Kwame", 5, "Always on time, very professional.", 2), r("Sara", 5, "Felt safe the whole trip.", 9)],
  },
  {
    id: "drv-mike", name: "Mike Adeyemi", categories: ["driver", "delivery"],
    tagline: "Van available for moves", bio: "Driver with a spacious van. Moving, deliveries, and group transport.",
    area: "Eastside", offset: [4.1, -0.7], priceFrom: 30, priceUnit: "hour", availability: "offline",
    rating: 4.5, reviewsCount: 47, phoneLocal: "26 555 0188", tier: "standard", verified: false, featured: false, sponsored: false,
    reviews: [r("Lara", 4, "Helped me move flats, careful with everything.", 18)],
  },

  // ── Food / Catering ──
  {
    id: "food-zara", name: "Zara's Kitchen", business: "Zara's Kitchen", categories: ["food", "catering"],
    tagline: "Home-style meals, made fresh", bio: "Daily home-cooked plates and event catering. Local favourites and continental dishes.",
    area: "Market Square", offset: [0.4, 0.9], priceFrom: 8, priceUnit: "person", availability: "available",
    rating: 4.8, reviewsCount: 420, phoneLocal: "27 555 0131", tier: "premium", verified: true, featured: true, sponsored: false,
    reviews: [r("Femi", 5, "Best jollof in the area, no debate.", 1), r("Nadia", 5, "Catered our office lunch, everyone loved it.", 7)],
  },
  {
    id: "cat-grand", name: "Grand Feast Catering", business: "Grand Feast", categories: ["catering", "food"],
    tagline: "Weddings & corporate events", bio: "Full-service catering for 20–500 guests. Menus, staff, and setup included.",
    area: "Uptown", offset: [-3.3, 2.0], priceFrom: 15, priceUnit: "person", availability: "available",
    rating: 4.7, reviewsCount: 129, phoneLocal: "27 555 0166", tier: "verified", verified: true, featured: false, sponsored: false,
    reviews: [r("Ben", 5, "Handled 200 guests flawlessly.", 25)],
  },

  // ── Houses / Property ──
  {
    id: "house-aria", name: "Aria Realty", business: "Aria Realty", categories: ["house"],
    tagline: "Verified rentals & rooms", bio: "Apartments, single rooms, and short stays. All listings inspected and verified.",
    area: "Hillview", offset: [2.6, 1.1], priceFrom: 400, priceUnit: "job", priceTo: 1200, availability: "available",
    rating: 4.6, reviewsCount: 64, phoneLocal: "23 555 0154", tier: "verified", verified: true, featured: false, sponsored: false,
    reviews: [r("Joy", 5, "Found me a great flat in two days.", 12)],
  },

  // ── Photographers / Video ──
  {
    id: "pho-noah", name: "Noah Kim", business: "Noah Kim Studio", categories: ["photographer", "videographer"],
    tagline: "Weddings, portraits, events", bio: "Editorial-quality photography and cinematic video. Same-week previews.",
    area: "Arts Quarter", offset: [-1.0, -0.6], priceFrom: 200, priceUnit: "session", availability: "available",
    rating: 5.0, reviewsCount: 98, phoneLocal: "55 555 0107", tier: "premium", verified: true, featured: true, sponsored: false,
    reviews: [r("Ife", 5, "The photos are stunning, beyond expectations.", 4), r("Mark", 5, "Captured our day perfectly.", 16)],
  },
  {
    id: "pho-tina", name: "Tina Acheampong", categories: ["photographer"],
    tagline: "Affordable shoots", bio: "Friendly photographer for portraits, products, and small events.",
    area: "Riverside", offset: [1.8, 1.9], priceFrom: 90, priceUnit: "session", availability: "busy",
    rating: 4.5, reviewsCount: 52, phoneLocal: "55 555 0143", tier: "standard", verified: false, featured: false, sponsored: false,
    reviews: [r("Kofi", 4, "Great value, nice photos.", 22)],
  },

  // ── Electricians ──
  {
    id: "ele-james", name: "James Okoro", business: "BrightWire", categories: ["electrician"],
    tagline: "Wiring, repairs & solar", bio: "Certified electrician. Faults, rewiring, and solar installations done safely.",
    area: "Harbour", offset: [0.7, 1.6], priceFrom: 50, priceUnit: "job", availability: "available",
    rating: 4.8, reviewsCount: 187, phoneLocal: "24 555 0119", tier: "verified", verified: true, featured: false, sponsored: false,
    reviews: [r("Adaeze", 5, "Sorted our power issues quickly.", 5), r("Yaw", 5, "Knowledgeable and neat.", 20)],
  },

  // ── Makeup / Beauty ──
  {
    id: "mua-bella", name: "Bella Mensima", business: "Glam by Bella", categories: ["makeup"],
    tagline: "Bridal & editorial makeup", bio: "Long-lasting, photo-ready looks for brides and events. I come to you.",
    area: "Garden District", offset: [-1.6, 0.4], priceFrom: 70, priceUnit: "session", availability: "available",
    rating: 4.9, reviewsCount: 176, phoneLocal: "54 555 0162", tier: "premium", verified: true, featured: false, sponsored: false,
    reviews: [r("Esi", 5, "My bridal look was flawless and lasted all day.", 8)],
  },
  {
    id: "bar-tony", name: "Tony's Cuts", business: "Tony's Cuts", categories: ["barber"],
    tagline: "Fresh fades, walk-ins welcome", bio: "Precision cuts, beard trims, and styling. Home visits available.",
    area: "Market Square", offset: [0.9, -0.4], priceFrom: 12, priceUnit: "job", availability: "available",
    rating: 4.7, reviewsCount: 240, phoneLocal: "20 555 0177", tier: "verified", verified: true, featured: false, sponsored: false,
    reviews: [r("Sean", 5, "Best fade in town.", 3)],
  },

  // ── Music ──
  {
    id: "prod-neo", name: "Neo Beats", business: "Neo Sound Lab", categories: ["producer"],
    tagline: "Afrobeats & hip-hop production", bio: "Producer and mixing engineer. Studio sessions, beats, and full song production.",
    area: "Arts Quarter", offset: [-2.4, -1.2], priceFrom: 80, priceUnit: "session", availability: "available",
    rating: 4.8, reviewsCount: 61, phoneLocal: "55 555 0128", tier: "verified", verified: true, featured: false, sponsored: false,
    reviews: [r("Drey", 5, "My track sounds radio-ready now.", 13)],
  },
  {
    id: "mc-grace", name: "Grace Annan", business: "Grace on the Mic", categories: ["mc"],
    tagline: "Weddings, corporate & launches", bio: "Polished, bilingual event host. I keep your programme flowing and your guests engaged.",
    area: "Downtown", offset: [1.1, 0.2], priceFrom: 180, priceUnit: "job", availability: "available",
    rating: 4.9, reviewsCount: 94, phoneLocal: "24 555 0136", tier: "premium", verified: true, featured: false, sponsored: false,
    reviews: [r("Kojo", 5, "Hosted our wedding beautifully.", 9)],
  },

  // ── Health / Professional ──
  {
    id: "doc-amelia", name: "Dr. Amelia Sarpong", business: "CarePoint Clinic", categories: ["doctor"],
    tagline: "General practice • home visits", bio: "GP offering consultations, home visits, and telehealth. Same-day appointments.",
    area: "Hillview", offset: [-0.5, 2.3], priceFrom: 40, priceUnit: "session", availability: "available",
    rating: 4.9, reviewsCount: 142, phoneLocal: "30 555 0101", tier: "verified", verified: true, featured: false, sponsored: false,
    reviews: [r("Mary", 5, "Caring and thorough. Highly recommend.", 6)],
  },
  {
    id: "law-david", name: "David Mensah", business: "Mensah & Co.", categories: ["lawyer"],
    tagline: "Contracts, property & business", bio: "Practising lawyer for individuals and SMEs. Clear advice, fixed-fee options.",
    area: "Financial District", offset: [2.0, -1.5], priceFrom: 120, priceUnit: "hour", availability: "busy",
    rating: 4.7, reviewsCount: 58, phoneLocal: "30 555 0184", tier: "verified", verified: true, featured: false, sponsored: false,
    reviews: [r("Linda", 5, "Sorted my tenancy dispute fast.", 28)],
  },

  // ── Delivery ──
  {
    id: "del-swift", name: "Swift Dispatch", business: "Swift Dispatch", categories: ["delivery"],
    tagline: "Same-day courier", bio: "Motorbike couriers for documents, food, and parcels. Live tracking.",
    area: "Eastside", offset: [3.4, 0.9], priceFrom: 5, priceUnit: "km", availability: "available",
    rating: 4.6, reviewsCount: 203, phoneLocal: "26 555 0155", tier: "standard", verified: false, featured: false, sponsored: false,
    reviews: [r("Ola", 4, "Quick and reliable.", 4)],
  },

  // ── Extras (View More categories) ──
  {
    id: "cln-pure", name: "PureHome Cleaning", business: "PureHome", categories: ["cleaner"],
    tagline: "Homes & offices", bio: "Trusted cleaners for deep cleans, regular service, and move-outs.",
    area: "Garden District", offset: [-1.2, 1.0], priceFrom: 20, priceUnit: "hour", availability: "available",
    rating: 4.7, reviewsCount: 110, phoneLocal: "24 555 0199", tier: "standard", verified: false, featured: false, sponsored: false,
    reviews: [r("Hana", 5, "Spotless every time.", 7)],
  },
  {
    id: "tut-clara", name: "Clara Boateng", categories: ["tutor"],
    tagline: "Maths & science, all levels", bio: "Experienced tutor. In-person and online lessons for school and exams.",
    area: "Hillview", offset: [1.5, 1.7], priceFrom: 18, priceUnit: "hour", availability: "available",
    rating: 4.9, reviewsCount: 77, phoneLocal: "55 555 0122", tier: "verified", verified: true, featured: false, sponsored: false,
    reviews: [r("Papa", 5, "My son's grades jumped a whole level.", 15)],
  },
  {
    id: "mec-auto", name: "AutoCare Garage", business: "AutoCare", categories: ["mechanic", "driver"],
    tagline: "Diagnostics & repairs", bio: "Full-service garage. Diagnostics, servicing, and roadside help.",
    area: "Industrial Park", offset: [4.6, -1.8], priceFrom: 35, priceUnit: "job", availability: "available",
    rating: 4.5, reviewsCount: 89, phoneLocal: "20 555 0111", tier: "standard", verified: false, featured: false, sponsored: false,
    reviews: [r("Yusuf", 4, "Honest pricing, good work.", 19)],
  },
  {
    id: "fit-leo", name: "Leo Strong", business: "Strong Fitness", categories: ["fitness"],
    tagline: "Personal training & home sessions", bio: "Certified trainer. Weight loss, strength, and mobility programmes.",
    area: "Riverside", offset: [-0.8, -1.3], priceFrom: 25, priceUnit: "session", availability: "available",
    rating: 4.8, reviewsCount: 66, phoneLocal: "54 555 0133", tier: "standard", verified: false, featured: false, sponsored: false,
    reviews: [r("Mia", 5, "Lost 6kg in two months, great motivator.", 10)],
  },
];
