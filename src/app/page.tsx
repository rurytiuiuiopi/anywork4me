import Link from "next/link";
import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { HomeNav } from "@/components/HomeNav";
import { HomeSearch } from "@/components/HomeSearch";
import { StepChat, StepDeal, StepFind } from "@/components/Illustrations";
import { PricingSection } from "@/components/PricingSection";
import { WaitlistBanner } from "@/components/WaitlistBanner";
import {
  IconBriefcase,
  IconBuilding,
  IconCalendar,
  IconCamera,
  IconCheck,
  IconCompass,
  IconGear,
  IconHeart,
  IconScissors,
  IconShield,
  IconSparkles,
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

const STEPS = [
  { Illo: StepFind, title: "Find nearby", desc: "Search for what you need and see trusted people right around you." },
  { Illo: StepChat, title: "Connect & chat", desc: "Message or book them directly in the app — no middleman." },
  { Illo: StepDeal, title: "Get it done", desc: "Agree, get the work done, and rate your experience." },
];

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-surface">
      {/* Pre-launch demand capture — one-tap email join above everything. */}
      <WaitlistBanner />
      <HomeNav />

      <main className="mx-auto w-full max-w-5xl px-5 pb-10">
        {/* Hero */}
        <section className="pt-8 sm:pt-12">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div className="text-center lg:text-left">
              <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Find Work. Sell Products. <span className="brand-text">Hire People Fast.</span>
              </h1>
              <p className="mx-auto mt-3 max-w-xl text-balance text-muted sm:text-lg lg:mx-0">
                Hire trusted local professionals, freelancers, and businesses — or offer your own
                services. Search, connect, and get it done.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
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
              <p className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted lg:justify-start">
                <span className="inline-flex items-center gap-1">
                  <IconCheck className="h-3.5 w-3.5 text-accent" /> Verified profiles
                </span>
                <span className="inline-flex items-center gap-1">
                  <IconCheck className="h-3.5 w-3.5 text-accent" /> Free to join
                </span>
                <span className="inline-flex items-center gap-1">
                  <IconCheck className="h-3.5 w-3.5 text-accent" /> Nearby & instant
                </span>
              </p>
            </div>
            <div className="mx-auto w-full max-w-md overflow-hidden rounded-4xl border border-border shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/hero-trade.jpg"
                alt="A delivery pro handing products to a happy customer"
                className="aspect-[4/3] w-full object-cover"
                width={1100}
                height={760}
              />
            </div>
          </div>

          <div className="mt-8">
            <HomeSearch />
          </div>
        </section>

        {/* Categories */}
        <section className="mt-10">
          <h2 className="text-center text-lg font-semibold sm:text-xl">Explore by category</h2>
          <div className="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-6">
            {CATEGORIES.map(({ label, Icon, q }) => (
              <Link
                key={label}
                href={`/search?q=${q}`}
                className="group flex flex-col items-center gap-2 rounded-2xl border border-border bg-background p-3.5 text-center transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent transition group-hover:bg-accent group-hover:text-accent-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-xs font-semibold leading-tight">{label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* How it works — illustrated */}
        <section className="mt-12">
          <h2 className="text-center text-lg font-semibold sm:text-xl">How it works</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {STEPS.map(({ Illo, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center">
                <Illo className="h-24 w-24" />
                <h3 className="mt-3 font-semibold">{title}</h3>
                <p className="mx-auto mt-1 max-w-[15rem] text-sm text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Real professionals across every trade */}
        <section className="mt-12">
          <h2 className="text-center text-lg font-semibold sm:text-xl">Real people, every trade</h2>
          <p className="mx-auto mt-1 max-w-md text-center text-sm text-muted">
            From plumbing to beauty, catering to electrical — trusted pros near you.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { src: "/images/pro-plumbing.jpg", label: "Plumbing" },
              { src: "/images/pro-beauty.jpg", label: "Beauty" },
              { src: "/images/pro-electrical.jpg", label: "Electrical" },
              { src: "/images/pro-catering.jpg", label: "Catering" },
            ].map((p) => (
              <div
                key={p.label}
                className="group relative overflow-hidden rounded-3xl border border-border"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.src}
                  alt={p.label}
                  width={720}
                  height={560}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <span className="absolute bottom-2 left-2 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                  {p.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing — free vs pro */}
        <PricingSection />

        {/* Final CTA */}
        <section className="mt-10">
          <div className="brand-gradient rounded-4xl px-6 py-8 text-center text-accent-foreground">
            <h2 className="mx-auto max-w-lg text-balance text-xl font-semibold sm:text-2xl">
              Be one of the first on anywork4me.
            </h2>
            <p className="mx-auto mt-2 max-w-md text-balance opacity-90">
              Free to browse. Free to post. Claim your spot and start getting found today.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
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
