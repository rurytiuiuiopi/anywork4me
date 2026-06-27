import crypto from "crypto";

// Owner-dashboard gate. Set ADMIN_PASSWORD in the host env to lock it down.
// Until it's set, the dashboard is reachable but shows a "secure me" banner —
// so you can see it immediately, then protect it with one env var.

const PW = process.env.ADMIN_PASSWORD;
export const ADMIN_COOKIE = "aw4m_admin";

export function adminSecured(): boolean {
  return !!PW && PW.length > 0;
}

/** The cookie value we set on successful login (hash of the password). */
export function adminToken(): string {
  return crypto.createHash("sha256").update(PW ?? "").digest("hex");
}

export function checkPassword(password: string): boolean {
  return adminSecured() && password === PW;
}

export function isAuthed(cookieValue: string | undefined): boolean {
  if (!adminSecured()) return true; // not locked yet
  return cookieValue === adminToken();
}
