"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { IconBell, IconChat } from "@/components/Icons";
import { fetchInbox } from "@/lib/api";
import { getOwnedListings } from "@/lib/ownership";
import { hasProfile } from "@/lib/profile";
import { supportUnread } from "@/lib/support";

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

// Bell = unread booking alerts (listing owners only).
// Message box = unread client messages + unread support replies from Sarah
// (shown for any signed-in user, even before they post a listing).
export function NotificationBell() {
  const [bookings, setBookings] = useState(0);
  const [messages, setMessages] = useState(0);
  const [owns, setOwns] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const owned = getOwnedListings();
    const ownsListings = owned.length > 0;
    const profile = hasProfile();
    if (!ownsListings && !profile) return;
    setOwns(ownsListings);
    setShow(true);

    let alive = true;
    const tick = async () => {
      let listingMsgs = 0;
      let bookingUnread = 0;
      if (ownsListings) {
        try {
          const r = await fetchInbox(owned);
          listingMsgs = r.messages.filter(
            (m) => !m.read && m.kind === "message" && m.sender !== "owner",
          ).length;
          bookingUnread = r.messages.filter(
            (m) => !m.read && m.kind === "booking" && m.sender !== "owner",
          ).length;
        } catch {
          /* ignore */
        }
      }
      let support = 0;
      if (profile) {
        try {
          support = await supportUnread();
        } catch {
          /* ignore */
        }
      }
      if (!alive) return;
      setBookings(bookingUnread);
      setMessages(listingMsgs + support);
    };
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
      {owns && (
        <IconLink href="/inbox?tab=notifications" label="Notifications" badge={bookings}>
          <IconBell className="h-5 w-5" />
        </IconLink>
      )}
      <IconLink href="/inbox?tab=messages" label="Messages" badge={messages}>
        <IconChat className="h-5 w-5" />
      </IconLink>
    </div>
  );
}
