"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { IconBell, IconChat } from "@/components/Icons";
import { fetchInbox } from "@/lib/api";
import { getOwnedListings } from "@/lib/ownership";

function IconLink({
  href,
  label,
  badge,
  children,
}: {
  href: string;
  label: string;
  badge: number;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={badge > 0 ? `${label}, ${badge} new` : label}
      className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted transition hover:bg-surface hover:text-foreground"
    >
      {children}
      {badge > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </Link>
  );
}

// Bell (booking alerts) + message box (client messages), side by side.
// Shown only to people who own a listing on this device. Polls every 30s.
export function NotificationBell() {
  const [bookings, setBookings] = useState(0);
  const [messages, setMessages] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const owned = getOwnedListings();
    if (owned.length === 0) return;
    setShow(true);
    let alive = true;
    const tick = () =>
      fetchInbox(owned)
        .then((r) => {
          if (!alive) return;
          setMessages(r.messages.filter((m) => !m.read && m.kind === "message").length);
          setBookings(r.messages.filter((m) => !m.read && m.kind === "booking").length);
        })
        .catch(() => {});
    tick();
    const t = setInterval(tick, 30000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  if (!show) return null;

  return (
    <div className="flex items-center gap-1.5">
      <IconLink href="/inbox" label="Booking alerts" badge={bookings}>
        <IconBell className="h-5 w-5" />
      </IconLink>
      <IconLink href="/inbox" label="Messages" badge={messages}>
        <IconChat className="h-5 w-5" />
      </IconLink>
    </div>
  );
}
