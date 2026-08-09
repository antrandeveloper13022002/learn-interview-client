"use client";

import { usePathname } from "next/navigation";
import { getText } from "@/lib/text";
import { PAGE_ROUTES } from "@/lib/routes";
import { DEFAULT_LOCALE, isLocale, localizedPath } from "@/lib/routes/locale";

// `not-found.js` receives no `params` prop at all (Next.js convention —
// see node_modules/next/dist/docs/.../not-found.md: "you must fetch data
// on the client-side instead" for anything path-dependent), so this reads
// the locale segment back out of the URL client-side instead — already
// have `lang` from that, so `getText(lang)` directly rather than the
// `useLocale()`-based `useText()` hook (which would read the empty
// `useParams()` this route has).
export default function NotFound() {
  const pathname = usePathname();
  const segment = pathname.split("/")[1];
  const lang = isLocale(segment) ? segment : DEFAULT_LOCALE;
  const text = getText(lang);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-bg p-8 text-center text-text">
      <p className="font-mono text-sm text-text-muted">404</p>
      <h1 className="font-display text-2xl font-semibold">{text.common.notFoundTitle}</h1>
      <p className="text-text-muted">{text.common.notFoundBody}</p>
      {/* LocaleLink reads `lang` from useParams(), which is empty here since
          not-found has no route params of its own — build the href with the
          pathname-derived lang directly instead. */}
      <a
        href={localizedPath(lang, PAGE_ROUTES.home)}
        className="rounded-md bg-marker-500 px-4 py-2 font-semibold text-ink-950 hover:bg-marker-600"
      >
        {text.common.backToHomeLink}
      </a>
    </div>
  );
}
