// i18n opened 2026-08-06 (docs/business/vision.md#phase-amendment--2026-08-06).
// Path-based locale routing per Next.js's documented App Router pattern —
// a client-side-only toggle would be an SEO regression on this SEO-critical
// app, see .claude/seo-guideline.md's 2026-08-06 update.
export const SUPPORTED_LOCALES = ["vi", "en"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

// VN-first default (docs/business/vision.md's Target Market section) — the
// proxy falls back to this when no locale cookie exists yet, never
// Accept-Language sniffing, so a first-time visitor always lands on
// Vietnamese regardless of browser language.
export const DEFAULT_LOCALE: Locale = "vi";

export const LOCALE_COOKIE_NAME = "locale";

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

/** Narrows a route's raw `params.lang` (typed `string` by Next's generated
 * route types, since they don't know about `RootLayout`'s own `notFound()`
 * guard) down to `Locale`. Every child page already renders behind that
 * guard, so the `DEFAULT_LOCALE` fallback here is unreachable at runtime —
 * this exists to satisfy the type system at the params boundary, not as a
 * real fallback path. */
export function resolveLocale(lang: string): Locale {
  return isLocale(lang) ? lang : DEFAULT_LOCALE;
}

/** Prefixes a `PAGE_ROUTES`-style relative path (e.g. "/questions", "/")
 * with the current locale segment. The one place every internal URL goes
 * through so a call site never hand-rolls the `/${lang}` prefix. */
export function localizedPath(lang: Locale, path: string): string {
  return path === "/" ? `/${lang}` : `/${lang}${path}`;
}
