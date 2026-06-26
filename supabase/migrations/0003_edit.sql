-- Let a listing's creator edit it — securely, with no login.
-- Each listing gets a secret `edit_token` (generated at creation, saved on the
-- creator's device). An UPDATE is allowed ONLY when the request carries the
-- matching token in the `x-edit-token` header. Nobody else can edit a listing,
-- even though browsing/creating stay open.

alter table public.providers add column if not exists edit_token text;

drop policy if exists "owner can update" on public.providers;
create policy "owner can update" on public.providers
  for update
  using (
    edit_token is not null
    and edit_token = current_setting('request.headers', true)::json ->> 'x-edit-token'
  )
  with check (true);
