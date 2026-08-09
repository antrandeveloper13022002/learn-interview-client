import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { PAGE_ROUTES } from "@/lib/routes";
import { SUPPORTED_LOCALES, localizedPath } from "@/lib/routes/locale";

// Second layer on top of each auth/personal page's own `robots: { index:
// false }` metadata (seo-guideline.md) — robots.txt only requests crawlers
// not fetch these URLs at all, it doesn't by itself stop indexing of a URL
// discovered another way, so both layers are applied together rather than
// either alone. /subscribe is deliberately NOT listed here — see its own
// page.tsx comment for why it stays indexable.
//
// i18n opened 2026-08-06 (see tasks/frontend-user.md FU-19): most disallow
// paths now need both locale-prefixed variants. `checkoutReturn` and
// `googleCallback` are the two fixed-URL external callback targets that
// deliberately stay unprefixed (never moved under `[lang]`), so they're
// listed once, unprefixed, same as before.
const LOCALE_SCOPED_DISALLOW_PATHS = [
  PAGE_ROUTES.login,
  PAGE_ROUTES.register,
  PAGE_ROUTES.forgotPassword,
  PAGE_ROUTES.resetPassword,
  PAGE_ROUTES.verifyEmail,
  PAGE_ROUTES.bookmarks,
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        ...SUPPORTED_LOCALES.flatMap((lang) => LOCALE_SCOPED_DISALLOW_PATHS.map((path) => localizedPath(lang, path))),
        PAGE_ROUTES.googleCallback,
        PAGE_ROUTES.checkoutReturn,
      ],
    },
    sitemap: `${env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  };
}
