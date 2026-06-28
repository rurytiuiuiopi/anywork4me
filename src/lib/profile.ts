// The user's profile — created once, before they can post anything.
// Kept on the device (no passwords, no login wall): creating a profile is what
// "unlocks" posting, and it pre-fills every new listing so posting stays fast.

export type AccountType = "worker" | "service" | "seller" | "employer" | "buyer";

export interface LocalProfile {
  name: string;
  business?: string;
  accountType: AccountType;
  email?: string;
  phone?: string;
  city?: string;
  photoUrl?: string;
  bio?: string;
  category?: string; // primary category / skills
  createdAt: string;
  /** Secret key for this user's support thread with Sarah/Admin. */
  supportToken?: string;
  /** True once the auto welcome message has been created (no duplicates). */
  welcomed?: boolean;
  /** Short personal code for the user's referral / invite link. */
  referralCode?: string;
}

export const ACCOUNT_TYPES: { id: AccountType; label: string; desc: string }[] = [
  { id: "service", label: "Service Provider", desc: "I offer a service" },
  { id: "worker", label: "Worker", desc: "I’m looking for work" },
  { id: "seller", label: "Seller", desc: "I sell products" },
  { id: "employer", label: "Employer", desc: "I hire people" },
  { id: "buyer", label: "Buyer", desc: "I buy or request things" },
];

export function accountTypeLabel(id?: AccountType): string {
  return ACCOUNT_TYPES.find((t) => t.id === id)?.label ?? "Member";
}

const KEY = "aw4m.profile";
const SESSION_KEY = "aw4m.session";

export function getProfile(): LocalProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as LocalProfile) : null;
  } catch {
    return null;
  }
}

export function hasProfile(): boolean {
  return !!getProfile();
}

export function saveProfile(profile: LocalProfile): void {
  if (typeof window === "undefined") return;
  // Generate a support thread token once, then preserve it across updates.
  const prev = getProfile();
  const next: LocalProfile = {
    ...profile,
    supportToken: profile.supportToken ?? prev?.supportToken ?? globalThis.crypto.randomUUID(),
    welcomed: profile.welcomed ?? prev?.welcomed ?? false,
    referralCode:
      profile.referralCode ??
      prev?.referralCode ??
      globalThis.crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase(),
  };
  window.localStorage.setItem(KEY, JSON.stringify(next));
  window.localStorage.setItem(SESSION_KEY, "1"); // creating/updating signs you in
}

/** Flag that the auto welcome message has been created for this profile. */
export function markWelcomed(): void {
  const p = getProfile();
  if (!p || typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify({ ...p, welcomed: true }));
}

export function clearProfile(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  window.localStorage.removeItem(SESSION_KEY);
}

/** Signed in = a profile exists on this device and the session is active. */
export function isSignedIn(): boolean {
  if (typeof window === "undefined") return false;
  return !!getProfile() && window.localStorage.getItem(SESSION_KEY) === "1";
}

