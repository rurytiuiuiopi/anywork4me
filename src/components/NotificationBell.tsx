"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { IconBell } from "@/components/Icons";
import { fetchInbox } from "@/lib/api";
import { getOwnedListings } from "@/lib/ownership";

// Shown only to people who own a listing on this device (i.e. providers).
// Polls the inbox for unread messages/bookings.
export function NotificationBell() {
  const [unread, setUnread] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const owned = getOwnedListings();
    if (owned.length === 0) return;
    setShow(true);
    let alive = true;
    const tick = () =>
      fetchInbox(owned)
        .then((r) => alive && setUnread(r.unread))
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
    <Link
      href="/inbox"
      aria-label={unread > 0 ? `Inbox, ${unread} unread` : "Inbox"}
      className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted transition hover:bg-surface hover:text-foreground"
    >
      <IconBell className="h-5 w-5" />
      {unread > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
          {unread > 9 ? "9+" : unread}
        </span>
      )}
    </Link>
  );
}
