"use client";

import { useRouter, useParams } from "next/navigation";
import { DEFAULT_LOCALE, isLocale, localizedPath, type Locale } from "./locale";

/** Current locale from the `[lang]` route segment. Falls back to the
 * VN-first default for any tree rendered outside `app/[lang]/...` (e.g.
 * the fixed-URL MoMo/Google OAuth callback pages, which deliberately stay
 * unprefixed — see tasks/frontend-user.md FU-19). */
export function useLocale(): Locale {
  const params = useParams<{ lang?: string }>();
  return isLocale(params.lang) ? params.lang : DEFAULT_LOCALE;
}

/** `useRouter()` with `push`/`replace` targets auto-prefixed by the current
 * locale, for the few call sites that navigate to a `PAGE_ROUTES` path
 * directly (not through an already-localized `basePath` prop). */
export function useLocalizedRouter() {
  const router = useRouter();
  const lang = useLocale();
  return {
    push: (path: string) => router.push(localizedPath(lang, path)),
    replace: (path: string) => router.replace(localizedPath(lang, path)),
  };
}
