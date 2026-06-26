import type { GeoPoint } from "../types";

// A starter registry. The platform is country-agnostic — adding a country is
// just another entry here (or a row in the future `countries` table). Nothing
// in the UI hardcodes any single nation.

export interface CountryInfo {
  code: string; // ISO 3166-1 alpha-2
  name: string;
  flag: string;
  currency: string; // ISO 4217
  locale: string; // BCP-47
  dialCode: string;
  capital: string;
  point: GeoPoint; // sensible default centre
}

export const COUNTRIES: CountryInfo[] = [
  { code: "GH", name: "Ghana", flag: "🇬🇭", currency: "GHS", locale: "en-GH", dialCode: "+233", capital: "Accra", point: { lat: 5.6037, lng: -0.187 } },
  { code: "NG", name: "Nigeria", flag: "🇳🇬", currency: "NGN", locale: "en-NG", dialCode: "+234", capital: "Lagos", point: { lat: 6.5244, lng: 3.3792 } },
  { code: "KE", name: "Kenya", flag: "🇰🇪", currency: "KES", locale: "en-KE", dialCode: "+254", capital: "Nairobi", point: { lat: -1.2921, lng: 36.8219 } },
  { code: "ZA", name: "South Africa", flag: "🇿🇦", currency: "ZAR", locale: "en-ZA", dialCode: "+27", capital: "Johannesburg", point: { lat: -26.2041, lng: 28.0473 } },
  { code: "US", name: "United States", flag: "🇺🇸", currency: "USD", locale: "en-US", dialCode: "+1", capital: "New York", point: { lat: 40.7128, lng: -74.006 } },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", currency: "GBP", locale: "en-GB", dialCode: "+44", capital: "London", point: { lat: 51.5074, lng: -0.1278 } },
  { code: "CA", name: "Canada", flag: "🇨🇦", currency: "CAD", locale: "en-CA", dialCode: "+1", capital: "Toronto", point: { lat: 43.6532, lng: -79.3832 } },
  { code: "IN", name: "India", flag: "🇮🇳", currency: "INR", locale: "en-IN", dialCode: "+91", capital: "Mumbai", point: { lat: 19.076, lng: 72.8777 } },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪", currency: "AED", locale: "en-AE", dialCode: "+971", capital: "Dubai", point: { lat: 25.2048, lng: 55.2708 } },
  { code: "DE", name: "Germany", flag: "🇩🇪", currency: "EUR", locale: "de-DE", dialCode: "+49", capital: "Berlin", point: { lat: 52.52, lng: 13.405 } },
  { code: "FR", name: "France", flag: "🇫🇷", currency: "EUR", locale: "fr-FR", dialCode: "+33", capital: "Paris", point: { lat: 48.8566, lng: 2.3522 } },
  { code: "BR", name: "Brazil", flag: "🇧🇷", currency: "BRL", locale: "pt-BR", dialCode: "+55", capital: "São Paulo", point: { lat: -23.5505, lng: -46.6333 } },
  { code: "AU", name: "Australia", flag: "🇦🇺", currency: "AUD", locale: "en-AU", dialCode: "+61", capital: "Sydney", point: { lat: -33.8688, lng: 151.2093 } },
  { code: "EG", name: "Egypt", flag: "🇪🇬", currency: "EGP", locale: "ar-EG", dialCode: "+20", capital: "Cairo", point: { lat: 30.0444, lng: 31.2357 } },
  { code: "PH", name: "Philippines", flag: "🇵🇭", currency: "PHP", locale: "en-PH", dialCode: "+63", capital: "Manila", point: { lat: 14.5995, lng: 120.9842 } },
  { code: "JP", name: "Japan", flag: "🇯🇵", currency: "JPY", locale: "ja-JP", dialCode: "+81", capital: "Tokyo", point: { lat: 35.6762, lng: 139.6503 } },
];

export const DEFAULT_COUNTRY = COUNTRIES[0]; // Ghana — but only as a last-resort fallback.

const BY_CODE = new Map(COUNTRIES.map((c) => [c.code, c]));
export const getCountry = (code?: string): CountryInfo | undefined =>
  code ? BY_CODE.get(code.toUpperCase()) : undefined;

// Map common IANA timezones → country code. Used to infer place fully offline
// (no geolocation prompt, no external API) with reasonable accuracy.
export const TIMEZONE_COUNTRY: Record<string, string> = {
  "Africa/Accra": "GH",
  "Africa/Lagos": "NG",
  "Africa/Nairobi": "KE",
  "Africa/Johannesburg": "ZA",
  "Africa/Cairo": "EG",
  "America/New_York": "US",
  "America/Chicago": "US",
  "America/Denver": "US",
  "America/Los_Angeles": "US",
  "America/Toronto": "CA",
  "America/Sao_Paulo": "BR",
  "Europe/London": "GB",
  "Europe/Berlin": "DE",
  "Europe/Paris": "FR",
  "Asia/Kolkata": "IN",
  "Asia/Dubai": "AE",
  "Asia/Manila": "PH",
  "Asia/Tokyo": "JP",
  "Australia/Sydney": "AU",
};

/** "America/New_York" → "New York". A clean city label from any IANA zone. */
export function cityFromTimezone(tz: string): string {
  const last = tz.split("/").pop() ?? tz;
  return last.replace(/_/g, " ");
}
