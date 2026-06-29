// Google Ads conversion tracking.
//
// The base gtag.js (AW-18281882709) is loaded site-wide in GoogleTag.tsx.
// This helper fires a *conversion* so Google Ads learns what a "win" is and
// can optimize the campaign toward it.
//
// ── ACTIVATION (one-time, in Google Ads) ─────────────────────────────────
// 1. Google Ads → Goals → Conversions → + New conversion action → Website.
// 2. Create one action per label below. Use "Sign-up" and "Submit lead form"
//    as the categories. After saving, open each action → "Tag setup" →
//    "Use Google tag" and copy the send_to value, which looks like:
//        AW-18281882709/AbC-D_efGhIjKlMnOp
// 3. Paste each into the matching slot below, replacing PASTE_..._LABEL.
// Until then these fire to a non-existent label and are safely ignored.

const CONVERSIONS = {
  // Primary — fires when a profile/account is created.
  signup: "AW-18281882709/4ceTCO3grcccENXIvY1E",
  // Secondary — fires when a provider publishes a listing.
  listing: "AW-18281882709/ZQN9COjhrcccENXIvY1E",
} as const;

type ConversionName = keyof typeof CONVERSIONS;

type Gtag = (command: string, action: string, params?: Record<string, unknown>) => void;

export function trackConversion(name: ConversionName): void {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (typeof gtag !== "function") return;
  const sendTo = CONVERSIONS[name];
  if (sendTo.includes("PASTE_")) return; // not configured yet — skip silently
  gtag("event", "conversion", { send_to: sendTo });
}
