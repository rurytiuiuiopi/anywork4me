"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { IconCheck } from "@/components/Icons";
import { sendMessage } from "@/lib/api";
import { markChatStarted } from "@/lib/ownership";
import { getProfile } from "@/lib/profile";

export function MessageSheet({
  providerId,
  providerName,
  open,
  onClose,
}: {
  providerId: string;
  providerName: string;
  open: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const p = getProfile();
    setName(p?.name ?? "");
    setContact(p?.email ?? p?.phone ?? "");
    setBody("");
    setDone(false);
    setError(null);
    setBusy(false);
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !body.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await sendMessage(providerId, {
        senderName: name.trim(),
        senderContact: contact.trim() || undefined,
        body: body.trim(),
      });
      markChatStarted(); // give this device its own Messages inbox to read replies
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn’t send your message.");
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" />
      <div className="fm-fade-up relative z-10 w-full rounded-t-4xl border border-border bg-background p-6 shadow-lg sm:max-w-md sm:rounded-4xl">
        {done ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <span className="brand-gradient flex h-14 w-14 items-center justify-center rounded-full text-accent-foreground">
              <IconCheck className="h-7 w-7" />
            </span>
            <h2 className="text-xl font-semibold">Message sent</h2>
            <p className="max-w-xs text-balance text-sm text-muted">
              {providerName} will see it in their inbox. Their reply lands in your{" "}
              <span className="font-medium text-foreground">Messages</span> — tap the 💬 icon any time.
            </p>
            <div className="mt-2 flex gap-3">
              <Link
                href="/inbox?tab=messages"
                onClick={onClose}
                className="flex h-11 items-center rounded-2xl border border-border px-5 font-semibold transition hover:bg-surface"
              >
                View messages
              </Link>
              <button
                onClick={onClose}
                className="brand-gradient h-11 rounded-2xl px-6 font-semibold text-accent-foreground"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit}>
            <h2 className="text-xl font-semibold">Message {providerName}</h2>
            <p className="mt-1 text-sm text-muted">Ask a question or describe what you need.</p>

            <label className="mt-5 block">
              <span className="mb-1 block text-sm font-medium">Your name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Ama"
                className="h-12 w-full rounded-2xl border border-border bg-surface-2 px-3.5 outline-none focus:border-accent"
              />
            </label>

            <label className="mt-3 block">
              <span className="mb-1 block text-sm font-medium">
                Phone or email <span className="text-muted">(so they can reply)</span>
              </span>
              <input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                autoCapitalize="none"
                placeholder="e.g. 024… or you@email.com"
                className="h-12 w-full rounded-2xl border border-border bg-surface-2 px-3.5 outline-none focus:border-accent"
              />
            </label>

            <label className="mt-3 block">
              <span className="mb-1 block text-sm font-medium">Message</span>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={4}
                required
                placeholder="Hi, are you available this weekend?"
                className="w-full resize-none rounded-2xl border border-border bg-surface-2 px-3.5 py-2.5 outline-none focus:border-accent"
              />
            </label>

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

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
                disabled={busy || !name.trim() || !body.trim()}
                className="brand-gradient h-12 flex-1 rounded-2xl font-semibold text-accent-foreground transition active:scale-[0.98] disabled:opacity-50"
              >
                {busy ? "Sending…" : "Send message"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
