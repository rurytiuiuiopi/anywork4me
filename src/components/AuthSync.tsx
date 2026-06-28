"use client";

import { useEffect } from "react";
import { getAuthClient, profileFromUser } from "@/lib/auth";
import { clearProfile, saveProfile } from "@/lib/profile";

// Keeps the local profile cache in step with the Supabase auth session:
// refreshes it when signed in, clears it on sign-out (incl. from another tab).
export function AuthSync() {
  useEffect(() => {
    let client;
    try {
      client = getAuthClient();
    } catch {
      return; // auth not configured — nothing to sync
    }
    client.auth.getSession().then(({ data }) => {
      if (data.session?.user) saveProfile(profileFromUser(data.session.user));
    });
    const { data: sub } = client.auth.onAuthStateChange((event, session) => {
      if (session?.user) saveProfile(profileFromUser(session.user));
      else if (event === "SIGNED_OUT") clearProfile();
    });
    return () => sub.subscription.unsubscribe();
  }, []);
  return null;
}
