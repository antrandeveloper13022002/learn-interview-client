import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.url("NEXT_PUBLIC_API_URL must be a valid URL"),
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
