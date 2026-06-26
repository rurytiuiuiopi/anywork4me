-- anywork4me — initial schema
-- Run this in your Supabase project: SQL Editor → paste → Run.
-- (Categories stay code-driven in src/lib/categories.ts; only dynamic data lives here.)

create extension if not exists "pgcrypto";

-- ── Providers ────────────────────────────────────────────────────────────
create table if not exists public.providers (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  business      text,
  categories    text[] not null default '{}',
  tagline       text,
  bio           text,
  phone         text,
  whatsapp      text,
  area          text,
  city          text,
  country       text not null,                 -- ISO 3166-1 alpha-2
  lat           double precision not null,      -- real provider location
  lng           double precision not null,
  photos        text[] not null default '{}',
  price_from    numeric,
  price_to      numeric,
  price_unit    text,
  currency      text,                           -- provider's own currency (ISO 4217)
  availability  text not null default 'available',
  rating        numeric not null default 0,
  reviews_count integer not null default 0,
  -- marketplace / monetization hooks (gated by feature flags in the app)
  tier          text not null default 'standard',
  verified      boolean not null default false,
  featured      boolean not null default false,
  sponsored     boolean not null default false,
  created_at    timestamptz not null default now()
);

-- ── Reviews ──────────────────────────────────────────────────────────────
create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.providers(id) on delete cascade,
  author      text not null,
  rating      int not null check (rating between 1 and 5),
  comment     text,
  created_at  timestamptz not null default now()
);

-- ── Indexes ──────────────────────────────────────────────────────────────
create index if not exists providers_country_idx    on public.providers (country);
create index if not exists providers_categories_idx  on public.providers using gin (categories);
create index if not exists reviews_provider_idx       on public.reviews (provider_id);

-- ── Row Level Security ───────────────────────────────────────────────────
-- Public can READ everything (browsing has no login wall).
-- WRITES happen only via the app's server using the service-role key, which
-- bypasses RLS — so we never expose write access to the browser.
alter table public.providers enable row level security;
alter table public.reviews   enable row level security;

drop policy if exists "providers public read" on public.providers;
drop policy if exists "reviews public read"   on public.reviews;

create policy "providers public read" on public.providers for select using (true);
create policy "reviews public read"   on public.reviews   for select using (true);
