"use client";

import { useState } from "react";

// Native share sheet where available (great on mobile → WhatsApp etc.), with a
// copy-link fallback. Every share is a free new visitor.
export function ShareButton({
  url,
  title,
  text,
  className = "",
}: {
  url: string;
  title: string;
  text?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const data = { title, text: text ?? title, url };
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(data);
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // user cancelled the share sheet — nothing to do
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      aria-label="Share this listing"
      className={`flex h-10 w-10 items-center justify-center rounded-full bg-background/85 shadow-sm backdrop-blur transition active:scale-95 ${className}`}
    >
      {copied ? (
        <span className="text-xs font-semibold text-accent">✓</span>
      ) : (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 5v10m0-10L8.5 8.5M12 5l3.5 3.5M5 13v4a2 2 0 002 2h10a2 2 0 002-2v-4"
          />
        </svg>
      )}
    </button>
  );
}
