// Referral / invite engine (client helpers).
import { getProfile } from "./profile";
import { SITE_URL } from "./seo";

const REF_KEY = "aw4m.ref";
const CODE = /^[a-z0-9]{4,16}$/i;

/** On landing, remember the inviter's code from ?ref= (first one wins). */
export function captureRef(): void {
  if (typeof window === "undefined") return;
  const ref = new URLSearchParams(window.location.search).get("ref");
  if (ref && CODE.test(ref)) {
    try {
      if (!localStorage.getItem(REF_KEY)) localStorage.setItem(REF_KEY, ref);
    } catch {
      /* ignore */
    }
  }
}

export function inviteLink(): string {
  const code = getProfile()?.referralCode ?? "";
  return `${SITE_URL}/?ref=${code}`;
}

export function inviteMessage(): string {
  return `Join me on AnyWork4Me — find work, hire people, and sell your services near you. Sign up here: ${inviteLink()}`;
}

/** Record this new user's referral (called once, on signup). */
export async function recordReferral(): Promise<void> {
  if (typeof window === "undefined") return;
  let ref: string | null = null;
  try {
    ref = localStorage.getItem(REF_KEY);
  } catch {
    return;
  }
  const myCode = getProfile()?.referralCode;
  if (!ref || ref === myCode) return; // no inviter, or self-referral
  try {
    await fetch("/api/referral", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: ref }),
    });
    localStorage.removeItem(REF_KEY); // count once
  } catch {
    /* ignore */
  }
}

export async function fetchReferralCount(): Promise<number> {
  const code = getProfile()?.referralCode;
  if (!code) return 0;
  try {
    const res = await fetch(`/api/referral?code=${encodeURIComponent(code)}`);
    if (!res.ok) return 0;
    const d = (await res.json()) as { count?: number };
    return d.count ?? 0;
  } catch {
    return 0;
  }
}

export function referralBadge(count: number): { label: string; emoji: string } | null {
  if (count >= 25) return { label: "Ambassador", emoji: "🏆" };
  if (count >= 10) return { label: "Top Recruiter", emoji: "⭐" };
  if (count >= 3) return { label: "Recruiter", emoji: "🔥" };
  if (count >= 1) return { label: "Inviter", emoji: "👋" };
  return null;
}
