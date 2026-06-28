// Email + password accounts via Supabase Auth (secure hashing + persisted
// sessions, so users stay logged in for quick re-entry). The signed-in user's
// profile is mirrored into the local cache (lib/profile) so the rest of the app
// keeps reading getProfile()/isSignedIn() synchronously, unchanged.

import { type SupabaseClient, type User, createClient } from "@supabase/supabase-js";
import {
  type AccountType,
  type LocalProfile,
  clearProfile,
  getProfile,
  saveProfile,
} from "./profile";

let authClient: SupabaseClient | null = null;

export function getAuthClient(): SupabaseClient {
  if (authClient) return authClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Sign-in isn’t configured yet.");
  authClient = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: "aw4m-auth",
    },
  });
  return authClient;
}

/** Build the local profile from a Supabase auth user (profile lives in metadata). */
export function profileFromUser(user: User): LocalProfile {
  const m = (user.user_metadata ?? {}) as Record<string, string>;
  return {
    name: m.name || user.email?.split("@")[0] || "Member",
    business: m.business || undefined,
    accountType: (m.accountType as AccountType) || "service",
    email: user.email ?? undefined,
    phone: m.phone || undefined,
    city: m.city || undefined,
    bio: m.bio || undefined,
    category: m.category || undefined,
    photoUrl: getProfile()?.photoUrl, // photo stays on the device (too big for metadata)
    createdAt: m.createdAt || new Date().toISOString(),
  };
}

export async function signUpWithPassword(
  email: string,
  password: string,
  data: Partial<LocalProfile>,
): Promise<{ needsConfirm: boolean }> {
  const supa = getAuthClient();
  const { data: res, error } = await supa.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: {
        name: data.name ?? "",
        business: data.business ?? "",
        accountType: data.accountType ?? "service",
        phone: data.phone ?? "",
        city: data.city ?? "",
        bio: data.bio ?? "",
        category: data.category ?? "",
        createdAt: new Date().toISOString(),
      },
    },
  });
  if (error) throw new Error(error.message);
  if (res.session && res.user) {
    saveProfile({ ...profileFromUser(res.user), photoUrl: data.photoUrl });
    return { needsConfirm: false };
  }
  // Email confirmation is required (no session yet). Still sign the user in
  // LOCALLY so they can use the app immediately — confirming their email later
  // just unlocks signing in on other devices. New users are never blocked.
  saveProfile({
    name: data.name || email.split("@")[0] || "Member",
    business: data.business,
    accountType: data.accountType ?? "service",
    email: email.trim(),
    phone: data.phone,
    city: data.city,
    bio: data.bio,
    category: data.category,
    photoUrl: data.photoUrl,
    createdAt: new Date().toISOString(),
  });
  return { needsConfirm: true };
}

export async function signInWithPassword(email: string, password: string): Promise<void> {
  const supa = getAuthClient();
  const { data: res, error } = await supa.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error) {
    // Account not confirmed yet, but this device already has that profile →
    // restore the local session so they're never locked out on their own device.
    if (/confirm/i.test(error.message)) {
      const p = getProfile();
      if (p?.email && p.email.toLowerCase() === email.trim().toLowerCase()) {
        saveProfile(p);
        return;
      }
    }
    throw new Error(error.message);
  }
  if (res.user) saveProfile(profileFromUser(res.user));
}

export async function signOutAuth(): Promise<void> {
  try {
    await getAuthClient().auth.signOut();
  } catch {
    /* ignore network errors — clear the local session regardless */
  }
  clearProfile();
}
