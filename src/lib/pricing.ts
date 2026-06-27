// Pro plan: what a provider gets for paying, and what it costs per market.
// Kept tiny and country-agnostic — the price auto-picks the viewer's currency.

export const PRO_PLAN = {
  durationDays: 30,
  benefits: [
    "Verified badge — build trust and get booked more",
    "Top of search in your area and category",
    "Featured highlight on your profile",
    "Renew anytime — no lock-in",
  ],
} as const;

// Monthly Pro price, per currency (round, market-sensible numbers).
const PRICES: Record<string, number> = {
  GHS: 99,
  NGN: 5000,
  KES: 1000,
  ZAR: 99,
  USD: 8,
  EUR: 8,
  GBP: 7,
};

// Paystack settles these; anything else is charged in USD.
const PAYSTACK_CURRENCIES = new Set(["GHS", "NGN", "ZAR", "KES", "USD"]);

/** The amount + currency to actually charge for the given viewer currency. */
export function proCharge(currency: string | undefined): { currency: string; amount: number } {
  const cur = (currency || "USD").toUpperCase();
  if (PAYSTACK_CURRENCIES.has(cur)) return { currency: cur, amount: PRICES[cur] ?? PRICES.USD };
  return { currency: "USD", amount: PRICES.USD };
}
