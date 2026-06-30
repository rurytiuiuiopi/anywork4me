"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAuthClient, profileFromUser } from "@/lib/auth";
import { saveProfile } from "@/lib/profile";

// The email confirmation link lands here. Supabase has already appended the
// session to the URL; the auth client (detectSessionInUrl) parses it on load.
// We mirror it into the local profile, then bounce home, signed in.
export default function ConfirmEmailPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"working" | "ok" | "error">("working");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const supa = getAuthClient();
        let user = (await supa.auth.getSession()).data.session?.user ?? null;
        if (!user) {
          // Token may still be processing — wait briefly for the auth event.
          user = await new Promise((resolve) => {
            const { data: sub } = supa.auth.onAuthStateChange((_e, s) => {
              if (s?.user) {
                sub.subscription.unsubscribe();
                resolve(s.user);
              }
            });
            setTimeout(() => {
              sub.subscription.unsubscribe();
              resolve(null);
            }, 4000);
          });
        }
        if (!alive) return;
        if (user) {
          saveProfile(profileFromUser(user));
          setStatus("ok");
          setTimeout(() => router.replace("/"), 1600);
        } else {
          setStatus("error");
        }
      } catch {
        if (alive) setStatus("error");
      }
    })();
    return () => {
      alive = false;
    };
  }, [router]);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center px-6 text-center">
      <div className="brand-gradient flex h-16 w-16 items-center justify-center rounded-3xl text-3xl text-accent-foreground shadow-sm">
        {status === "ok" ? "✓" : status === "error" ? "!" : "…"}
      </div>

      {status === "working" && (
        <>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight">Confirming your email…</h1>
          <p className="mt-2 text-muted">One moment while we sign you in.</p>
        </>
      )}

      {status === "ok" && (
        <>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight">Email confirmed 🎉</h1>
          <p className="mt-2 text-muted">You’re signed in. Taking you home…</p>
          <Link href="/" className="mt-5 text-sm font-semibold text-accent">
            Go now ›
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight">
            Verification link expired or invalid
          </h1>
          <p className="mt-2 text-muted">
            No problem — you can sign in directly, or resend a fresh verification email from the
            sign-in page.
          </p>
          <Link
            href="/signin"
            className="brand-gradient mt-5 rounded-2xl px-5 py-2.5 text-sm font-semibold text-accent-foreground"
          >
            Go to sign in &amp; resend
          </Link>
        </>
      )}
    </main>
  );
}
