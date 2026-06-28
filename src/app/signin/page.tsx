"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconArrowRight, IconUser } from "@/components/Icons";
import { signInWithPassword } from "@/lib/auth";

const inputCls =
  "h-12 w-full rounded-2xl border border-border bg-surface-2 px-3.5 text-[15px] outline-none transition focus:border-accent";

export default function SigninPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signInWithPassword(email, password);
      router.push("/");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      setError(
        /confirm/i.test(msg)
          ? "Please confirm your email first (check your inbox), then sign in."
          : "Wrong email or password.",
      );
      setBusy(false);
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

        <p className="mt-5 text-center text-sm text-muted">
          New here?{" "}
          <Link href="/signup" className="font-semibold text-accent">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
