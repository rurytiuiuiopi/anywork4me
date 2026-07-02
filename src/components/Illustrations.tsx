// On-brand SVG illustrations — no photos, no licensing, infinitely crisp.
// Purple brand palette: indigo #4f46e5, violet #7c3aed, lavender #ede9fe, amber accent.

export function ConnectIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 440 300"
      className={className}
      role="img"
      aria-label="Two people connecting nearby to trade services and skills"
      fill="none"
    >
      <rect x="8" y="16" width="424" height="268" rx="34" fill="#ede9fe" />
      <path d="M220 44c-13 0-24 11-24 24 0 17 24 38 24 38s24-21 24-38c0-13-11-24-24-24z" fill="#7c3aed" />
      <circle cx="220" cy="68" r="8.5" fill="#ede9fe" />
      <circle cx="110" cy="180" r="36" fill="#4f46e5" />
      <path d="M56 270a54 54 0 0 1 108 0z" fill="#4f46e5" />
      <circle cx="330" cy="180" r="36" fill="#7c3aed" />
      <path d="M276 270a54 54 0 0 1 108 0z" fill="#7c3aed" />
      <rect x="178" y="136" width="84" height="68" rx="20" fill="#fff" stroke="#c7d2fe" strokeWidth="3" />
      <path d="M200 172l12 12 22-24" stroke="#4f46e5" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="150" cy="108" r="17" fill="#f59e0b" />
      <path
        d="M150 99v18M145 104h8a3 3 0 0 1 0 6h-6a3 3 0 0 0 0 6h8"
        stroke="#7a3d02"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M292 100l4 9 9 4-9 4-4 9-4-9-9-4 9-4z" fill="#f59e0b" />
      <circle cx="158" cy="150" r="4" fill="#a5b4fc" />
      <circle cx="172" cy="146" r="4" fill="#a5b4fc" />
      <circle cx="268" cy="146" r="4" fill="#c4b5fd" />
      <circle cx="282" cy="150" r="4" fill="#c4b5fd" />
    </svg>
  );
}

export function StepFind({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 96" className={className} role="img" aria-label="Search nearby" fill="none">
      <circle cx="48" cy="48" r="46" fill="#ede9fe" />
      <circle cx="43" cy="43" r="19" fill="#fff" stroke="#4f46e5" strokeWidth="6" />
      <line x1="58" y1="58" x2="72" y2="72" stroke="#4f46e5" strokeWidth="7" strokeLinecap="round" />
      <path d="M43 33c-6 0-10 4-10 10 0 7 10 15 10 15s10-8 10-15c0-6-4-10-10-10z" fill="#7c3aed" />
      <circle cx="43" cy="43" r="3.5" fill="#fff" />
    </svg>
  );
}

export function StepChat({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 96" className={className} role="img" aria-label="Connect and chat" fill="none">
      <circle cx="48" cy="48" r="46" fill="#ede9fe" />
      <rect x="20" y="30" width="42" height="30" rx="10" fill="#4f46e5" />
      <path d="M30 60v10l13-10z" fill="#4f46e5" />
      <rect x="42" y="44" width="34" height="25" rx="9" fill="#7c3aed" />
      <path d="M66 69v9l-10-9z" fill="#7c3aed" />
    </svg>
  );
}

export function StepDeal({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 96" className={className} role="img" aria-label="Get it done" fill="none">
      <circle cx="48" cy="48" r="46" fill="#ede9fe" />
      <circle cx="45" cy="48" r="25" fill="#4f46e5" />
      <path d="M35 48l7 7 14-15" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M74 26l3.5 8 8 3.5-8 3.5-3.5 8-3.5-8-8-3.5 8-3.5z" fill="#f59e0b" />
    </svg>
  );
}
