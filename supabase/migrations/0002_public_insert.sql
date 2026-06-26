-- Allow public (anon) INSERTs so the no-login-wall "I'm Available" registration
-- works with the anon key. This mirrors the open registration of Phase 1.
-- (When a server-side service-role key is configured, it bypasses RLS and these
-- policies are simply unused. Add moderation/validation before scaling.)

drop policy if exists "providers public insert" on public.providers;
drop policy if exists "reviews public insert"   on public.reviews;

create policy "providers public insert" on public.providers for insert with check (true);
create policy "reviews public insert"   on public.reviews   for insert with check (true);
