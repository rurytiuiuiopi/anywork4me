-- Provider flyer/banner support.
-- A `banner_url` column + a public Storage bucket providers upload their flyer to.

alter table public.providers add column if not exists banner_url text;

-- Public bucket: object URLs are readable by anyone (for display on profiles).
insert into storage.buckets (id, name, public)
values ('flyers', 'flyers', true)
on conflict (id) do nothing;

-- Allow public (anon, via the publishable key) uploads — open registration,
-- same posture as the providers/reviews insert policies. Add moderation later.
drop policy if exists "flyers public upload" on storage.objects;
create policy "flyers public upload"
  on storage.objects for insert
  with check (bucket_id = 'flyers');
