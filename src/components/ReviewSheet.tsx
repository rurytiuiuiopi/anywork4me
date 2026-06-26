"use client";

import { useEffect, useState } from "react";
import { submitReview } from "@/lib/api";
import { useLocation } from "@/lib/location/LocationProvider";
import type { Review } from "@/lib/types";

export function ReviewSheet({
  providerId,
  providerName,
  open,
  onClose,
  onSubmitted,
}: {
  providerId: string;
  providerName: string;
  open: boolean;
  onClose: () => void;
  onSubmitted: (review: Review) => void;
}) {
  const { ctx } = useLocation();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [author, setAuthor] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setRating(0);
    setHover(0);
    setAuthor("");
    setComment("");
    setError(null);
    setSubmitting(false);
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const canSubmit = rating >= 1 && author.trim() && !submitting;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const review = await submitReview(
        providerId,
        { author: author.trim(), rating, comment: comment.trim() },
        ctx,
      );
      onSubmitted(review);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" />
      <form
        onSubmit={onSubmit}
        className="fm-fade-up relative z-10 w-full rounded-t-4xl border border-border bg-background p-6 shadow-lg sm:max-w-md sm:rounded-4xl"
      >
        <h2 className="text-xl font-semibold">Rate {providerName}</h2>
        <p className="mt-1 text-sm text-muted">Share your experience to help others.</p>

        <div className="mt-5 flex justify-center gap-2" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              className={`text-4xl transition active:scale-90 ${
                n <= (hover || rating) ? "text-amber-400" : "text-border"
              }`}
            >
              ★
            </button>
          ))}
        </div>

        <label className="mt-5 block">
          <span className="mb-1 block text-sm font-medium">Your name</span>
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="e.g. Ama"
            required
            className="h-12 w-full rounded-2xl border border-border bg-surface-2 px-3.5 outline-none focus:border-accent"
          />
        </label>

        <label className="mt-3 block">
          <span className="mb-1 block text-sm font-medium">Review (optional)</span>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="What was it like?"
            className="w-full resize-none rounded-2xl border border-border bg-surface-2 px-3.5 py-2.5 outline-none focus:border-accent"
          />
        </label>

        {error && (
          <p className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </p>
        )}

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-12 flex-1 rounded-2xl border border-border font-semibold transition hover:bg-surface"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className="brand-gradient h-12 flex-1 rounded-2xl font-semibold text-accent-foreground transition active:scale-[0.98] disabled:opacity-40"
          >
            {submitting ? "Posting…" : "Post review"}
          </button>
        </div>
      </form>
    </div>
  );
}
