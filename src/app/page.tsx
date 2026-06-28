import Link from "next/link";
import type { Metadata } from "next";
import { FeaturedListings } from "@/components/FeaturedListings";
import { HomeNav } from "@/components/HomeNav";
import { HomeSearch } from "@/components/HomeSearch";
import {
  IconArrowRight,
  IconBag,
  IconBriefcase,
  IconBuilding,
  IconCalendar,
  IconCheck,
  IconCompass,
  IconGear,
  IconPin,
  IconPlus,
  IconShield,
  IconStar,
  IconTruck,
  IconUser,
  IconUsers,
  IconWrench,
} from "@/components/Icons";

export const metadata: Metadata = {
  title: "anywork4me — Find work, sell products, hire people fast",
  description:
    "Post what you need or what you offer, and connect with real people nearby ready to work, sell, buy, or help.",
};

const CATEGORIES = [
  { label: "Jobs", Icon: IconBriefcase, q: "job" },
  { label: "Services", Icon: IconWrench, q: "service" },
  { label: "Products", Icon: IconBag, q: "products" },
  { label: "Skilled Workers", Icon: IconUsers, q: "skilled" },
  { label: "Delivery", Icon: IconTruck, q: "delivery" },
  { label: "Events", Icon: IconCalendar, q: "events" },
  { label: "Repairs", Icon: IconGear, q: "repair" },
  { label: "Business Support", Icon: IconBuilding, q: "business" },
];

const STEPS = [
  { n: 1, title: "Create your profile", desc: "Tell people who you are — it takes a minute.", Icon: IconUser },
  { n: 2, title: "Add your listing", desc: "Post your work, product, service, or request.", Icon: IconPlus },
  { n: 3, title: "Get responses", desc: "People apply, contact, buy, or respond.", Icon: IconArrowRight },
];

const TRUST = [
  { title: "Verified profiles", desc: "Real people, real reputations.", Icon: IconCheck },
  { title: "Ratings & reviews", desc: "See who others trust first.", Icon: IconStar },
  { title: "Safe contact", desc: "Call or chat directly — you stay in control.", Icon: IconShield },
  { title: "Local discovery", desc: "Find what you need, right nearby.", Icon: IconPin },
];

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-surface">
      <HomeNav />

      <main className="mx-auto w-full max-w-5xl px-5 pb-20">
        {/* Hero */}
        <section className="pt-12 text-center sm:pt-20">
          <h1 className="mx-auto max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
            Find Work. Sell Products. <span className="brand-text">Hire People Fast.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-balance text-muted sm:text-lg">
            Post what you need or what you offer, and connect with real people ready to work, sell,
            buy, or help.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/signup"
              className="brand-gradient inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 font-semibold text-accent-foreground shadow-sm transition active:scale-95"
            >
              <IconUser className="h-5 w-5" /> Create Profile
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 rounded-2xl border border-border bg-background px-6 py-3.5 font-semibold transition hover:shadow-sm active:scale-95"
            >
              <IconCompass className="h-5 w-5 text-accent" /> Browse Opportunities
            </Link>
          </div>
          <div className="mt-10">
            <HomeSearch />
          </div>
        </section>

        {/* Categories */}
        <section className="mt-16">
          <h2 className="text-center text-xl font-semibold sm:text-2xl">Explore by category</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {CATEGORIES.map(({ label, Icon, q }) => (
              <Link
                key={label}
                href={`/search?q=${q}`}
                className="group flex flex-col items-center gap-2.5 rounded-3xl border border-border bg-background p-5 text-center transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent transition group-hover:bg-accent group-hover:text-accent-foreground">
                  <Icon className="h-6 w-6" />
                </span>
                <span className="text-sm font-semibold">{label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="mt-16">
          <h2 className="text-center text-xl font-semibold sm:text-2xl">How it works</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {STEPS.map(({ n, title, desc, Icon }) => (
              <div key={n} className="rounded-3xl border border-border bg-background p-6 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  <Icon className="h-6 w-6" />
                </span>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-accent">
                  Step {n}
                </p>
                <h3 className="mt-1 font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured */}
        <section className="mt-16">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold sm:text-2xl">Featured near you</h2>
            <Link href="/search" className="inline-flex items-center gap-1 text-sm font-semibold text-accent">
              See all <IconArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-5">
            <FeaturedListings />
          </div>
        </section>

        {/* Trust */}
        <section className="mt-16">
          <h2 className="text-center text-xl font-semibold sm:text-2xl">Built on trust</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {TRUST.map(({ title, desc, Icon }) => (
              <div key={title} className="rounded-3xl border border-border bg-background p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-3 text-sm font-semibold">{title}</h3>
                <p className="mt-1 text-xs text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="mt-16">
          <div className="brand-gradient rounded-4xl px-6 py-12 text-center text-accent-foreground">
            <h2 className="mx-auto max-w-lg text-balance text-2xl font-semibold sm:text-3xl">
              Create your profile and post your first listing today.
            </h2>
            <p className="mx-auto mt-2 max-w-md text-balance opacity-90">
              It’s free, fast, and people nearby are ready to connect.
            </p>
            <Link
              href="/signup"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-background px-6 py-3.5 font-semibold text-foreground shadow-sm transition active:scale-95"
            >
              <IconUser className="h-5 w-5 text-accent" /> Create Profile
            </Link>
          </div>
        </section>

        <footer className="mt-12 flex items-center justify-center gap-3 text-sm text-muted">
          <Link href="/privacy" className="transition hover:text-foreground">
            Privacy
          </Link>
          <span aria-hidden>·</span>
          <Link href="/terms" className="transition hover:text-foreground">
            Terms
          </Link>
        </footer>
      </main>
    </div>
  );
}
