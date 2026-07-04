import { NextResponse } from "next/server";
import { features } from "@/lib/config";
import { repository } from "@/lib/data";
import { initTransaction, paymentsConfigured, verifyTransaction } from "@/lib/paystack";
import { DEFAULT_COUNTRY, getCountry } from "@/lib/location/countries";
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

  // Charge in the provider's own country currency so the price matches what the
  // rest of the app quotes (display and charge share one source of truth).
  const country = getCountry(provider.location.country) ?? DEFAULT_COUNTRY;
  const { currency, amount } = proCharge(country.currency);
  try {
    const { authorizationUrl } = await initTransaction({
      email,
      amount,
      currency,
      callbackUrl: `${SITE_URL}/api/providers/${id}/upgrade`,
      metadata: {
        providerId: id,
        plan: "pro",
        days: PRO_PLAN.durationDays,
        amt: Math.round(amount * 100), // expected charge (smallest unit) — verified on grant
        cur: currency,
      },
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
    const { success, amount, currency, metadata } = await verifyTransaction(reference);
    if (!success) return back(false);
    // Only grant Pro if what was actually paid matches what we asked for.
    const expected = Number(metadata?.amt);
    if (Number.isFinite(expected) && (amount !== expected || currency !== String(metadata?.cur || ""))) {
      return back(false);
    }
    const until = new Date(Date.now() + PRO_PLAN.durationDays * 86_400_000).toISOString();
    await repository.setProUntil(id, until);
    return back(true);
  } catch {
    return back(false);
  }
}
