import Link from "next/link";
import type { Metadata } from "next";
import { FeaturedListings } from "@/components/FeaturedListings";
import { Footer } from "@/components/Footer";
import { HomeNav } from "@/components/HomeNav";
import { HomeSearch } from "@/components/HomeSearch";
import { TrustStats } from "@/components/TrustStats";
import {
  IconArrowRight,
  IconBriefcase,
  IconBuilding,
  IconCalendar,
  IconCamera,
  IconCheck,
  IconCompass,
  IconGear,
  IconHeart,
  IconPin,
  IconScissors,
  IconShield,
  IconSparkles,
  IconStar,
  IconTruck,
  IconUser,
  IconUsers,
  IconWrench,
} from "@/components/Icons";

export const metadata: Metadata = {
  title: "anywork4me — find trusted professionals, get work done",
  description:
    "Hire trusted local professionals, freelancers, and businesses — or offer your own services. Search, connect, and get work done, anywhere.",
};

const CATEGORIES = [
  { label: "Home Services", Icon: IconWrench, q: "home" },
  { label: "Cleaning", Icon: IconSparkles, q: "cleaning" },
  { label: "Beauty", Icon: IconScissors, q: "beauty" },
  { label: "Repairs", Icon: IconGear, q: "repair" },
  { label: "Photography", Icon: IconCamera, q: "photographer" },
  { label: "Events", Icon: IconCalendar, q: "events" },
  { label: "Business", Icon: IconBriefcase, q: "business" },
  { label: "Construction", Icon: IconBuilding, q: "construction" },
  { label: "Delivery & Moving", Icon: IconTruck, q: "delivery" },
  { label: "Skilled Workers", Icon: IconUsers, q: "skilled" },
  { label: "Health & Wellness", Icon: IconHeart, q: "health" },
  { label: "Security", Icon: IconShield, q: "security" },
];

const CUSTOMER_STEPS = ["Search what you need", "Connect & message", "Hire with confidence"];
const PRO_STEPS = ["Create your profile", "Get found nearby", "Receive jobs & bookings"];

const TRUST = [
  { title: "Verified profiles", desc: "Real people, real reputations.", Icon: IconCheck },
  { title: "Trusted reviews", desc: "See who others rate first.", Icon: IconStar },
  { title: "Safe contact", desc: "Call or chat directly.", Icon: IconShield },
  { title: "Local discovery", desc: "Find what you need, nearby.", Icon: IconPin },
];

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-surface">
      <HomeNav />

      <main className="mx-auto w-full max-w-5xl px-5 pb-16">
        {/* Hero */}
        <section className="pt-12 text-center sm:pt-20">
          <h1 className="mx-auto max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
            Find Work. Sell Products. <span className="brand-text">Hire People Fast.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-balance text-muted sm:text-lg">
            Hire trusted local professionals, freelancers, and businesses — or offer your own
            services. Search, connect, and get it done.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/search"
              className="brand-gradient inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 font-semibold text-accent-foreground shadow-sm transition active:scale-95"
            >
              <IconCompass className="h-5 w-5" /> Find a Professional
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-2xl border border-border bg-background px-6 py-3.5 font-semibold transition hover:shadow-sm active:scale-95"
            >
              <IconUser className="h-5 w-5 text-accent" /> Offer Your Services
            </Link>
          </div>
          <p className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted">
            <span className="inline-flex items-center gap-1">
              <IconCheck className="h-3.5 w-3.5 text-accent" /> Verified profiles
            </span>
            <span className="inline-flex items-center gap-1">
              <IconCheck className="h-3.5 w-3.5 text-accent" /> Real reviews
            </span>
            <span className="inline-flex items-center gap-1">
              <IconCheck className="h-3.5 w-3.5 text-accent" /> Free to browse
            </span>
          </p>

          <div className="mt-9">
            <HomeSearch />
          </div>
        </section>

        {/* Categories */}
        <section className="mt-16">
          <h2 className="text-center text-xl font-semibold sm:text-2xl">Explore by category</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
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
            <Link
              href="/search"
              className="group flex flex-col items-center justify-center gap-2.5 rounded-3xl border border-dashed border-border bg-background p-5 text-center transition hover:border-accent/40 hover:shadow-md"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                <IconArrowRight className="h-6 w-6" />
              </span>
              <span className="text-sm font-semibold">View all</span>
            </Link>
          </div>
        </section>

        {/* Trust + live stats */}
        <section className="mt-16">
          <h2 className="text-center text-xl font-semibold sm:text-2xl">Built on trust</h2>
          <div className="mx-auto mt-6 max-w-md">
            <TrustStats />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
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

        {/* How it works — two tracks */}
        <section className="mt-16">
          <h2 className="text-center text-xl font-semibold sm:text-2xl">How it works</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              { who: "For customers", steps: CUSTOMER_STEPS, cta: { label: "Find a professional", href: "/search" } },
              { who: "For professionals", steps: PRO_STEPS, cta: { label: "Create your profile", href: "/signup" } },
            ].map((track) => (
              <div key={track.who} className="rounded-3xl border border-border bg-background p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-accent">{track.who}</p>
                <ol className="mt-3 space-y-3">
                  {track.steps.map((s, i) => (
                    <li key={s} className="flex items-center gap-3">
                      <span className="brand-gradient flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-accent-foreground">
                        {i + 1}
                      </span>
                      <span className="text-sm font-medium">{s}</span>
                    </li>
                  ))}
                </ol>
                <Link
                  href={track.cta.href}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent"
                >
                  {track.cta.label} <IconArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Featured */}
        <section className="mt-16">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold sm:text-2xl">Featured professionals</h2>
            <Link href="/search" className="inline-flex items-center gap-1 text-sm font-semibold text-accent">
              See all <IconArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-5">
            <FeaturedListings />
          </div>
        </section>

        {/* Final CTA */}
        <section className="mt-16">
          <div className="brand-gradient rounded-4xl px-6 py-12 text-center text-accent-foreground">
            <h2 className="mx-auto max-w-lg text-balance text-2xl font-semibold sm:text-3xl">
              Join anywork4me and get connected today.
            </h2>
            <p className="mx-auto mt-2 max-w-md text-balance opacity-90">
              Free to browse. Free to post. Real people, ready to work.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-2xl bg-background px-6 py-3.5 font-semibold text-foreground shadow-sm transition active:scale-95"
              >
                <IconUser className="h-5 w-5 text-accent" /> Create a profile
              </Link>
              <Link
                href="/search"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/40 px-6 py-3.5 font-semibold transition hover:bg-white/10 active:scale-95"
              >
                Hire professionals
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
