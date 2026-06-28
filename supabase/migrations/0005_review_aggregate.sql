-- Keep providers.rating + reviews_count in sync as reviews change.
--
-- The profile page already computes a live average from the reviews table, but
-- search results and cards read the stored providers.rating / reviews_count
-- columns (and ranking uses rating to order results). Without this, a provider
-- can collect reviews yet still show "New" in search. This trigger recomputes
-- the stored aggregate on every review insert/update/delete.
--
-- SECURITY DEFINER so it can update providers despite the row-level "owner can
-- update" policy — the recompute is trusted and runs only from review writes.

create or replace function public.refresh_provider_rating()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target uuid := coalesce(new.provider_id, old.provider_id);
begin
  update public.providers p
  set reviews_count = sub.cnt,
      rating = sub.avg
  from (
    select count(*)::int as cnt,
           coalesce(round(avg(rating)::numeric, 1), 0) as avg
    from public.reviews
    where provider_id = target
  ) sub
  where p.id = target;
  return null;
end;
$$;

drop trigger if exists reviews_aggregate on public.reviews;
create trigger reviews_aggregate
after insert or update or delete on public.reviews
for each row execute function public.refresh_provider_rating();

-- One-time backfill for any reviews that already exist.
update public.providers p
set reviews_count = sub.cnt,
    rating = sub.avg
from (
  select provider_id,
         count(*)::int as cnt,
         coalesce(round(avg(rating)::numeric, 1), 0) as avg
  from public.reviews
  group by provider_id
) sub
where p.id = sub.provider_id;
