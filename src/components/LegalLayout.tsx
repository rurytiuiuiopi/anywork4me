import Link from "next/link";
import { Brand } from "./Brand";

// Shared shell for legal pages (privacy, terms) — needed for app-store listings.
export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto min-h-dvh w-full max-w-2xl px-5 pb-20">
      <header className="flex items-center justify-between gap-3 py-5">
        <Brand />
        <Link
          href="/"
          className="rounded-full border border-border px-4 py-2 text-sm font-medium transition hover:bg-surface"
        >
          Home
        </Link>
      </header>

      <h1 className="pt-4 text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-1 text-sm text-muted">Last updated {updated}</p>

      <div className="legal mt-8 space-y-6 text-[15px] leading-relaxed text-foreground/90">
        {children}
      </div>

      <footer className="mt-12 flex gap-4 border-t border-border pt-6 text-sm text-muted">
        <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
        <Link href="/terms" className="hover:text-foreground">Terms</Link>
        <Link href="/" className="hover:text-foreground">Home</Link>
      </footer>
    </main>
  );
}

export function LegalSection({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-lg font-semibold">{heading}</h2>
      <div className="space-y-2 text-muted">{children}</div>
    </section>
  );
}
