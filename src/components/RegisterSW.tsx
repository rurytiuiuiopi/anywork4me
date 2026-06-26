"use client";

import { useEffect } from "react";

// Registers the service worker so the app is installable (Add to Home Screen)
// and works offline as a shell.
export function RegisterSW() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* registration is best-effort */
      });
    }
  }, []);
  return null;
}
