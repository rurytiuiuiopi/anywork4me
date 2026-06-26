import type { AvailabilityStatus } from "@/lib/types";

const MAP: Record<AvailabilityStatus, { label: string; dot: string; text: string }> = {
  available: { label: "Available now", dot: "bg-available", text: "text-available" },
  busy: { label: "Busy", dot: "bg-amber-500", text: "text-amber-600" },
  offline: { label: "Offline", dot: "bg-muted", text: "text-muted" },
};

export function AvailabilityBadge({
  status,
  className = "",
}: {
  status: AvailabilityStatus;
  className?: string;
}) {
  const s = MAP[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${s.text} ${className}`}>
      <span className="relative flex h-2 w-2">
        {status === "available" && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-available opacity-60" />
        )}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${s.dot}`} />
      </span>
      {s.label}
    </span>
  );
}
