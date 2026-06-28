"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  IconBookmark,
  IconChevron,
  IconGear,
  IconHelp,
  IconLogout,
  IconPlus,
  IconUser,
} from "@/components/Icons";
import { accountTypeLabel, type LocalProfile } from "@/lib/profile";

function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function AccountMenu({
  profile,
  onSignOut,
}: {
  profile: LocalProfile;
  onSignOut: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const avatar = (size: string) =>
    profile.photoUrl ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={profile.photoUrl} alt="" className={`${size} rounded-full object-cover`} />
    ) : (
      <span
        className={`${size} flex items-center justify-center rounded-full bg-accent/15 text-xs font-semibold text-accent`}
      >
        {initials(profile.name)}
      </span>
    );

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Account menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full border border-border bg-background py-1 pl-1 pr-2 transition hover:bg-surface active:scale-95"
      >
        {avatar("h-7 w-7")}
        <span className="hidden max-w-[90px] truncate text-sm font-medium sm:block">
          {profile.name.split(" ")[0]}
        </span>
        <IconChevron className={`h-4 w-4 text-muted transition ${open ? "rotate-90" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-40 mt-2 w-64 overflow-hidden rounded-3xl border border-border bg-background p-2 shadow-lg">
          <Link
            href="/signup"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-2xl p-2.5 transition hover:bg-surface"
          >
            {avatar("h-10 w-10")}
            <span className="min-w-0 flex-1">
              <span className="block truncate font-semibold">{profile.name}</span>
              <span className="block truncate text-xs text-muted">
                {accountTypeLabel(profile.accountType)}
              </span>
            </span>
            <IconChevron className="h-4 w-4 text-muted" />
          </Link>

          <div className="my-2 border-t border-border" />

          <MenuLink href="/signup" Icon={IconUser} label="My profile" onClick={() => setOpen(false)} />
          <MenuLink href="/available" Icon={IconPlus} label="Post a listing" onClick={() => setOpen(false)} />
          <MenuLink href="/saved" Icon={IconBookmark} label="Saved" onClick={() => setOpen(false)} />
          <MenuLink href="/account" Icon={IconGear} label="Account & data" onClick={() => setOpen(false)} />

          <div className="my-2 border-t border-border" />

          <MenuLink
            href="mailto:support@anywork4me.com?subject=anywork4me%20help"
            Icon={IconHelp}
            label="Help"
            onClick={() => setOpen(false)}
          />
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onSignOut();
            }}
            className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
          >
            <IconLogout className="h-5 w-5" /> Log out
          </button>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  href,
  Icon,
  label,
  onClick,
}: {
  href: string;
  Icon: (p: { className?: string }) => React.ReactElement;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition hover:bg-surface"
    >
      <Icon className="h-5 w-5 text-muted" /> {label}
    </Link>
  );
}
