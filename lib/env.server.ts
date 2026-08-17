import "server-only";
import { env } from "@/lib/env";

// Server-only absolute base URL for apiFetch (lib/api/client.ts) — Server
// Component fetches run in Node, which has no browser location to resolve a
// relative NEXT_PUBLIC_API_URL against (unlike the client-side RTK Query
// baseQuery in lib/redux/api.ts, which the browser resolves against the
// current page origin, hitting the Vercel rewrite proxy).
//
// Deliberately a separate file from lib/env.ts, not just a separate export
// in it: lib/env.ts's `env` export is imported by client code too (e.g.
// lib/redux/api.ts), so anything else living in that same file gets bundled
// into the client too, side effects and all — this crashed in production
// (2026-08-18) because the code below throws when BACKEND_ORIGIN is unset,
// and BACKEND_ORIGIN is deliberately never sent to the browser. The
// `server-only` import makes Next.js hard-fail the build if a client
// component ever imports this file again, instead of only failing at
// runtime in a user's browser.
function resolveApiServerBaseUrl(): string {
  if (!env.NEXT_PUBLIC_API_URL.startsWith("/")) return env.NEXT_PUBLIC_API_URL;

  const backendOrigin = process.env.BACKEND_ORIGIN;
  if (!backendOrigin) {
    throw new Error(
      "BACKEND_ORIGIN is required when NEXT_PUBLIC_API_URL is a relative path (see .env.example)",
    );
  }
  return new URL(env.NEXT_PUBLIC_API_URL, backendOrigin).toString().replace(/\/$/, "");
}

export const apiServerBaseUrl = resolveApiServerBaseUrl();
