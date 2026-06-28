"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IconArrowRight, IconCamera, IconPlus, IconUser } from "@/components/Icons";
import { LocationControl } from "@/components/LocationControl";
import { CATEGORIES } from "@/lib/categories";
import { fileToBannerDataUrl } from "@/lib/image";
import { useLocation } from "@/lib/location/LocationProvider";
import {
  ACCOUNT_TYPES,
  type AccountType,
  type LocalProfile,
  getProfile,
  saveProfile,
} from "@/lib/profile";

const inputCls =
  "h-12 w-full rounded-2xl border border-border bg-surface-2 px-3.5 text-[15px] outline-none transition focus:border-accent";

export default function SignupPage() {
  const router = useRouter();
  const { location } = useLocation();

  const [existing, setExisting] = useState<LocalProfile | null | undefined>(undefined);
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [accountType, setAccountType] = useState<AccountType | "">("");
  const [bio, setBio] = useState("");
  const [category, setCategory] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setExisting(getProfile()), []);

  async function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      setPhotoUrl(await fileToBannerDataUrl(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn’t process that image.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !accountType) return;
    const profile: LocalProfile = {
      name: name.trim(),
      business: business.trim() || undefined,
      accountType,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      city: location.city,
      photoUrl: photoUrl || undefined,
      bio: bio.trim() || undefined,
      category: category || undefined,
      createdAt: new Date().toISOString(),
    };
    saveProfile(profile);
    router.push("/available");
  }

  // ── Returning visitor (profile already on this device) ──────────────────
  if (existing) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-5 py-10">
        <div className="rounded-4xl border border-border bg-background p-7 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-accent/10 text-accent">
            {existing.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={existing.photoUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <IconUser className="h-7 w-7" />
            )}
          </div>
          <h1 className="mt-4 text-2xl font-semibold">Welcome back, {existing.name.split(" ")[0]}</h1>
          <p className="mt-1 text-muted">You’re ready to post and connect.</p>
          <div className="mt-6 space-y-2">
            <Link
              href="/available"
              className="brand-gradient flex items-center justify-center gap-2 rounded-2xl py-3.5 font-semibold text-accent-foreground transition active:scale-[0.98]"
            >
              <IconPlus className="h-5 w-5" /> Add a listing
            </Link>
            <Link
              href="/search"
              className="flex items-center justify-center gap-2 rounded-2xl border border-border py-3.5 font-semibold transition hover:bg-surface"
            >
              Browse opportunities
            </Link>
          </div>
          <button
            type="button"
            onClick={() => setExisting(null)}
            className="mt-4 text-sm font-medium text-muted underline underline-offset-2"
          >
            Edit my profile
          </button>
        </div>
      </main>
    );
  }

  const canSubmit = !!name.trim() && !!accountType;

  return (
    <main className="mx-auto min-h-dvh w-full max-w-md px-5 pb-16">
      <header className="flex items-center justify-between gap-3 py-5">
        <Link
          href="/"
          aria-label="Back"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background shadow-sm transition hover:bg-surface active:scale-95"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
          </svg>
        </Link>
        <LocationControl compact />
      </header>

      <div className="pt-2">
        <h1 className="text-3xl font-semibold tracking-tight">Create your profile</h1>
        <p className="mt-2 text-muted">
          One quick step, then you can post a listing and people can find you.
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-7 space-y-6">
        {/* Photo */}
        <div className="flex items-center gap-4">
          <label className="relative flex h-20 w-20 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-accent/10 text-accent transition active:scale-95">
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoUrl} alt="Your photo" className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <IconCamera className="h-7 w-7" />
            )}
            <input type="file" accept="image/*" className="sr-only" disabled={uploading} onChange={onPhoto} />
          </label>
          <div className="text-sm text-muted">
            {uploading ? "Uploading…" : "Add a profile photo or logo"}
            <span className="block text-xs">Optional, but builds trust.</span>
          </div>
        </div>

        {/* Account type */}
        <div>
          <Label text="I am a…" required />
          <div className="mt-1 grid grid-cols-2 gap-2">
            {ACCOUNT_TYPES.map((t) => {
              const on = accountType === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setAccountType(t.id)}
                  aria-pressed={on}
                  className={`rounded-2xl border px-3 py-2.5 text-left transition active:scale-95 ${
                    on ? "border-accent bg-accent/10" : "border-border bg-surface-2 hover:border-accent/40"
                  }`}
                >
                  <span className="block text-sm font-semibold">{t.label}</span>
                  <span className="block text-xs text-muted">{t.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        <Field label="Full name" required>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Yvonne Christie" className={inputCls} required />
        </Field>

        <Field label="Business name" hint="optional">
          <input value={business} onChange={(e) => setBusiness(e.target.value)} placeholder="e.g. Pulse Sound" className={inputCls} />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Phone" hint="optional">
            <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" placeholder={`${location.city} number`} className={inputCls} />
          </Field>
          <Field label="Email" hint="optional">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              inputMode="email"
              autoCapitalize="none"
              autoCorrect="off"
              placeholder="you@email.com"
              className={inputCls}
            />
          </Field>
        </div>

        <Field label="What do you do?" hint="optional">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
            <option value="">Choose a category…</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Short bio" hint="optional">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            placeholder="A sentence about you or your business."
            className={`${inputCls} h-auto resize-none py-3`}
          />
        </Field>

        {error && (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="brand-gradient flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-base font-semibold text-accent-foreground transition active:scale-[0.99] disabled:opacity-40"
        >
          Create profile <IconArrowRight className="h-5 w-5" />
        </button>
        <p className="text-center text-xs text-muted">
          No passwords. Your profile is saved on this device so posting stays quick.
        </p>
      </form>
    </main>
  );
}

function Label({ text, required, hint }: { text: string; required?: boolean; hint?: string }) {
  return (
    <div className="mb-1 flex items-center gap-2">
      <span className="text-sm font-semibold">{text}</span>
      {required && <span className="text-accent">*</span>}
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <Label text={label} required={required} hint={hint} />
      {children}
    </label>
  );
}
