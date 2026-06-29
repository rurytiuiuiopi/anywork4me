// Truthful presence — derived from real activity, not a static "available" flag.
//
// A provider's `last_active_at` is bumped when they register, edit, or open
// their own listing/inbox. We turn that timestamp (plus any explicit "busy"
// they set) into a human label, so the badge reflects reality:
//   Online now · Active 3h ago · Active 5d ago · Offline

import type { AvailabilityStatus } from "./types";

export type PresenceTone = "online" | "recent" | "away" | "offline";

export interface Presence {
  label: string;
  tone: PresenceTone;
  /** Show the pulsing "live" dot. */
  live: boolean;
}

const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

export function presence(input: {
  availability?: AvailabilityStatus;
  lastActiveAt?: string;
}): Presence {
  // An explicit "busy" the provider set always wins.
  if (input.availability === "busy") return { label: "Busy", tone: "away", live: false };

  const t = input.lastActiveAt ? Date.parse(input.lastActiveAt) : NaN;
  if (!Number.isFinite(t)) {
    // No activity signal yet (e.g. before the migration runs) — stay neutral
    // rather than claiming "available".
    return input.availability === "available"
      ? { label: "Available", tone: "recent", live: false }
      : { label: "Offline", tone: "offline", live: false };
  }

  const ago = Date.now() - t;
  if (ago < 15 * MIN) return { label: "Online now", tone: "online", live: true };
  if (ago < HOUR) return { label: "Active recently", tone: "recent", live: false };
  if (ago < DAY) return { label: `Active ${Math.max(1, Math.round(ago / HOUR))}h ago`, tone: "recent", live: false };
  if (ago < 7 * DAY) return { label: `Active ${Math.round(ago / DAY)}d ago`, tone: "away", live: false };
  return { label: "Offline", tone: "offline", live: false };
}
