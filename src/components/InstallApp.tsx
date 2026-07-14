"use client";

import { useEffect, useState } from "react";

// A dismissible "Install app" prompt. On Android/Chrome it fires the real
// install (beforeinstallprompt); on iOS Safari it shows the Add-to-Home-Screen
// steps (iOS has no install API). Hidden if already installed or dismissed.
const KEY = "aw4m.install-dismissed";

type PromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallApp() {
  const [deferred, setDeferred] = useState<PromptEvent | null>(null);
  const [ios, setIos] = useState(false);
  const [iosHelp, setIosHelp] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const nav = window.navigator as Navigator & { standalone?: boolean };
    const installed =
      window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true;
    if (installed) return;
    try {
      if (localStorage.getItem(KEY) === "1") return;
    } catch {
      /* ignore */
    }

    const ua = nav.userAgent;
    const isIosDevice = /iPad|iPhone|iPod/.test(ua);
    const isSafari = /safari/i.test(ua) && !/crios|fxios|chrome|android/i.test(ua);
    if (isIosDevice && isSafari) {
      setIos(true);
      setShow(true);
    }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as PromptEvent);
      setShow(true);
    };
    const onInstalled = () => {
      setShow(false);
      try {
        localStorage.setItem(KEY, "1");
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    setShow(false);
  }

  async function install() {
    if (ios) {
      setIosHelp(true);
      return;
    }
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice.catch(() => undefined);
    setDeferred(null);
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40 w-[min(20rem,calc(100vw-2rem))]">
      <div className="rounded-3xl border border-border bg-background/95 p-4 shadow-lg backdrop-blur">
        <div className="flex items-start gap-3">
          <span className="brand-gradient flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl text-accent-foreground">
            📲
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold leading-tight">Install anywork4me</p>
            <p className="mt-0.5 text-sm text-muted">
              {iosHelp
                ? "Tap the Share button, then “Add to Home Screen”."
                : "One-tap access, right from your home screen."}
            </p>
            {!iosHelp && (
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={install}
                  className="brand-gradient rounded-xl px-4 py-2 text-sm font-semibold text-accent-foreground transition active:scale-95"
                >
                  Install
                </button>
                <button type="button" onClick={dismiss} className="px-2 py-2 text-sm text-muted">
                  Not now
                </button>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss"
            className="shrink-0 text-lg leading-none text-muted transition hover:text-foreground"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
