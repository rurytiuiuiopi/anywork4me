import crypto from "crypto";

// Server-only Paystack client (mobile money + card). The merchant secret key
// lives in PAYSTACK_SECRET_KEY — set it in the host env, never in code/client.
// All functions throw "PAYMENTS_NOT_CONFIGURED" until the key is present, so the
// whole flow stays safely inert until you switch it on.

const SECRET = process.env.PAYSTACK_SECRET_KEY;
const BASE = "https://api.paystack.co";

export function paymentsConfigured(): boolean {
  return !!SECRET;
}

function key(): string {
  if (!SECRET) throw new Error("PAYMENTS_NOT_CONFIGURED");
  return SECRET;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function initTransaction(opts: {
  email: string;
  amount: number; // major units (e.g. 99 GHS)
  currency: string;
  callbackUrl: string;
  metadata: Record<string, unknown>;
}): Promise<{ authorizationUrl: string; reference: string }> {
  const res = await fetch(`${BASE}/transaction/initialize`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key()}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      email: opts.email,
      amount: Math.round(opts.amount * 100), // smallest unit (pesewas/kobo/cents)
      currency: opts.currency,
      callback_url: opts.callbackUrl,
      metadata: opts.metadata,
    }),
  });
  const json: any = await res.json();
  if (!res.ok || !json.status) throw new Error(json?.message || "Paystack init failed");
  return { authorizationUrl: json.data.authorization_url, reference: json.data.reference };
}

export async function verifyTransaction(
  reference: string,
): Promise<{ success: boolean; metadata: Record<string, any> }> {
  const res = await fetch(`${BASE}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${key()}` },
  });
  const json: any = await res.json();
  if (!res.ok || !json.status) throw new Error(json?.message || "Paystack verify failed");
  return { success: json.data?.status === "success", metadata: json.data?.metadata ?? {} };
}

/** Validate a Paystack webhook came from Paystack (HMAC-SHA512 of the raw body). */
export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  if (!SECRET || !signature) return false;
  const hash = crypto.createHmac("sha512", SECRET).update(rawBody).digest("hex");
  return hash === signature;
}
