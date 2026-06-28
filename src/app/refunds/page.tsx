import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Refund Policy — anywork4me",
  description: "How refunds, cancellations, and disputes work on anywork4me.",
};

export default function RefundsPage() {
  return (
    <LegalLayout title="Refund Policy" updated="28 June 2026">
      <p>
        This page describes how refunds, cancellations, and disputes are handled. It is a scaffold —
        replace the sections below with your finalized policy.
      </p>
      <LegalSection heading="Pro subscriptions">
        <p>Terms for refunds or cancellation of Pro/Verified subscriptions go here.</p>
      </LegalSection>
      <LegalSection heading="Bookings & services">
        <p>How cancellations and refunds for booked services are handled go here.</p>
      </LegalSection>
      <LegalSection heading="Disputes & chargebacks">
        <p>How disputes between customers and providers are resolved go here.</p>
      </LegalSection>
      <LegalSection heading="How to request a refund">
        <p>
          Email{" "}
          <a className="text-accent underline" href="mailto:support@anywork4me.com">
            support@anywork4me.com
          </a>{" "}
          with your details.
        </p>
      </LegalSection>
      <p className="text-xs text-muted">
        This document is a starting template, not legal advice. Review and adapt it for your business
        and jurisdiction.
      </p>
    </LegalLayout>
  );
}
