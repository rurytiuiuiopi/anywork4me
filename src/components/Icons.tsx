// Flat, modern stroke icons (Feather-style). Single colour via currentColor so
// they inherit text colour — no emojis. Used across the new homepage + flows.
import type { ReactNode } from "react";

function Svg({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className ?? "h-6 w-6"}
      aria-hidden
    >
      {children}
    </svg>
  );
}

type P = { className?: string };

export const IconSearch = (p: P) => (
  <Svg className={p.className}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </Svg>
);
export const IconPin = (p: P) => (
  <Svg className={p.className}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </Svg>
);
export const IconBriefcase = (p: P) => (
  <Svg className={p.className}>
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
  </Svg>
);
export const IconWrench = (p: P) => (
  <Svg className={p.className}>
    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
  </Svg>
);
export const IconBag = (p: P) => (
  <Svg className={p.className}>
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 01-8 0" />
  </Svg>
);
export const IconUsers = (p: P) => (
  <Svg className={p.className}>
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </Svg>
);
export const IconTruck = (p: P) => (
  <Svg className={p.className}>
    <rect x="1" y="3" width="15" height="13" rx="1" />
    <path d="M16 8h4l3 3v5h-7z" />
    <circle cx="5.5" cy="18.5" r="2" />
    <circle cx="18.5" cy="18.5" r="2" />
  </Svg>
);
export const IconCalendar = (p: P) => (
  <Svg className={p.className}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </Svg>
);
export const IconGear = (p: P) => (
  <Svg className={p.className}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
  </Svg>
);
export const IconBuilding = (p: P) => (
  <Svg className={p.className}>
    <path d="M4 21V4a1 1 0 011-1h9a1 1 0 011 1v17M15 21V9h4a1 1 0 011 1v11M2 21h20M8 7h2M8 11h2M8 15h2" />
  </Svg>
);
export const IconCheck = (p: P) => (
  <Svg className={p.className}>
    <path d="M20 6L9 17l-5-5" />
  </Svg>
);
export const IconStar = (p: P) => (
  <Svg className={p.className}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </Svg>
);
export const IconShield = (p: P) => (
  <Svg className={p.className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </Svg>
);
export const IconArrowRight = (p: P) => (
  <Svg className={p.className}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
);
export const IconPlus = (p: P) => (
  <Svg className={p.className}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);
export const IconUser = (p: P) => (
  <Svg className={p.className}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21v-1a6 6 0 016-6h4a6 6 0 016 6v1" />
  </Svg>
);
export const IconCompass = (p: P) => (
  <Svg className={p.className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z" />
  </Svg>
);
export const IconCamera = (p: P) => (
  <Svg className={p.className}>
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
    <circle cx="12" cy="13" r="4" />
  </Svg>
);
export const IconChevron = (p: P) => (
  <Svg className={p.className}>
    <path d="M9 6l6 6-6 6" />
  </Svg>
);
export const IconLogout = (p: P) => (
  <Svg className={p.className}>
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <path d="M16 17l5-5-5-5M21 12H9" />
  </Svg>
);
export const IconHelp = (p: P) => (
  <Svg className={p.className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.1 9a3 3 0 015.8 1c0 2-3 3-3 3" />
    <path d="M12 17h.01" />
  </Svg>
);
export const IconBookmark = (p: P) => (
  <Svg className={p.className}>
    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
  </Svg>
);
export const IconBell = (p: P) => (
  <Svg className={p.className}>
    <path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 01-3.46 0" />
  </Svg>
);
export const IconChat = (p: P) => (
  <Svg className={p.className}>
    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
  </Svg>
);
