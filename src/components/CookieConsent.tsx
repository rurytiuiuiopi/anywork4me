"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "aw4m.cookies";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      /* ignore */
    }
  }, []);

  if (!show) return null;

  function accept() {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    // Grant ad-cookie consent (matters for EU/UK visitors under Consent Mode).
    try {
      (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("consent", "update", {
        ad_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
        analytics_storage: "granted",
      });
    } catch {
      /* ignore */
    }
    setShow(false);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4">
      <div className="mx-auto flex max-w-2xl flex-col gap-3 rounded-3xl border border-border bg-background/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center">
        <p className="flex-1 text-sm text-muted">
          We use cookies to keep anywork4me working and to measure our ads. See our{" "}
          <Link href="/privacy" className="text-accent underline">
            Privacy Policy
          </Link>
          .
        </p>
        <button
          onClick={accept}
          className="brand-gradient shrink-0 rounded-2xl px-5 py-2.5 text-sm font-semibold text-accent-foreground transition active:scale-95"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
