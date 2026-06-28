-- Two-way in-app messaging for listings. Each conversation gets a thread_token
-- (the sender/client's device key) + a sender role ('client' | 'owner'), so the
-- provider can reply in-app and the client reads the reply in their own inbox —
-- no email needed. The listing owner reads via the listing edit-token; the
-- client reads via their thread token (x-message-token).

alter table public.messages add column if not exists thread_token uuid;
alter table public.messages add column if not exists sender text not null default 'client';

drop policy if exists "owner reads messages" on public.messages;
create policy "owner reads messages" on public.messages for select using (
  exists (
    select 1 from public.providers p
    where p.id = messages.listing_id
      and p.edit_token::text = (current_setting('request.headers', true)::json ->> 'x-edit-token')
  )
  or (current_setting('request.headers', true)::json ->> 'x-message-token') = thread_token::text
);

drop policy if exists "owner updates messages" on public.messages;
create policy "owner updates messages" on public.messages for update using (
  exists (
    select 1 from public.providers p
    where p.id = messages.listing_id
      and p.edit_token::text = (current_setting('request.headers', true)::json ->> 'x-edit-token')
  )
  or (current_setting('request.headers', true)::json ->> 'x-message-token') = thread_token::text
);
