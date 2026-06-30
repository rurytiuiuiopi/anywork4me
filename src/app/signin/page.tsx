"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IconArrowRight, IconUser } from "@/components/Icons";
import { resendConfirmation, signInWithPassword } from "@/lib/auth";

const inputCls =
  "h-12 w-full rounded-2xl border border-border bg-surface-2 px-3.5 text-[15px] outline-none transition focus:border-accent";

export default function SigninPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Coming back from the email confirmation link → confirm it worked.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("verified") === "true") {
      setNotice("Email verified successfully. You can now sign in.");
    }
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signInWithPassword(email, password);
      router.push("/");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      setError(/confirm/i.test(msg) ? "Please confirm your email, or resend the link below." : "Wrong email or password.");
      setBusy(false);
    }
  }

  async function resend() {
    if (!/.+@.+\..+/.test(email.trim())) {
      setError("Enter your email above first, then tap resend.");
      return;
    }
    setError(null);
    setNotice("Sending…");
    try {
      await resendConfirmation(email);
      setNotice("Verification email sent — check your inbox (and spam).");
    } catch {
      setNotice(null);
      setError("Couldn’t resend right now. Try again in a moment.");
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-5 py-10">
      <div className="rounded-4xl border border-border bg-background p-7 shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
          <IconUser className="h-7 w-7" />
        </div>
        <h1 className="mt-4 text-center text-2xl font-semibold">Sign in</h1>
        <p className="mt-1 text-center text-muted">Welcome back to anywork4me.</p>

        {notice && (
          <p className="mt-4 rounded-2xl border border-green-300 bg-green-50 px-4 py-2.5 text-center text-sm font-medium text-green-700 dark:border-green-900/50 dark:bg-green-950/40 dark:text-green-300">
            {notice}
          </p>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-3" autoComplete="on">
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            required
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect="off"
            placeholder="Email"
            className={inputCls}
          />
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(null);
            }}
            required
            autoComplete="current-password"
            placeholder="Password"
            className={inputCls}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="brand-gradient flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 font-semibold text-accent-foreground transition active:scale-[0.99] disabled:opacity-50"
          >
            {busy ? "Signing in…" : "Sign in"} <IconArrowRight className="h-5 w-5" />
          </button>
        </form>

        <button
          type="button"
          onClick={resend}
          className="mt-4 w-full text-center text-sm font-medium text-accent transition hover:underline"
        >
          Resend verification email
        </button>

        <p className="mt-3 text-center text-sm text-muted">
          New here?{" "}
          <Link href="/signup" className="font-semibold text-accent">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
