import { z } from "zod";

const envSchema = z.object({
  // Absolute in local dev (http://localhost:4000/api/v1 — same-site as the
  // frontend regardless of port, so the sameSite:"strict" refresh cookie
  // still works). Relative ("/api/v1") on Vercel/staging/prod, where
  // frontend-user and the backend live on different registrable domains —
  // next.config.ts's rewrites() proxies it back to BACKEND_ORIGIN so the
  // browser only ever talks to this app's own origin. See resolveApiBaseUrl
  // below for how server-side code (which has no implicit origin to
  // resolve a relative URL against) gets a real absolute URL out of this.
  NEXT_PUBLIC_API_URL: z
    .string()
    .min(1, "NEXT_PUBLIC_API_URL is required")
    .refine(
      (value) => value.startsWith("/") || z.url().safeParse(value).success,
      "NEXT_PUBLIC_API_URL must be an absolute URL or a path starting with '/'",
    ),
  /** Canonical origin for this app — required as `metadataBase` so relative canonical/OG URLs resolve to absolute ones (seo-guideline.md). */
  NEXT_PUBLIC_SITE_URL: z.url("NEXT_PUBLIC_SITE_URL must be a valid URL"),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  // Next.js only inlines `NEXT_PUBLIC_*` vars for statically-written
  // `process.env.NEXT_PUBLIC_X` expressions — passing `process.env` wholesale
  // (like backend/frontend-admin's env.ts do) silently resolves to undefined
  // at runtime, so every schema field must be listed here by hand. The
  // `satisfies` below is what makes that safe: adding a field to `envSchema`
  // without adding it here is now a compile error, not a silent runtime gap.
  const raw = {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  } satisfies Record<keyof Env, string | undefined>;

  const parsed = envSchema.safeParse(raw);

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid environment configuration:\n${issues}`);
  }

  return parsed.data;
}

export const env = loadEnv();

// Server-only absolute base URL for apiFetch (lib/api/client.ts) — Server
// Component fetches run in Node, which has no browser location to resolve a
// relative NEXT_PUBLIC_API_URL against (unlike the client-side RTK Query
// baseQuery in lib/redux/api.ts, which the browser resolves against the
// current page origin, hitting the Vercel rewrite proxy). Not read through
// envSchema above: BACKEND_ORIGIN deliberately has no `NEXT_PUBLIC_` prefix
// (server-only, never inlined into the client bundle) and this file's own
// loadEnv() comment explains why only NEXT_PUBLIC_ vars can go through a
// wholesale `process.env` schema.
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
