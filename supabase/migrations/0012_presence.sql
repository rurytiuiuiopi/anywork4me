-- Presence + location precision.
-- Powers a truthful availability badge (online / active recently / offline) and
-- honest distances (real km only when the provider shared precise GPS).

alter table public.providers add column if not exists last_active_at timestamptz default now();
update public.providers set last_active_at = coalesce(last_active_at, created_at, now());

alter table public.providers add column if not exists precise_location boolean default false;
