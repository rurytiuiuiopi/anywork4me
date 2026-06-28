"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Brand } from "@/components/Brand";
import { IconPlus } from "@/components/Icons";
import { hasProfile } from "@/lib/profile";

export function HomeNav() {
  const [has, setHas] = useState(false);
  useEffect(() => setHas(hasProfile()), []);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-5 py-3">
        <Brand />
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/search"
            className="hidden rounded-full px-3 py-2 text-sm font-medium text-muted transition hover:text-foreground sm:block"
          >
            Browse
          </Link>
          {has ? (
            <Link
              href="/available"
              className="brand-gradient inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-accent-foreground shadow-sm transition active:scale-95"
            >
              <IconPlus className="h-4 w-4" /> Post listing
            </Link>
          ) : (
            <>
              <Link
                href="/signup"
                className="rounded-full px-3 py-2 text-sm font-medium text-muted transition hover:text-foreground"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="brand-gradient rounded-full px-4 py-2 text-sm font-semibold text-accent-foreground shadow-sm transition active:scale-95"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
