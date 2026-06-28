// Curated cities for programmatic "city × category" SEO landing pages.
// Africa-first (the core market), plus key global hubs. Add a row to scale.

export interface SeoCity {
  slug: string;
  name: string;
  country: string;
}

export const SEO_CITIES: SeoCity[] = [
  // Ghana (primary market)
  { slug: "accra", name: "Accra", country: "Ghana" },
  { slug: "kumasi", name: "Kumasi", country: "Ghana" },
  { slug: "tamale", name: "Tamale", country: "Ghana" },
  { slug: "takoradi", name: "Takoradi", country: "Ghana" },
  { slug: "cape-coast", name: "Cape Coast", country: "Ghana" },
  // Nigeria
  { slug: "lagos", name: "Lagos", country: "Nigeria" },
  { slug: "abuja", name: "Abuja", country: "Nigeria" },
  { slug: "port-harcourt", name: "Port Harcourt", country: "Nigeria" },
  { slug: "ibadan", name: "Ibadan", country: "Nigeria" },
  { slug: "kano", name: "Kano", country: "Nigeria" },
  // Kenya
  { slug: "nairobi", name: "Nairobi", country: "Kenya" },
  { slug: "mombasa", name: "Mombasa", country: "Kenya" },
  // South Africa
  { slug: "johannesburg", name: "Johannesburg", country: "South Africa" },
  { slug: "cape-town", name: "Cape Town", country: "South Africa" },
  { slug: "durban", name: "Durban", country: "South Africa" },
  { slug: "pretoria", name: "Pretoria", country: "South Africa" },
  // Global hubs
  { slug: "london", name: "London", country: "United Kingdom" },
  { slug: "new-york", name: "New York", country: "United States" },
  { slug: "toronto", name: "Toronto", country: "Canada" },
  { slug: "dubai", name: "Dubai", country: "United Arab Emirates" },
];

const BY_SLUG = new Map(SEO_CITIES.map((c) => [c.slug, c]));
export const getCity = (slug?: string): SeoCity | undefined =>
  slug ? BY_SLUG.get(slug.toLowerCase()) : undefined;
