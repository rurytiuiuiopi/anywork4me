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

const CLIENT_KEY = "aw4m.client";

/** This device's stable token for its OUTGOING message threads (as a sender). */
export function getClientToken(): string {
  if (typeof window === "undefined") return "";
  let t = window.localStorage.getItem(CLIENT_KEY);
  if (!t) {
    t = globalThis.crypto.randomUUID();
    window.localStorage.setItem(CLIENT_KEY, t);
  }
  return t;
}

const CHATTED_KEY = "aw4m.chatted";

/** Remember this device messaged a provider, so we surface a Messages inbox to them. */
export function markChatStarted(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CHATTED_KEY, "1");
  } catch {
    /* ignore */
  }
}

/** True if this device has started a chat (and so should see its own inbox). */
export function hasStartedChat(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(CHATTED_KEY) === "1";
  } catch {
    return false;
  }
}
