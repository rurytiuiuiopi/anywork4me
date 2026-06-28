-- Listing intent — what kind of listing this is (service / product / work /
-- hiring / need). Captured when posting so listings can show an intent badge.
-- Degrades gracefully until this runs (the value is simply not stored).

alter table public.providers
  add column if not exists intent text;
