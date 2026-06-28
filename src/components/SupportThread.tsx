"use client";

import { useEffect, useState } from "react";
import { hasProfile } from "@/lib/profile";
import { ensureWelcome, sendSupportReply, syncSupport, type SupportMessage } from "@/lib/support";

// The user's support conversation with "Sarah from AnyWork4Me".
// Auto-creates the welcome message once, then works like a normal chat.
export function SupportThread() {
  const [messages, setMessages] = useState<SupportMessage[] | null>(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!hasProfile()) return;
    setShow(true);
    let alive = true;
    (async () => {
      await ensureWelcome();
      const r = await syncSupport();
      if (alive) setMessages(r.messages);
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (!show) return null;

  async function onSend(e: React.FormEvent) {
    e.preventDefault();
    const text = reply.trim();
    if (!text || sending) return;
    setSending(true);
    await sendSupportReply(text);
    setReply("");
    const r = await syncSupport();
    setMessages(r.messages);
    setSending(false);
  }

  return (
    <section className="rounded-3xl border border-border bg-background p-4">
      <div className="flex items-center gap-3 border-b border-border pb-3">
        <span className="brand-gradient flex h-10 w-10 items-center justify-center rounded-full font-bold text-accent-foreground">
          S
        </span>
        <div>
          <p className="font-semibold">Sarah from AnyWork4Me</p>
          <p className="text-xs text-muted">Support · usually replies fast</p>
        </div>
      </div>

      <div className="mt-3 space-y-3">
        {messages === null ? (
          <div className="fm-skeleton h-16 rounded-2xl" />
        ) : messages.length === 0 ? (
          <p className="text-sm text-muted">Say hello — we’re here to help.</p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${
                  m.sender === "user" ? "brand-gradient text-accent-foreground" : "bg-surface-2"
                }`}
              >
                {m.sender !== "user" && (
                  <p className="mb-0.5 text-xs font-semibold text-accent">Sarah</p>
                )}
                <p className="whitespace-pre-wrap leading-relaxed">{m.body}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={onSend} className="mt-3 flex items-center gap-2">
        <input
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Reply to Sarah…"
          className="h-11 min-w-0 flex-1 rounded-2xl border border-border bg-surface-2 px-3.5 text-sm outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={sending || !reply.trim()}
          className="brand-gradient shrink-0 rounded-2xl px-4 py-2.5 text-sm font-semibold text-accent-foreground transition active:scale-95 disabled:opacity-50"
        >
          {sending ? "…" : "Send"}
        </button>
      </form>
    </section>
  );
}
