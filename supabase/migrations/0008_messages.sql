-- In-app messages + booking notifications.
-- Each message belongs to a listing. Anyone can send (clients need no account),
-- but only the listing's owner — who holds its edit_token on their device — can
-- read or mark its messages (same token pattern as listing edit/delete).

create extension if not exists pgcrypto;

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.providers(id) on delete cascade,
  sender_name text not null,
  sender_contact text,
  body text not null,
  kind text not null default 'message',
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists messages_listing_idx on public.messages (listing_id, created_at desc);

-- edit_token proves ownership (idempotent in case 0003 hasn't been applied).
alter table public.providers add column if not exists edit_token uuid;

alter table public.messages enable row level security;

drop policy if exists "messages public insert" on public.messages;
create policy "messages public insert" on public.messages for insert with check (true);

drop policy if exists "owner reads messages" on public.messages;
create policy "owner reads messages" on public.messages for select using (
  exists (
    select 1 from public.providers p
    where p.id = messages.listing_id
      and p.edit_token::text = (current_setting('request.headers', true)::json ->> 'x-edit-token')
  )
);

drop policy if exists "owner updates messages" on public.messages;
create policy "owner updates messages" on public.messages for update using (
  exists (
    select 1 from public.providers p
    where p.id = messages.listing_id
      and p.edit_token::text = (current_setting('request.headers', true)::json ->> 'x-edit-token')
  )
);
