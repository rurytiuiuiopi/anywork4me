import Link from "next/link";
import { Brand } from "@/components/Brand";

const GROUPS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/about#careers" },
      { label: "Contact", href: "mailto:support@anywork4me.com" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Centre", href: "/help" },
      { label: "Community Guidelines", href: "/guidelines" },
      { label: "Copyright", href: "/copyright" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/privacy" },
      { label: "Refund Policy", href: "/refunds" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Create profile", href: "/signup" },
      { label: "Sign in", href: "/signin" },
      { label: "Post a listing", href: "/available" },
      { label: "Account & data", href: "/account" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border pt-10">
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
        {GROUPS.map((g) => (
          <div key={g.title}>
            <h3 className="text-sm font-semibold">{g.title}</h3>
            <ul className="mt-3 space-y-2">
              {g.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-muted transition hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-10 border-t border-border pt-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Brand />
          <div className="flex items-center gap-4 text-sm text-muted">
            <span>🌍 English · Global</span>
            <a href="mailto:support@anywork4me.com" className="transition hover:text-foreground">
              Email
            </a>
          </div>
          <p className="text-xs text-muted">© {new Date().getFullYear()} anywork4me</p>
        </div>
      </div>
    </footer>
  );
}
