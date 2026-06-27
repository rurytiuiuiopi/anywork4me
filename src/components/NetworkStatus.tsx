"use client";

import { useEffect, useState } from "react";

// A calm, global signal that the network dropped — essential where data is
// patchy. The app keeps showing whatever's cached; this just sets expectations
// and reassures when the connection returns.
export function NetworkStatus() {
  const [offline, setOffline] = useState(false);
  const [reconnected, setReconnected] = useState(false);

  useEffect(() => {
    const goOffline = () => setOffline(true);
    const goOnline = () => {
      setOffline(false);
      setReconnected(true);
      window.setTimeout(() => setReconnected(false), 2500);
    };
    if (typeof navigator !== "undefined" && !navigator.onLine) setOffline(true);
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  if (!offline && !reconnected) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-x-0 top-0 z-[60] flex items-center justify-center gap-2 px-4 py-2 text-center text-sm font-medium text-white transition-transform ${
        offline ? "bg-zinc-800" : "bg-green-600"
      }`}
    >
      {offline
        ? "You’re offline — showing what we have. We’ll refresh when you’re back."
        : "✓ Back online"}
    </div>
  );
}
