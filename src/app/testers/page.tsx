import type { Metadata } from "next";
import Link from "next/link";
import { Brand } from "@/components/Brand";

export const metadata: Metadata = {
  title: "Become a founding tester — anywork4me",
  description: "Get early access to anywork4me and help shape it.",
};

const MAILTO =
  "mailto:support@anywork4me.com?subject=anywork4me%20tester&body=Hi!%20I'd%20like%20to%20be%20a%20founding%20tester%20for%20anywork4me.%20My%20Google%20account%20email%20is%3A%20";

const steps = [
  "Send us the Gmail address you use on your phone (button below).",
  "We add you to the testers list and send you a join link.",
  "Tap the link, then “Download on Google Play” to install the app.",
  "Use it for a few days and tell us what you think — that's it!",
];

export default function TestersPage() {
  return (
    <main className="relative mx-auto min-h-dvh w-full max-w-2xl px-5 pb-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 0%, color-mix(in oklab, var(--accent) 22%, transparent), transparent 70%)",
        }}
      />
      <header className="flex items-center justify-between gap-3 py-5">
        <Brand />
        <Link
          href="/"
          className="rounded-full border border-border px-4 py-2 text-sm font-medium transition hover:bg-surface"
        >
          Home
        </Link>
      </header>

      <section className="pt-8 text-center sm:pt-12">
        <span className="brand-gradient inline-flex h-14 w-14 items-center justify-center rounded-2xl text-3xl text-accent-foreground shadow-sm">
          🚀
        </span>
        <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight">
          Become a <span className="brand-text">founding tester</span>
        </h1>
        <p className="mx-auto mt-3 max-w-md text-balance text-muted">
          anywork4me is launching on Android. Get in early, install the app before everyone
          else, and help shape it. Takes two minutes.
        </p>

        <a
          href={MAILTO}
          className="brand-gradient mt-7 inline-flex h-13 items-center justify-center rounded-2xl px-7 text-base font-semibold text-accent-foreground transition active:scale-[0.99]"
          style={{ height: "3.25rem" }}
        >
          Request my tester invite
        </a>
        <p className="mt-3 text-xs text-muted">We just need the Gmail you use on your phone.</p>
      </section>

      <section className="mt-12 rounded-3xl border border-border bg-surface-2 p-6">
        <h2 className="text-lg font-semibold">How it works</h2>
        <ol className="mt-4 space-y-4">
          {steps.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="brand-gradient flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold text-accent-foreground">
                {i + 1}
              </span>
              <span className="pt-0.5 text-[15px] text-foreground/90">{s}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-8 text-center">
        <p className="text-balance text-sm text-muted">
          Already using the web app?{" "}
          <Link href="/" className="font-medium text-accent hover:underline">
            Open anywork4me
          </Link>{" "}
          — it works in any phone browser, too.
        </p>
      </section>
    </main>
  );
}
