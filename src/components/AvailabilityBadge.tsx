import { type PresenceTone, presence } from "@/lib/presence";
import type { AvailabilityStatus } from "@/lib/types";

const TONE: Record<PresenceTone, { dot: string; text: string }> = {
  online: { dot: "bg-available", text: "text-available" },
  recent: { dot: "bg-available", text: "text-available" },
  away: { dot: "bg-amber-500", text: "text-amber-600" },
  offline: { dot: "bg-muted", text: "text-muted" },
};

// Truthful presence badge — driven by last activity, not a static flag.
export function AvailabilityBadge({
  availability,
  lastActiveAt,
  className = "",
}: {
  availability?: AvailabilityStatus;
  lastActiveAt?: string;
  className?: string;
}) {
  const p = presence({ availability, lastActiveAt });
  const tone = TONE[p.tone];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${tone.text} ${className}`}>
      <span className="relative flex h-2 w-2">
        {p.live && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-available opacity-60" />
        )}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${tone.dot}`} />
      </span>
      {p.label}
    </span>
  );
}
