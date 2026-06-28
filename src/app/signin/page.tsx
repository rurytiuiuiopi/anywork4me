"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconArrowRight, IconUser } from "@/components/Icons";
import { signIn } from "@/lib/profile";

export default function SigninPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = signIn(email);
    if (result === "ok") {
      router.push("/");
    } else if (result === "no-account") {
      router.push(`/signup?email=${encodeURIComponent(email.trim())}`);
    } else {
      setError("We couldn’t find an account with that email on this device.");
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-5 py-10">
      <div className="rounded-4xl border border-border bg-background p-7 shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
          <IconUser className="h-7 w-7" />
        </div>
        <h1 className="mt-4 text-center text-2xl font-semibold">Sign in</h1>
        <p className="mt-1 text-center text-muted">Enter the email you signed up with.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            required
            placeholder="you@email.com"
            autoCapitalize="none"
            autoCorrect="off"
            className="h-12 w-full rounded-2xl border border-border bg-surface-2 px-3.5 text-[15px] outline-none transition focus:border-accent"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="brand-gradient flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 font-semibold text-accent-foreground transition active:scale-[0.99]"
          >
            Sign in <IconArrowRight className="h-5 w-5" />
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          New here?{" "}
          <Link href="/signup" className="font-semibold text-accent">
            Create a profile
          </Link>
        </p>
      </div>
    </main>
  );
}
