"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LocationControl } from "@/components/LocationControl";
import { registerProvider } from "@/lib/api";
import { CATEGORIES } from "@/lib/categories";
import { useLocation } from "@/lib/location/LocationProvider";
import type { PricingUnit } from "@/lib/types";

const UNITS: PricingUnit[] = ["hour", "day", "job", "session", "person", "km"];

export default function AvailablePage() {
  const router = useRouter();
  const { ctx, location } = useLocation();

  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [cats, setCats] = useState<string[]>([]);
  const [tagline, setTagline] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceUnit, setPriceUnit] = useState<PricingUnit>("hour");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleCat = (id: string) =>
    setCats((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));

  const canSubmit = name.trim() && cats.length > 0 && !submitting;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const provider = await registerProvider(
        {
          name: name.trim(),
          business: business.trim() || undefined,
          categories: cats,
          tagline: tagline.trim() || undefined,
          bio: bio.trim() || undefined,
          phone: phone.trim() || undefined,
          area: area.trim() || undefined,
          priceFrom: priceFrom ? Number(priceFrom) : undefined,
          priceUnit,
        },
        ctx,
      );
      router.push(`/provider/${provider.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto min-h-dvh w-full max-w-2xl px-5 pb-16">
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
        <span className="brand-gradient inline-flex h-14 w-14 items-center justify-center rounded-2xl text-3xl text-accent-foreground shadow-sm">
          ✋
        </span>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">I’m Available</h1>
        <p className="mt-2 text-balance text-muted">
          Create your profile so people in {location.city} can find and book you. Prices
          are shown in {location.currency}.
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-8 space-y-6">
        <Field label="Your name" required>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Kojo Mensah"
            className={inputCls}
            required
          />
        </Field>

        <Field label="Business name" hint="optional">
          <input
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
            placeholder="e.g. Pulse Sound"
            className={inputCls}
          />
        </Field>

        <div>
          <FieldLabel label="What do you offer?" required />
          <p className="mb-3 text-sm text-muted">Pick all that apply.</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => {
              const on = cats.includes(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggleCat(c.id)}
                  aria-pressed={on}
                  className={`rounded-full border px-3.5 py-2 text-sm font-medium transition active:scale-95 ${
                    on
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border bg-surface-2 hover:border-accent/40"
                  }`}
                >
                  {c.emoji} {c.name}
                </button>
              );
            })}
          </div>
        </div>

        <Field label="Tagline" hint="optional">
          <input
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="e.g. Weddings, clubs & private parties"
            className={inputCls}
          />
        </Field>

        <Field label="About you" hint="optional">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            placeholder="Tell customers what makes you great."
            className={`${inputCls} h-auto resize-none py-3`}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Phone" hint="optional">
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputMode="tel"
              placeholder={`${location.city} number`}
              className={inputCls}
            />
          </Field>
          <Field label="Area" hint="optional">
            <input
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="e.g. Downtown"
              className={inputCls}
            />
          </Field>
        </div>

        <div>
          <FieldLabel label="Pricing" hint="optional" />
          <div className="mt-2 flex gap-3">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                {location.currency}
              </span>
              <input
                value={priceFrom}
                onChange={(e) => {
                  let v = e.target.value.replace(/[^\d.]/g, "");
                  const dot = v.indexOf(".");
                  if (dot !== -1) v = v.slice(0, dot + 1) + v.slice(dot + 1).replace(/\./g, "");
                  if (Number(v) > 100_000_000) v = "100000000";
                  setPriceFrom(v);
                }}
                inputMode="decimal"
                maxLength={12}
                placeholder="From"
                className={`${inputCls} pl-14`}
              />
            </div>
            <select
              value={priceUnit}
              onChange={(e) => setPriceUnit(e.target.value as PricingUnit)}
              className={`${inputCls} w-32`}
            >
              {UNITS.map((u) => (
                <option key={u} value={u}>
                  per {u}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </p>
        )}

        <div className="sticky bottom-0 -mx-5 border-t border-border bg-background/90 px-5 py-3 backdrop-blur-md">
          <button
            type="submit"
            disabled={!canSubmit}
            className="brand-gradient flex w-full items-center justify-center rounded-2xl text-base font-semibold text-accent-foreground transition active:scale-[0.99] disabled:opacity-40"
            style={{ height: "3.25rem" }}
          >
            {submitting ? "Creating your profile…" : "Go live & become searchable"}
          </button>
          <p className="mt-2 text-center text-xs text-muted">
            By continuing you agree to appear in nearby searches.
          </p>
        </div>
      </form>
    </main>
  );
}

const inputCls =
  "h-12 w-full rounded-2xl border border-border bg-surface-2 px-3.5 text-[15px] outline-none transition focus:border-accent";

function FieldLabel({
  label,
  required,
  hint,
}: {
  label: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div className="mb-1 flex items-center gap-2">
      <span className="text-sm font-semibold">{label}</span>
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
      <FieldLabel label={label} required={required} hint={hint} />
      {children}
    </label>
  );
}
