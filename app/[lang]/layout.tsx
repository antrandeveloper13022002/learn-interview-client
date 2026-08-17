import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { env } from "@/lib/env";
import { getText } from "@/lib/text";
import { APP_NAME } from "@/lib/constants";
import { SUPPORTED_LOCALES, isLocale, resolveLocale } from "@/lib/routes/locale";

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const text = getText(resolveLocale(rawLang));
  return {
    metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
    title: {
      default: APP_NAME,
      template: `%s | ${APP_NAME}`,
    },
    description: text.home.siteDescription,
  };
}

export default async function RootLayout({ children, params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return <AppShell lang={lang}>{children}</AppShell>;
}
