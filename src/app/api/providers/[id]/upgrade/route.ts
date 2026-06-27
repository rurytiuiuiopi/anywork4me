import { NextResponse } from "next/server";
import { features } from "@/lib/config";
import { repository } from "@/lib/data";
import { initTransaction, paymentsConfigured, verifyTransaction } from "@/lib/paystack";
import { PRO_PLAN, proCharge } from "@/lib/pricing";
import { SITE_URL } from "@/lib/seo";

// POST: start a Pro payment → returns the Paystack checkout URL.
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!features.monetization.subscriptions || !paymentsConfigured()) {
    return NextResponse.json({ error: "Upgrades aren’t available yet." }, { status: 503 });
  }
  let body: { email?: string } | null = null;
  try {
    body = await req.json();
  } catch {
    body = null;
  }
  const email = (body?.email ?? "").trim();
  if (!/.+@.+\..+/.test(email)) {
    return NextResponse.json({ error: "A valid email is required for your receipt." }, { status: 400 });
  }
  const provider = await repository.getById(id, {}).catch(() => null);
  if (!provider) return NextResponse.json({ error: "Listing not found." }, { status: 404 });

  const { currency, amount } = proCharge(provider.pricing?.currency);
  try {
    const { authorizationUrl } = await initTransaction({
      email,
      amount,
      currency,
      callbackUrl: `${SITE_URL}/api/providers/${id}/upgrade`,
      metadata: { providerId: id, plan: "pro", days: PRO_PLAN.durationDays },
    });
    return NextResponse.json({ authorizationUrl });
  } catch {
    return NextResponse.json({ error: "Couldn’t start the payment. Please try again." }, { status: 502 });
  }
}

// GET: Paystack redirects here after checkout → verify, grant Pro, bounce to profile.
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference") || searchParams.get("trxref") || "";
  const back = (ok: boolean) =>
    NextResponse.redirect(`${SITE_URL}/provider/${id}?pro=${ok ? "1" : "0"}`);

  if (!reference || !paymentsConfigured()) return back(false);
  try {
    const { success, metadata } = await verifyTransaction(reference);
    if (!success) return back(false);
    const pid = (metadata?.providerId as string) || id;
    const days = Number(metadata?.days) || PRO_PLAN.durationDays;
    const until = new Date(Date.now() + days * 86_400_000).toISOString();
    await repository.setProUntil(pid, until);
    return back(true);
  } catch {
    return back(false);
  }
}
