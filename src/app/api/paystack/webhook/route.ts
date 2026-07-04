import { NextResponse } from "next/server";
import { repository } from "@/lib/data";
import { verifyWebhookSignature } from "@/lib/paystack";
import { PRO_PLAN } from "@/lib/pricing";

// Reliable backstop: even if the user closes the tab before the redirect,
// Paystack's webhook still grants Pro. Always 200 (except bad signature) so
// Paystack doesn't retry forever.
export async function POST(req: Request) {
  const raw = await req.text();
  const signature = req.headers.get("x-paystack-signature");
  if (!verifyWebhookSignature(raw, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: {
    event?: string;
    data?: { amount?: number; currency?: string; metadata?: Record<string, unknown> };
  } | null = null;
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: true });
  }

  if (event?.event === "charge.success") {
    const data = event.data ?? {};
    const meta = data.metadata ?? {};
    const pid = typeof meta.providerId === "string" ? meta.providerId : undefined;
    // Only grant Pro if what was paid matches what we asked for at init.
    const expected = Number(meta.amt);
    const amountOk =
      !Number.isFinite(expected) ||
      (Number(data.amount) === expected && String(data.currency ?? "") === String(meta.cur ?? ""));
    if (pid && amountOk) {
      const until = new Date(Date.now() + PRO_PLAN.durationDays * 86_400_000).toISOString();
      try {
        await repository.setProUntil(pid, until);
      } catch {
        // best-effort; the return-redirect verify path also grants Pro.
      }
    }
  }
  return NextResponse.json({ ok: true });
}
