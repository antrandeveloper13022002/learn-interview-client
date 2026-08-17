import path from "node:path";
import type { NextConfig } from "next";

// Security follow-up (2026-08-11): standard response headers were missing
// entirely — no helmet-equivalent exists on the Next.js side the way
// backend/src/app.ts now has one. Deliberately not including
// Content-Security-Policy here: this app embeds JSON-LD `<script>` tags
// (lib/jsonLd.ts), Google OAuth navigations, and MoMo redirects — a
// correct CSP needs to enumerate all of that carefully, not be bolted on
// alongside an unrelated fix. Flagged, not silently skipped.
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
  // Deploy topology (2026-08-18): frontend-user (Vercel) and backend
  // (Railway) live on different registrable domains. The refresh-token
  // cookie is `sameSite: "strict"` (see .claude/security.md's CSRF
  // reasoning), which only survives same-site requests — so the browser
  // must always call this app's own origin, never the Railway origin
  // directly. This rewrite proxies that transparently server-side.
  // Requires `BACKEND_ORIGIN` (server-only env var, e.g.
  // https://xxx.up.railway.app) and `NEXT_PUBLIC_API_URL=/api/v1`
  // (relative, not absolute) in every non-local environment.
  async rewrites() {
    const backendOrigin = process.env.BACKEND_ORIGIN;
    if (!backendOrigin) return [];
    return [{ source: "/api/v1/:path*", destination: `${backendOrigin}/api/v1/:path*` }];
  },
};

export default nextConfig;
