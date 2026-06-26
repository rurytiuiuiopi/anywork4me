# anywork4me

**Find anyone, anything, nearby.** The simplest marketplace for discovering people,
services, businesses and opportunities around you. One search. One tap. One result.

Google × Uber × Airbnb × LinkedIn × Marketplace — but radically simpler, and built
to work in **every country on Earth** from a single global codebase.

---

## Phase 1 (this build)

The core 3-second experience plus the provider on-ramp:

- **Home** — headline, one big search bar, large category cards (`/`)
- **Search** — instant, location-aware results ranked by relevance, rating & distance (`/search`)
- **Provider profile** — photos, pricing, availability, reviews, and Call / Chat / Book / Save (`/provider/[id]`)
- **"I'm Available"** — provider registration that makes you searchable immediately (`/available`)
- **Saved** — favourites, no login required (`/saved`)

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build && npm run start   # production
```

## Architecture (built for global scale)

```
src/
  lib/
    types.ts            Domain model (country-agnostic — no nation hardcoded)
    config.ts           Feature flags. Monetization hooks exist but are OFF.
    categories.ts       Data-driven catalog (extensible per country later)
    geo.ts / format.ts  Distance + Intl currency/locale formatting
    location/           Country registry + offline locale detection (timezone + language)
    favorites/          localStorage-backed saved providers (no auth wall)
    data/               repository interface + in-memory mock impl + selector
    api.ts              Typed client for the JSON API
  app/
    api/                Scalable JSON endpoints the UI consumes
    page.tsx, search/, provider/[id]/, available/, saved/
  components/           SearchBar, CategoryGrid, ProviderCard, LocationControl, …
```

### One global platform, no country forks

Nothing is hardcoded to a single country. The viewer's **timezone + language** infer
their place fully offline (no API keys, no permission prompt), and they can switch
country from the location badge. Mock providers are positioned by an **offset relative
to the viewer**, so a user in Accra sees Accra, a user in Lagos sees Lagos, and a user
in New York sees New York — all from the same seed data, each with the right city label
and local currency.

Add a country: append one entry to `src/lib/location/countries.ts`.

### Swapping mock data for Supabase

Phase 1 ships an in-memory `MockProviderRepository`. Everything goes through the
`ProviderRepository` interface (`src/lib/data/repository.ts`). To go live on
Supabase/PostgreSQL:

1. Implement `SupabaseProviderRepository` against the same interface.
2. Return it from the selector in `src/lib/data/index.ts`.
3. Set `NEXT_PUBLIC_DATA_BACKEND=supabase`.

No UI, API-route, or component changes required.

### Monetization (architected, disabled)

Premium placement, sponsored results, featured providers, commission, ads,
subscriptions and analytics all exist in the data model and ranking logic but are
gated behind `features.monetization.*` in `src/lib/config.ts` — flip a flag to enable
in a later phase.

## Tech

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · App Router · (Supabase-ready)
