import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy — anywork4me",
  description: "How anywork4me collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="26 June 2026">
      <p>
        This Privacy Policy explains how anywork4me (“we”, “us”) handles information when you
        use our website and apps (the “Service”). By using the Service you agree to this
        policy.
      </p>

      <LegalSection heading="Information we collect">
        <p>
          <strong>Location.</strong> We detect your approximate location (from your browser’s
          timezone/language, and — only if you allow it — precise GPS) to show nearby results.
          You can change your location manually at any time.
        </p>
        <p>
          <strong>Searches.</strong> The categories and terms you search for, to return
          relevant providers.
        </p>
        <p>
          <strong>Provider profiles.</strong> If you register as a provider (“I’m Available”),
          we collect the details you submit: name, business, category, area, phone, pricing,
          and description. This information is shown publicly so customers can find you.
        </p>
        <p>
          <strong>On-device data.</strong> Your saved providers are stored locally on your
          device and are not sent to our servers.
        </p>
      </LegalSection>

      <LegalSection heading="How we use information">
        <p>To provide search, show nearby providers, enable contact and bookings, and improve the Service.</p>
        <p>We do not sell your personal information.</p>
      </LegalSection>

      <LegalSection heading="Sharing">
        <p>
          Provider profile details are public by design. We use trusted infrastructure
          providers (including Supabase for our database and Vercel for hosting) to operate
          the Service. We may disclose information if required by law.
        </p>
      </LegalSection>

      <LegalSection heading="Cookies & advertising">
        <p>
          We use essential cookies to keep the Service working, and Google Ads cookies to
          measure our advertising and reach people who may be interested in anywork4me. We use
          Google Consent Mode: in the EU and UK these advertising cookies stay off until you
          accept them in our cookie banner.
        </p>
      </LegalSection>

      <LegalSection heading="Data storage & security">
        <p>
          Data is stored with our database provider (Supabase) and protected with
          industry-standard measures. No method of transmission or storage is 100% secure.
        </p>
      </LegalSection>

      <LegalSection heading="Your choices & rights">
        <p>
          You can decline precise location, change your region, and clear your saved providers
          from your device. To request access to or deletion of a provider profile you
          created, contact us.
        </p>
      </LegalSection>

      <LegalSection heading="Children">
        <p>The Service is not directed to children under 13 (or the age required in your country).</p>
      </LegalSection>

      <LegalSection heading="Changes">
        <p>We may update this policy; we’ll revise the “Last updated” date above.</p>
      </LegalSection>

      <LegalSection heading="Contact">
        <p>
          Questions about this policy? Email{" "}
          <a className="text-accent underline" href="mailto:dgcceo21@gmail.com">dgcceo21@gmail.com</a>.
        </p>
      </LegalSection>

      <p className="text-xs text-muted">
        This document is a starting template provided for convenience and is not legal advice.
        Please review and adapt it (ideally with a professional) for your business and
        jurisdiction before relying on it.
      </p>
    </LegalLayout>
  );
}
