import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Community Guidelines — anywork4me",
  description: "The rules that keep anywork4me safe and trustworthy.",
};

export default function GuidelinesPage() {
  return (
    <LegalLayout title="Community Guidelines" updated="28 June 2026">
      <p>
        These guidelines keep anywork4me safe and trustworthy for everyone. This is a scaffold —
        replace the sections below with your finalized rules.
      </p>
      <LegalSection heading="Be genuine">
        <p>Use real names, accurate listings, and honest pricing.</p>
      </LegalSection>
      <LegalSection heading="Be respectful">
        <p>No harassment, hate speech, or abusive behaviour.</p>
      </LegalSection>
      <LegalSection heading="No prohibited content or services">
        <p>No illegal, fraudulent, adult, or unsafe goods and services.</p>
      </LegalSection>
      <LegalSection heading="Reviews & ratings">
        <p>Reviews must reflect genuine experiences. No fake or incentivised reviews.</p>
      </LegalSection>
      <LegalSection heading="Reporting & enforcement">
        <p>
          Report violations to{" "}
          <a className="text-accent underline" href="mailto:support@anywork4me.com">
            support@anywork4me.com
          </a>
          . We may warn, suspend, or remove accounts that break these rules.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
