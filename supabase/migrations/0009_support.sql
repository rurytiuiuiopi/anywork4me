-- Support conversations between each user and "Sarah from AnyWork4Me" (Admin).
-- One thread per user, keyed by a secret thread_token stored on the user's
-- device. The user reads/writes their own thread via that token; the admin
-- dashboard reads/writes ALL threads via a server-only admin key. Same proven
-- request-header pattern as the listing inbox — no service key required.

create extension if not exists pgcrypto;

create table if not exists public.support_messages (
  id uuid primary key default gen_random_uuid(),
  thread_token uuid not null,
  sender text not null default 'user',          -- 'system' | 'user' | 'admin'
  user_name text,
  user_email text,
  body text not null,
  read boolean not null default false,          -- read by the recipient
  created_at timestamptz not null default now()
);

create index if not exists support_thread_idx on public.support_messages (thread_token, created_at);
create index if not exists support_unread_idx on public.support_messages (read, sender);

alter table public.support_messages enable row level security;

drop policy if exists "support insert" on public.support_messages;
create policy "support insert" on public.support_messages for insert with check (true);

drop policy if exists "support read" on public.support_messages;
create policy "support read" on public.support_messages for select using (
  (current_setting('request.headers', true)::json ->> 'x-support-token') = thread_token::text
  or (current_setting('request.headers', true)::json ->> 'x-support-admin')
       = 'aw4m_support_2f9a4c7e8b1d3f60a5e9c2b4d7f1a8e3'
);

drop policy if exists "support update" on public.support_messages;
create policy "support update" on public.support_messages for update using (
  (current_setting('request.headers', true)::json ->> 'x-support-token') = thread_token::text
  or (current_setting('request.headers', true)::json ->> 'x-support-admin')
       = 'aw4m_support_2f9a4c7e8b1d3f60a5e9c2b4d7f1a8e3'
);
