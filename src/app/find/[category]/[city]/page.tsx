import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, getCategory } from "@/lib/categories";
import { SEO_CITIES, getCity } from "@/lib/location/cities";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

// One indexable landing page per category × city — ranks for searches like
// "find a DJ in Accra" and funnels those visitors into the app.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; city: string }>;
}): Promise<Metadata> {
  const { category, city } = await params;
  const cat = getCategory(category);
  const place = getCity(city);
  if (!cat || !place) return {};
  const lower = cat.name.toLowerCase();
  const title = `${cat.name} in ${place.name}`;
  const description = `Find a trusted ${lower} in ${place.name}, ${place.country} on ${SITE_NAME} — ratings, prices and one-tap contact. Free, no login needed.`;
  return {
    title,
    description,
    alternates: { canonical: `/find/${cat.id}/${place.slug}` },
    openGraph: { title: `${title} · ${SITE_NAME}`, description, url: `${SITE_URL}/find/${cat.id}/${place.slug}` },
    twitter: { title: `${title} · ${SITE_NAME}`, description },
  };
}

export default async function CityCategoryLanding({
  params,
}: {
  params: Promise<{ category: string; city: string }>;
}) {
  const { category, city } = await params;
  const cat = getCategory(category);
  const place = getCity(city);
  if (!cat || !place) notFound();

  const name = cat.name;
  const lower = name.toLowerCase();
  const related = CATEGORIES.filter((c) => c.id !== cat.id && c.group === cat.group).slice(0, 6);
  const otherCities = SEO_CITIES.filter((c) => c.slug !== place.slug).slice(0, 8);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: name,
    name: `${name} in ${place.name}`,
    areaServed: { "@type": "City", name: place.name, address: { "@type": "PostalAddress", addressCountry: place.country } },
    description: `Find a ${lower} in ${place.name} on ${SITE_NAME}.`,
    provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    url: `${SITE_URL}/find/${cat.id}/${place.slug}`,
  };

  const steps: [string, string][] = [
    ["1", `Open anywork4me in ${place.name} — it finds ${lower}s near you instantly.`],
    ["2", "Compare ratings, prices and who's available right now."],
    ["3", `Call, chat or book your ${lower} in one tap.`],
  ];

  return (
    <main className="mx-auto min-h-dvh w-full max-w-2xl px-5 pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="py-5">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          anywork<span className="text-accent">4me</span>
        </Link>
      </header>

      <div className="pt-6 text-center">
        <span className="brand-gradient mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl text-4xl text-accent-foreground shadow-sm">
          {cat.emoji}
        </span>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
          Find a {name} in {place.name}
        </h1>
        <p className="mt-3 text-balance text-muted">
          Need a {lower} in {place.name}, {place.country}? anywork4me shows you available {lower}s
          nearby — with ratings, prices and one-tap contact. No login, no hassle.
        </p>
        <Link
          href={`/search?category=${cat.id}`}
          className="brand-gradient mt-6 inline-flex h-12 items-center justify-center rounded-2xl px-6 text-base font-semibold text-accent-foreground shadow-sm transition active:scale-[0.99]"
        >
          See {name}s near you
        </Link>
      </div>

      <section className="mt-14">
        <h2 className="text-center text-sm font-semibold uppercase tracking-wide text-muted">
          How it works in {place.name}
        </h2>
        <ol className="mt-5 space-y-3">
          {steps.map(([n, text]) => (
            <li key={n} className="flex items-start gap-3 rounded-2xl border border-border bg-surface-2 px-4 py-3">
              <span className="brand-gradient flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold text-accent-foreground">
                {n}
              </span>
              <span className="text-[15px]">{text}</span>
            </li>
          ))}
        </ol>
      </section>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="text-center text-sm font-semibold uppercase tracking-wide text-muted">
            Also in {place.name}
          </h2>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {related.map((c) => (
              <Link
                key={c.id}
                href={`/find/${c.id}/${place.slug}`}
                className="rounded-full border border-border bg-surface-2 px-3.5 py-2 text-sm font-medium transition hover:border-accent/40"
              >
                {c.emoji} {c.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-14">
        <h2 className="text-center text-sm font-semibold uppercase tracking-wide text-muted">
          {name}s in other cities
        </h2>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {otherCities.map((c) => (
            <Link
              key={c.slug}
              href={`/find/${cat.id}/${c.slug}`}
              className="rounded-full border border-border bg-surface-2 px-3.5 py-2 text-sm font-medium transition hover:border-accent/40"
            >
              {name}s in {c.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="brand-gradient mt-14 rounded-3xl px-6 py-8 text-center text-accent-foreground">
        <h2 className="text-xl font-semibold">
          Are you a {lower} in {place.name}?
        </h2>
        <p className="mt-2 text-sm opacity-90">
          List yourself free and get found by people in {place.name} who need you.
        </p>
        <Link
          href="/available"
          className="mt-4 inline-flex h-11 items-center justify-center rounded-2xl bg-background px-5 text-sm font-semibold text-foreground shadow-sm"
        >
          List your service
        </Link>
      </section>

      <footer className="mt-14 text-center text-xs text-muted">
        <Link href={`/find/${cat.id}`} className="hover:text-foreground">
          All {name}s
        </Link>{" "}
        · <Link href="/" className="hover:text-foreground">anywork4me</Link>
      </footer>
    </main>
  );
}
