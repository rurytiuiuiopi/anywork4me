import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Copyright & IP Reporting — anywork4me",
  description: "How to report copyright or intellectual-property infringement on anywork4me.",
};

export default function CopyrightPage() {
  return (
    <LegalLayout title="Copyright & IP Reporting" updated="28 June 2026">
      <p>
        We respect intellectual-property rights. If you believe content on anywork4me infringes your
        rights, tell us. This is a scaffold — replace the sections below with your finalized process.
      </p>
      <LegalSection heading="What to include in a report">
        <p>
          Identify the content, your rights to it, your contact details, and a statement of good
          faith.
        </p>
      </LegalSection>
      <LegalSection heading="Submit a report">
        <p>
          Email{" "}
          <a className="text-accent underline" href="mailto:support@anywork4me.com">
            support@anywork4me.com
          </a>{" "}
          with the subject “Copyright report”.
        </p>
      </LegalSection>
      <LegalSection heading="Counter-notice & repeat infringers">
        <p>How affected users can respond, and how repeat infringers are handled, go here.</p>
      </LegalSection>
    </LegalLayout>
  );
}
