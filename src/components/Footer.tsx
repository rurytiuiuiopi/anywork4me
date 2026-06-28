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

function GhanaFlag({ className = "h-3.5 w-[21px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 9 6" role="img" aria-label="Ghana" className={`${className} shrink-0 rounded-[2px]`}>
      <rect width="9" height="2" y="0" fill="#ce1126" />
      <rect width="9" height="2" y="2" fill="#fcd116" />
      <rect width="9" height="2" y="4" fill="#006b3f" />
      <path
        d="M4.5 2.1 4.71 2.71 5.36 2.72 4.84 3.11 5.03 3.73 4.5 3.36 3.97 3.73 4.16 3.11 3.64 2.72 4.29 2.71Z"
        fill="#111"
      />
    </svg>
  );
}

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

        <div className="mt-6 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-sm text-muted">
            <GhanaFlag />
            Proudly built in <span className="font-semibold text-foreground">Ghana</span>
            <span className="hidden text-muted sm:inline">{" "}— made for the world</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
