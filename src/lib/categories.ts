import type { Category } from "./types";

// Data-driven category catalog. This is intentionally NOT hardcoded per country —
// a country-aware backend can extend, reorder, or localize this list later
// without touching the UI. `primary` marks the home-screen cards.

export const CATEGORIES: Category[] = [
  { id: "dj", name: "DJ", emoji: "🎧", group: "Events", primary: true, keywords: ["dj", "disc jockey", "music", "party"] },
  { id: "plumber", name: "Plumber", emoji: "🔧", group: "Home", primary: true, keywords: ["plumber", "plumbing", "pipes", "leak", "drain"] },
  { id: "driver", name: "Driver", emoji: "🚗", group: "Transport", primary: true, keywords: ["driver", "ride", "chauffeur", "taxi"] },
  { id: "food", name: "Food", emoji: "🍛", group: "Food", primary: true, keywords: ["food", "meal", "takeout", "restaurant", "chef"] },
  { id: "house", name: "House", emoji: "🏠", group: "Property", primary: true, keywords: ["house", "rent", "apartment", "room", "property", "rental"] },
  { id: "photographer", name: "Photographer", emoji: "📸", group: "Events", primary: true, keywords: ["photographer", "photography", "photo", "shoot"] },
  { id: "electrician", name: "Electrician", emoji: "⚡", group: "Home", primary: true, keywords: ["electrician", "electric", "wiring", "power"] },
  { id: "makeup", name: "Makeup Artist", emoji: "💄", group: "Beauty", primary: true, keywords: ["makeup", "mua", "beauty", "glam"] },
  { id: "producer", name: "Music Producer", emoji: "🎵", group: "Events", primary: true, keywords: ["producer", "beats", "studio", "mixing"] },
  { id: "mc", name: "MC", emoji: "🎤", group: "Events", primary: true, keywords: ["mc", "host", "compere", "anchor"] },
  { id: "doctor", name: "Doctor", emoji: "🏥", group: "Health", primary: true, keywords: ["doctor", "clinic", "gp", "physician", "health"] },
  { id: "lawyer", name: "Lawyer", emoji: "⚖️", group: "Professional", primary: true, keywords: ["lawyer", "attorney", "legal", "solicitor"] },
  { id: "barber", name: "Barber", emoji: "💇", group: "Beauty", primary: true, keywords: ["barber", "haircut", "fade", "grooming"] },
  { id: "delivery", name: "Delivery", emoji: "🚚", group: "Transport", primary: true, keywords: ["delivery", "courier", "dispatch", "package"] },
  { id: "catering", name: "Catering", emoji: "🍽️", group: "Food", primary: true, keywords: ["catering", "caterer", "event food", "buffet"] },

  // ── "View More" ────────────────────────────────────────────────────
  { id: "cleaner", name: "Cleaner", emoji: "🧹", group: "Home", keywords: ["cleaner", "cleaning", "maid", "housekeeping"] },
  { id: "tutor", name: "Tutor", emoji: "📚", group: "Professional", keywords: ["tutor", "teacher", "lessons", "tuition"] },
  { id: "mechanic", name: "Mechanic", emoji: "🔩", group: "Transport", keywords: ["mechanic", "auto", "car repair", "garage"] },
  { id: "tailor", name: "Tailor", emoji: "🧵", group: "Beauty", keywords: ["tailor", "seamstress", "fashion", "sewing"] },
  { id: "carpenter", name: "Carpenter", emoji: "🪚", group: "Home", keywords: ["carpenter", "woodwork", "furniture", "joinery"] },
  { id: "painter", name: "Painter", emoji: "🎨", group: "Home", keywords: ["painter", "painting", "decorator"] },
  { id: "nanny", name: "Nanny", emoji: "🍼", group: "Care", keywords: ["nanny", "babysitter", "childcare"] },
  { id: "fitness", name: "Fitness Trainer", emoji: "🏋️", group: "Health", keywords: ["fitness", "trainer", "gym", "personal trainer"] },
  { id: "videographer", name: "Videographer", emoji: "🎥", group: "Events", keywords: ["videographer", "video", "filming"] },
  { id: "decorator", name: "Event Decorator", emoji: "🎈", group: "Events", keywords: ["decorator", "decor", "events", "balloons"] },
  { id: "accountant", name: "Accountant", emoji: "📊", group: "Professional", keywords: ["accountant", "bookkeeping", "tax", "finance"] },
  { id: "welder", name: "Welder", emoji: "🔥", group: "Home", keywords: ["welder", "welding", "metal", "fabrication"] },
];

export const PRIMARY_CATEGORIES = CATEGORIES.filter((c) => c.primary);

const BY_ID = new Map(CATEGORIES.map((c) => [c.id, c]));
export const getCategory = (id: string): Category | undefined => BY_ID.get(id);

/** Find the category whose name/keywords best match a free-text query. */
export function matchCategory(q: string): Category | undefined {
  const needle = q.trim().toLowerCase();
  if (!needle) return undefined;
  return (
    CATEGORIES.find((c) => c.name.toLowerCase() === needle) ??
    CATEGORIES.find((c) => c.keywords.some((k) => k === needle)) ??
    CATEGORIES.find(
      (c) =>
        c.name.toLowerCase().includes(needle) ||
        c.keywords.some((k) => k.includes(needle) || needle.includes(k)),
    )
  );
}
