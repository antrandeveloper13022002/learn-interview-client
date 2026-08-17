import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { env } from "@/lib/env";
import { getText } from "@/lib/text";
import { APP_NAME } from "@/lib/constants";
import { DEFAULT_LOCALE } from "@/lib/routes/locale";

const text = getText(DEFAULT_LOCALE);

// Second root layout (Next.js's "multiple root layouts" pattern) for the
// two routes that must stay unprefixed, outside app/[lang]/ — MoMo's
// return URL and Google's OAuth redirect URI are both fixed, externally
// configured values (see tasks/frontend-user.md FU-19). No `params.lang`
// exists here, so this always renders the VN-first default — consistent
// with GoogleCallbackStatus.tsx and CheckoutCallbackStatus.tsx already
// having no locale context to read from either.
export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: text.home.siteDescription,
};

export default function ExternalLayout({ children }: { children: React.ReactNode }) {
  return <AppShell lang={DEFAULT_LOCALE}>{children}</AppShell>;
}
