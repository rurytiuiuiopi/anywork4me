import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Help Centre — anywork4me",
  description: "Answers to common questions about using anywork4me.",
};

export default function HelpPage() {
  return (
    <LegalLayout title="Help Centre" updated="28 June 2026">
      <p>Quick answers to common questions. Need more help? Email us any time.</p>
      <LegalSection heading="How do I find someone?">
        <p>Search from the homepage or browse a category, then call, message, or book the provider.</p>
      </LegalSection>
      <LegalSection heading="How do I post a listing?">
        <p>Create a profile, then tap “Post a listing” and fill in your details — it takes a minute.</p>
      </LegalSection>
      <LegalSection heading="How do bookings & messages work?">
        <p>
          Bookings and messages reach the provider instantly — on WhatsApp and in their in-app
          inbox, with a notification bell.
        </p>
      </LegalSection>
      <LegalSection heading="How do I manage my account?">
        <p>
          Open the account menu (top-right) → “Account &amp; data” to export your data or delete your
          account.
        </p>
      </LegalSection>
      <LegalSection heading="Still need help?">
        <p>
          Email{" "}
          <a className="text-accent underline" href="mailto:support@anywork4me.com">
            support@anywork4me.com
          </a>{" "}
          and we’ll get back to you.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
