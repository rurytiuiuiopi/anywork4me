import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Terms of Service — anywork4me",
  description: "The terms for using anywork4me.",
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" updated="26 June 2026">
      <p>
        These Terms govern your use of anywork4me (the “Service”). By using the Service you
        agree to them.
      </p>

      <LegalSection heading="The Service">
        <p>
          anywork4me helps people discover providers, services, and businesses nearby. We are a
          discovery platform — we are not a party to any agreement, booking, or transaction
          between users and providers.
        </p>
      </LegalSection>

      <LegalSection heading="Providers">
        <p>
          If you register as a provider, you confirm the information you submit is accurate and
          that you may lawfully offer the services listed. You are responsible for your
          listings, conduct, and any services you provide.
        </p>
      </LegalSection>

      <LegalSection heading="Acceptable use">
        <p>
          Don’t post false, misleading, illegal, or harmful content; don’t impersonate others;
          don’t misuse, scrape, or disrupt the Service. We may remove content or accounts that
          violate these Terms.
        </p>
      </LegalSection>

      <LegalSection heading="No warranties">
        <p>
          The Service and provider listings are provided “as is”, without warranties. We do not
          verify, endorse, or guarantee any provider, and you engage with providers at your own
          risk. Always use your own judgment.
        </p>
      </LegalSection>

      <LegalSection heading="Limitation of liability">
        <p>
          To the maximum extent permitted by law, we are not liable for indirect or
          consequential damages, or for dealings between users and providers.
        </p>
      </LegalSection>

      <LegalSection heading="Changes & contact">
        <p>
          We may update these Terms; continued use means acceptance. Questions? Email{" "}
          <a className="text-accent underline" href="mailto:support@anywork4me.com">support@anywork4me.com</a>.
        </p>
      </LegalSection>

      <p className="text-xs text-muted">
        This document is a starting template provided for convenience and is not legal advice.
        Please review and adapt it for your business and jurisdiction.
      </p>
    </LegalLayout>
  );
}
