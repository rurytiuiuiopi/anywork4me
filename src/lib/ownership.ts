// Login-free listing ownership. When someone creates a listing we save its
// secret edit token on their device; that's how the app knows to show them an
// "Edit" button later. No accounts, no passwords — true to the no-login rule.

const KEY = "fm.mine";
type Owned = Record<string, string>; // providerId -> editToken

function read(): Owned {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || "{}") as Owned;
  } catch {
    return {};
  }
}

export function rememberListing(id: string, editToken?: string): void {
  if (typeof window === "undefined" || !editToken) return;
  const owned = read();
  owned[id] = editToken;
  window.localStorage.setItem(KEY, JSON.stringify(owned));
}

export function getEditToken(id: string): string | undefined {
  return read()[id];
}

export function forgetListing(id: string): void {
  if (typeof window === "undefined") return;
  const owned = read();
  delete owned[id];
  window.localStorage.setItem(KEY, JSON.stringify(owned));
}

export function ownsListing(id: string): boolean {
  return !!read()[id];
}

/** Every listing this device owns, as {id, token} — for the inbox/notifications. */
export function getOwnedListings(): { id: string; token: string }[] {
  return Object.entries(read()).map(([id, token]) => ({ id, token }));
}
