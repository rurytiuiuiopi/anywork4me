"use client";

import { useEffect } from "react";
import { captureRef } from "@/lib/referral";

// Remembers an inviter's ?ref= code on first landing, app-wide.
export function RefCapture() {
  useEffect(() => {
    captureRef();
  }, []);
  return null;
}
