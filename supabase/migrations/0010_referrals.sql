-- Referral / invite engine. Records a row each time a new user signs up via
-- someone's invite link. No personal data — just the referrer's code + time —
-- so we can count invites per referrer. Public insert + read of counts only.

create extension if not exists pgcrypto;

create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_code text not null,
  created_at timestamptz not null default now()
);

create index if not exists referrals_code_idx on public.referrals (referrer_code);

alter table public.referrals enable row level security;

drop policy if exists "referrals insert" on public.referrals;
create policy "referrals insert" on public.referrals for insert with check (true);

drop policy if exists "referrals read" on public.referrals;
create policy "referrals read" on public.referrals for select using (true);
