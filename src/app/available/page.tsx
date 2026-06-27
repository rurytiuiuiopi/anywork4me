"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { LocationControl } from "@/components/LocationControl";
import { deleteProvider, fetchProvider, registerProvider, updateProvider } from "@/lib/api";
import { CATEGORIES } from "@/lib/categories";
import { useLocation } from "@/lib/location/LocationProvider";
import { fileToBannerDataUrl } from "@/lib/image";
import { forgetListing, getEditToken, rememberListing } from "@/lib/ownership";
import type { PricingUnit } from "@/lib/types";

const UNITS: PricingUnit[] = ["hour", "day", "job", "session", "person", "km"];

export default function AvailablePage() {
  return (
    <Suspense>
      <AvailableForm />
    </Suspense>
  );
}

function AvailableForm() {
  const router = useRouter();
  const params = useSearchParams();
  const editId = params.get("edit") || "";
  const { ctx, location, usePreciseLocation } = useLocation();

  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [cats, setCats] = useState<string[]>([]);
  const [tagline, setTagline] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceUnit, setPriceUnit] = useState<PricingUnit>("hour");
  const [bannerUrl, setBannerUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!editId;
  const [editToken, setEditToken] = useState<string>();
  const [loadingEdit, setLoadingEdit] = useState(isEdit);
  const [notAllowed, setNotAllowed] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function onDelete() {
    if (!editToken) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    setError(null);
    try {
      await deleteProvider(editId, editToken);
      forgetListing(editId);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete listing");
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  useEffect(() => {
    if (!editId) return;
    const token = getEditToken(editId);
    if (!token) {
      setNotAllowed(true);
      setLoadingEdit(false);
      return;
    }
    setEditToken(token);
    let cancelled = false;
    fetchProvider(editId, ctx)
      .then((p) => {
        if (cancelled) return;
        if (!p) {
          setNotAllowed(true);
          setLoadingEdit(false);
          return;
        }
        setName(p.name);
        setBusiness(p.business ?? "");
        setCats(p.categories);
        setTagline(p.tagline ?? "");
        setBio(p.bio ?? "");
        setPhone(p.phone?.startsWith("+") ? p.phone.split(" ").slice(1).join(" ") : p.phone ?? "");
        setArea(p.location.area && p.location.area !== "Your area" ? p.location.area : "");
        setPriceFrom(p.pricing ? String(p.pricing.from) : "");
        if (p.pricing?.unit) setPriceUnit(p.pricing.unit);
        setBannerUrl(p.bannerUrl ?? "");
        setLoadingEdit(false);
      })
      .catch(() => {
        if (!cancelled) {
          setError("Couldn’t load your listing.");
          setLoadingEdit(false);
        }
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId]);

  const toggleCat = (id: string) =>
    setCats((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));

  async function onFlyer(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) {
      setError("Please choose an image under 25 MB.");
      e.target.value = "";
      return;
    }
    setError(null);
    setUploading(true);
    try {
      setBannerUrl(await fileToBannerDataUrl(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn’t process that image.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  const canSubmit = name.trim() && cats.length > 0 && !submitting;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    const values = {
      name: name.trim(),
      business: business.trim() || undefined,
      categories: cats,
      tagline: tagline.trim() || undefined,
      bio: bio.trim() || undefined,
      phone: phone.trim() || undefined,
      area: area.trim() || undefined,
      priceFrom: priceFrom ? Number(priceFrom) : undefined,
      priceUnit,
      bannerUrl: bannerUrl || undefined,
    };
    try {
      if (isEdit) {
        if (!editToken) throw new Error("You can only edit your own listing.");
        await updateProvider(editId, values, editToken, ctx);
        router.push(`/provider/${editId}`);
      } else {
        const provider = await registerProvider(values, ctx);
        rememberListing(provider.id, provider.editToken);
        router.push(`/provider/${provider.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  if (isEdit && notAllowed) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col items-center justify-center gap-4 px-6 text-center">
        <span className="text-4xl">🔒</span>
        <h1 className="text-2xl font-semibold">This isn’t your listing</h1>
        <p className="text-muted">
          You can only edit a listing from the same device you created it on.
        </p>
        <Link
          href={`/provider/${editId}`}
          className="brand-gradient rounded-2xl px-5 py-3 text-sm font-semibold text-accent-foreground"
        >
          View the listing
        </Link>
      </main>
    );
  }

  if (isEdit && loadingEdit) {
    return (
      <main className="mx-auto min-h-dvh w-full max-w-2xl px-5 py-10">
        <div className="fm-skeleton h-40 w-full rounded-3xl" />
        <div className="mt-6 space-y-4">
          <div className="fm-skeleton h-12 w-full rounded-2xl" />
          <div className="fm-skeleton h-12 w-full rounded-2xl" />
          <div className="fm-skeleton h-24 w-full rounded-2xl" />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-dvh w-full max-w-2xl px-5 pb-16">
      <header className="flex items-center justify-between gap-3 py-5">
        <Link
          href={isEdit ? `/provider/${editId}` : "/"}
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
          {isEdit ? "✏️" : "✋"}
        </span>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          {isEdit ? "Edit your listing" : "I’m Available"}
        </h1>
        <p className="mt-2 text-balance text-muted">
          {isEdit
            ? "Update your details below, then save your changes."
            : `Create your profile so people in ${location.city} can find and book you. Prices are shown in ${location.currency}.`}
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-8 space-y-6">
        <button
          type="button"
          onClick={usePreciseLocation}
          className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
            location.source === "gps"
              ? "border-green-300 bg-green-50 dark:border-green-900/50 dark:bg-green-950/40"
              : "border-border bg-surface-2 hover:border-accent/40"
          }`}
        >
          <span className="text-xl">📍</span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold">
              {location.source === "gps" ? "Exact location pinned ✓" : "Pin my exact location"}
            </span>
            <span className="block text-xs text-muted">
              {location.source === "gps"
                ? "Customers will see your true distance — that builds trust."
                : "So nearby customers see how far you really are (recommended)."}
            </span>
          </span>
        </button>

        <div>
          <FieldLabel label="Flyer / banner" hint="optional" />
          <label className="brand-gradient relative mt-1 flex aspect-[2/1] w-full cursor-pointer items-center justify-center overflow-hidden rounded-3xl text-accent-foreground shadow-sm transition active:scale-[0.99]">
            {bannerUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={bannerUrl} alt="Your flyer" className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-1 px-6 text-center">
                <span className="text-3xl">🖼️</span>
                <span className="text-sm font-semibold">
                  {uploading ? "Uploading…" : "Add your flyer"}
                </span>
                <span className="text-xs opacity-80">
                  A photo or poster shown as the banner on your profile
                </span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              disabled={uploading}
              onChange={onFlyer}
            />
          </label>
          {bannerUrl && (
            <button
              type="button"
              onClick={() => setBannerUrl("")}
              className="mt-2 text-xs font-medium text-muted underline underline-offset-2"
            >
              Remove flyer
            </button>
          )}
        </div>

        <Field label="Your name" required>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Yvonne Christie"
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
          <FieldLabel label="Your rate" hint="optional" />
          <div className="mt-2 flex items-stretch gap-2">
            <span className="flex shrink-0 items-center rounded-2xl border border-border bg-surface px-3.5 text-sm font-semibold text-muted">
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
              placeholder="e.g. 150"
              aria-label={`Rate in ${location.currency}`}
              className={`${inputCls} min-w-0 flex-1`}
            />
            <select
              value={priceUnit}
              onChange={(e) => setPriceUnit(e.target.value as PricingUnit)}
              aria-label="Rate unit"
              className={`${inputCls} w-28 shrink-0`}
            >
              {UNITS.map((u) => (
                <option key={u} value={u}>
                  per {u}
                </option>
              ))}
            </select>
          </div>
          <p className="mt-1.5 text-xs text-muted">
            Type your rate — e.g. <span className="font-medium">150 per hour</span>. Leave blank to
            discuss later.
          </p>
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
            {submitting
              ? isEdit
                ? "Saving…"
                : "Creating your profile…"
              : isEdit
                ? "Save changes"
                : "Go live & become searchable"}
          </button>
          {!isEdit && (
            <p className="mt-2 text-center text-xs text-muted">
              By continuing you agree to appear in nearby searches.
            </p>
          )}
        </div>

        {isEdit && (
          <div className="pt-5">
            <button
              type="button"
              onClick={onDelete}
              disabled={deleting}
              className="w-full rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition active:scale-[0.99] disabled:opacity-50 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
            >
              {deleting
                ? "Deleting…"
                : confirmDelete
                  ? "Tap again to permanently delete"
                  : "Delete this listing"}
            </button>
            {confirmDelete && !deleting && (
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="mt-2 w-full text-center text-xs text-muted underline underline-offset-2"
              >
                Cancel
              </button>
            )}
          </div>
        )}
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
