"use client";

import { usePathname, useRouter } from "next/navigation";
import { Dropdown } from "@/components/ui/Dropdown";
import { SUPPORTED_LOCALES, LOCALE_COOKIE_NAME, type Locale } from "@/lib/routes/locale";
import { useLocale } from "@/lib/routes/useLocale";

const LOCALE_LABEL: Record<Locale, string> = { vi: "Tiếng Việt", en: "English" };

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/** US-49 (docs/business/user-story.md) — footer dropdown, session/
 * browser-only persistence (a cookie, no `User` schema field), swaps only
 * the `[lang]` URL segment so the visitor stays on the equivalent page. */
export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const lang = useLocale();

  function switchTo(next: Locale) {
    if (next === lang) return;
    document.cookie = `${LOCALE_COOKIE_NAME}=${next}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`;
    // The two external-callback pages (MoMo return, Google OAuth
    // callback) render this Footer too but live outside app/[lang]/ — no
    // `/${lang}` prefix to swap out. Falling back to the new locale's
    // homepage there instead of appending, which would build a path that
    // doesn't exist (e.g. /en/checkout/return).
    const hasPrefix = pathname === `/${lang}` || pathname.startsWith(`/${lang}/`);
    const rest = hasPrefix ? pathname.slice(`/${lang}`.length) : "";
    router.push(`/${next}${rest}`);
  }

  return (
    <div className="inline-flex items-center text-sm text-text-muted">
      <span className="sr-only">Ngôn ngữ / Language</span>
      <Dropdown
        value={lang}
        options={SUPPORTED_LOCALES.map((l) => ({ value: l, label: LOCALE_LABEL[l] }))}
        onChange={(next) => switchTo(next as Locale)}
        menuPlacement="top"
      />
    </div>
  );
}
