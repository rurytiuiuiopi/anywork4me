import Link from "next/link";
import { Brand } from "@/components/Brand";
import { CategoryGrid } from "@/components/CategoryGrid";
import { LocationControl } from "@/components/LocationControl";
import { SavedLink } from "@/components/SavedLink";
import { SearchBar } from "@/components/SearchBar";

export default function HomePage() {
  return (
    <main className="relative mx-auto min-h-dvh w-full max-w-2xl px-5 pb-16">
      {/* soft brand glow behind the hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 0%, color-mix(in oklab, var(--accent) 22%, transparent), transparent 70%)",
        }}
      />

      <header className="flex items-center justify-between gap-3 py-5">
        <Brand />
        <div className="flex items-center gap-2">
          <LocationControl compact />
          <SavedLink />
        </div>
      </header>

      <section className="pt-10 text-center sm:pt-16">
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          What are you looking for <span className="brand-text">today?</span>
        </h1>
        <p className="mx-auto mt-3 max-w-md text-balance text-muted">
          Find trusted people, services and businesses near you. One search. One tap.
        </p>

        <div className="mx-auto mt-8 max-w-xl fm-fade-up">
          <SearchBar size="lg" />
        </div>
      </section>

      <section className="mt-10">
        <CategoryGrid />
      </section>

      <section className="mt-10">
        <Link
          href="/available"
          className="group flex items-center gap-4 rounded-3xl border border-border bg-surface-2 p-5 transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <span className="brand-gradient flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl text-accent-foreground shadow-sm">
            ✋
          </span>
          <span className="flex-1">
            <span className="block font-semibold">Offer a service?</span>
            <span className="block text-sm text-muted">
              Tap “I’m Available” and let people nearby find you.
            </span>
          </span>
          <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-muted transition group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
          </svg>
        </Link>
      </section>

      <footer className="mt-12 flex items-center justify-center gap-3 text-sm text-muted">
        <Link href="/privacy" className="transition hover:text-foreground">Privacy</Link>
        <span aria-hidden>·</span>
        <Link href="/terms" className="transition hover:text-foreground">Terms</Link>
      </footer>
    </main>
  );
}
