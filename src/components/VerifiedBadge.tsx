// Phase 1 trust signal (enabled in config.trust.verifiedBadges).

export function VerifiedBadge({
  withLabel = false,
  className = "",
}: {
  withLabel?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-accent ${className}`}
      title="Verified provider"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
        <path d="M12 1l2.6 1.9 3.2-.3 1 3.1 2.7 1.8-1 3.1 1 3.1-2.7 1.8-1 3.1-3.2-.3L12 23l-2.6-1.9-3.2.3-1-3.1L2.5 16.6l1-3.1-1-3.1 2.7-1.8 1-3.1 3.2.3L12 1z" />
        <path
          d="M8 12.2l2.5 2.5L16 9.2"
          fill="none"
          stroke="var(--background)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {withLabel && <span className="text-xs font-semibold">Verified</span>}
    </span>
  );
}
