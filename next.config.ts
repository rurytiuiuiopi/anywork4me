import type { NextConfig } from "next";

// Baseline security headers applied to every response. (CSP is intentionally
// left for a careful, tested pass — it must allow-list Supabase, Vercel, fonts,
// and the inline JSON-LD/widgets before it can be enabled safely.)
const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" }, // clickjacking protection
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "geolocation=(self), camera=(), microphone=(), payment=()",
  },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
