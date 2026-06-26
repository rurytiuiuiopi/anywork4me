import type { Metadata } from "next";
import { getCategory } from "@/lib/categories";
import { repository } from "@/lib/data";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import type { Provider } from "@/lib/types";
import { ProfileClient } from "./ProfileClient";

async function load(id: string): Promise<Provider | null> {
  try {
    return await repository.getById(id, {});
  } catch {
    return null;
  }
}

// Only real (http) images work as share/OG previews — inline data-URL flyers
// fall back to the site's default card.
const httpImage = (p: Provider) =>
  p.bannerUrl && /^https?:\/\//.test(p.bannerUrl) ? p.bannerUrl : undefined;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const provider = await load(id);
  if (!provider) return { title: "Listing" };

  const role = getCategory(provider.categories[0])?.name ?? "Service";
  const where = provider.location?.city ? ` in ${provider.location.city}` : "";
  const title = `${provider.business || provider.name} — ${role}${where}`;
  const description =
    provider.tagline ||
    provider.bio ||
    `${provider.business || provider.name}, a ${role.toLowerCase()}${where} on ${SITE_NAME}. See ratings, prices and contact in one tap.`;
  const images = httpImage(provider) ? [httpImage(provider)!] : undefined;

  return {
    title,
    description,
    alternates: { canonical: `/provider/${id}` },
    openGraph: {
      type: "profile",
      title: `${title} · ${SITE_NAME}`,
      description,
      url: `${SITE_URL}/provider/${id}`,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · ${SITE_NAME}`,
      description,
      ...(images ? { images } : {}),
    },
  };
}

export default async function ProviderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const provider = await load(id);

  const jsonLd = provider
    ? {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: provider.business || provider.name,
        ...(provider.tagline || provider.bio
          ? { description: provider.tagline || provider.bio }
          : {}),
        ...(httpImage(provider) ? { image: httpImage(provider) } : {}),
        address: {
          "@type": "PostalAddress",
          addressLocality: provider.location?.city,
          addressCountry: provider.location?.country,
        },
        ...(provider.reviewsCount > 0
          ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: provider.rating,
                reviewCount: provider.reviewsCount,
              },
            }
          : {}),
        url: `${SITE_URL}/provider/${id}`,
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProfileClient id={id} />
    </>
  );
}
