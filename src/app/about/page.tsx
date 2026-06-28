import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "About — anywork4me",
  description: "anywork4me is the simplest way to find trusted people, services, and businesses nearby.",
};

export default function AboutPage() {
  return (
    <LegalLayout title="About anywork4me" updated="28 June 2026">
      <p>
        anywork4me is the simplest way to find trusted people, services, and businesses near you —
        and to offer your own work to the world. Post what you need or what you offer, and connect
        with real people ready to work, sell, buy, or help.
      </p>
      <LegalSection heading="Our mission">
        <p>To make finding work and hiring help effortless for everyone, everywhere.</p>
      </LegalSection>
      <LegalSection heading="Careers">
        <p>
          We’re growing. To express interest, email{" "}
          <a className="text-accent underline" href="mailto:support@anywork4me.com?subject=Careers">
            support@anywork4me.com
          </a>
          .
        </p>
      </LegalSection>
      <LegalSection heading="Contact">
        <p>
          Questions or partnerships?{" "}
          <a className="text-accent underline" href="mailto:support@anywork4me.com">
            support@anywork4me.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
