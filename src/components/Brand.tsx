import Link from "next/link";

export function Brand({ size = "md" }: { size?: "md" | "lg" }) {
  return (
    <Link href="/" className="inline-flex items-center gap-2" aria-label="anywork4me home">
      <span className="brand-gradient flex h-8 w-8 items-center justify-center rounded-xl text-accent-foreground shadow-sm">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.4}>
          <circle cx="11" cy="11" r="6.5" />
          <path strokeLinecap="round" d="M20.5 20.5l-4.2-4.2" />
        </svg>
      </span>
      <span className={`font-semibold tracking-tight ${size === "lg" ? "text-2xl" : "text-lg"}`}>
        anywork<span className="brand-text">4me</span>
      </span>
    </Link>
  );
}
