// Client helpers for the user's support thread with Sarah/Admin.
import { getProfile, markWelcomed } from "./profile";

export interface SupportMessage {
  id: string;
  sender: "system" | "user" | "admin";
  body: string;
  read: boolean;
  createdAt: string;
}

async function call(payload: Record<string, unknown>): Promise<any> {
  // eslint-disable-line @typescript-eslint/no-explicit-any
  try {
    const res = await fetch("/api/support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch {
    return { messages: [], unread: 0 };
  }
}

/** Create the welcome message once per profile (idempotent on the server too). */
export async function ensureWelcome(): Promise<void> {
  const p = getProfile();
  if (!p?.supportToken || p.welcomed) return;
  await call({ token: p.supportToken, op: "welcome", name: p.name, email: p.email });
  markWelcomed();
}

export async function syncSupport(): Promise<{ messages: SupportMessage[]; unread: number }> {
  const p = getProfile();
  if (!p?.supportToken) return { messages: [], unread: 0 };
  const r = await call({ token: p.supportToken, op: "sync" });
  return { messages: r.messages ?? [], unread: r.unread ?? 0 };
}

export async function supportUnread(): Promise<number> {
  const p = getProfile();
  if (!p?.supportToken) return 0;
  const r = await call({ token: p.supportToken, op: "count" });
  return r.unread ?? 0;
}

export async function sendSupportReply(body: string): Promise<boolean> {
  const p = getProfile();
  if (!p?.supportToken) return false;
  const r = await call({ token: p.supportToken, op: "reply", name: p.name, body });
  return !!r.ok;
}
