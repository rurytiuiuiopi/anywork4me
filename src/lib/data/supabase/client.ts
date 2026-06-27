import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-only Supabase client. All data access flows through the app's API
// routes, so the browser never talks to Supabase directly. Prefers the
// service-role key (bypasses RLS) when configured; otherwise uses the anon key,
// which works for reads and — with the public-insert RLS policy — registration.
// Uses `||` (not `??`) so an empty/blank service-role value falls back to anon.

let cached: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase env vars missing. Set NEXT_PUBLIC_SUPABASE_URL and " +
        "SUPABASE_SERVICE_ROLE_KEY (see .env.example).",
    );
  }

  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}

let serviceCached: SupabaseClient | null = null;

/**
 * Server-only client using the SERVICE-ROLE key (bypasses RLS). Used for
 * trusted, post-payment writes like granting Pro. Throws if no real service
 * key is configured — so monetization stays inert until you set it up.
 */
export function getServiceSupabase(): SupabaseClient {
  if (serviceCached) return serviceCached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Service-role key not configured — set SUPABASE_SERVICE_ROLE_KEY to enable Pro grants.",
    );
  }
  serviceCached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return serviceCached;
}
