"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AccountMenu } from "@/components/AccountMenu";
import { Brand } from "@/components/Brand";
import { IconPlus } from "@/components/Icons";
import { NotificationBell } from "@/components/NotificationBell";
import { signOutAuth } from "@/lib/auth";
import { getProfile, isSignedIn, type LocalProfile } from "@/lib/profile";

export function HomeNav() {
  const router = useRouter();
  const [profile, setProfile] = useState<LocalProfile | null>(null);

  useEffect(() => {
    setProfile(isSignedIn() ? getProfile() : null);
  }, []);

  async function handleSignOut() {
    await signOutAuth();
    setProfile(null);
    router.push("/");
  }

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
          <NotificationBell />
          {profile ? (
            <>
              <Link
                href="/available"
                className="brand-gradient inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-accent-foreground shadow-sm transition active:scale-95"
              >
                <IconPlus className="h-4 w-4" /> Post listing
              </Link>
              <AccountMenu profile={profile} onSignOut={handleSignOut} />
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="rounded-full px-3 py-2 text-sm font-medium text-muted transition hover:text-foreground"
              >
                Sign in
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
