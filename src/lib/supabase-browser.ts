import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Browser-side Supabase client — used ONLY for direct Storage uploads
// (provider flyers) with the publishable key. All other data access still
// flows through the server API routes.

let cached: SupabaseClient | null = null;

export function getBrowserSupabase(): SupabaseClient | null {
  if (cached) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null; // e.g. local mock mode
  cached = createClient(url, key, { auth: { persistSession: false } });
  return cached;
}

/** Upload a flyer image to the public `flyers` bucket; returns its public URL. */
export async function uploadFlyer(file: File): Promise<string> {
  const sb = getBrowserSupabase();
  if (!sb) throw new Error("Image upload isn't available right now.");
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const rand = Math.random().toString(36).slice(2, 10);
  const path = `${Date.now()}-${rand}.${ext}`;
  const { error } = await sb.storage
    .from("flyers")
    .upload(path, file, { cacheControl: "31536000", contentType: file.type });
  if (error) throw new Error(error.message);
  return sb.storage.from("flyers").getPublicUrl(path).data.publicUrl;
}
