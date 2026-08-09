import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE_NAME } from "@/lib/routes/locale";

// i18n opened 2026-08-06 (docs/business/vision.md#phase-amendment--2026-08-06).
// `middleware.ts` was renamed to `proxy.ts` in Next.js 16 — see
// node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const segments = pathname.split("/");
  if (isLocale(segments[1])) return NextResponse.next();

  // VN-first default (vision.md's Target Market) — never Accept-Language
  // sniffing, only a locale the visitor explicitly chose via the footer
  // switcher (which sets this cookie) overrides Vietnamese.
  const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
  const locale = isLocale(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // Exclude: Next internals, static files, metadata files, and the two
    // fixed-URL external callback targets (VNPay return, Google OAuth
    // callback) that must stay unprefixed — see tasks/frontend-user.md
    // FU-19's note on why those can't move under [lang].
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api|checkout/return|auth/google/callback).*)",
  ],
};
