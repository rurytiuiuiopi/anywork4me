-- Profile links: artists/musicians/producers (and anyone) can add links to
-- their work — Spotify, YouTube, Instagram, SoundCloud, a portfolio site, etc.
-- Stored as a text[] of validated http(s) URLs (sanitized in the API layer).
-- The app degrades gracefully until this runs (links simply aren't saved).

alter table public.providers
  add column if not exists links text[] not null default '{}';
