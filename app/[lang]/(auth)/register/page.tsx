import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { AuthTabs } from "@/components/auth/AuthTabs";
import { RedirectIfAuthenticated } from "@/components/auth/RedirectIfAuthenticated";
import { getText } from "@/lib/text";
import { resolveLocale } from "@/lib/routes/locale";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const text = getText(resolveLocale(rawLang));
  return {
    title: text.auth.register.pageTitle,
    robots: { index: false, follow: false },
  };
}

export default async function RegisterPage({ params }: Props) {
  const { lang: rawLang } = await params;
  const lang = resolveLocale(rawLang);
  const text = getText(lang);

  return (
    <div className="min-h-full bg-bg text-text">
      <RedirectIfAuthenticated />
      <div className="mx-auto flex min-h-[80vh] w-full max-w-sm flex-col justify-center px-4 py-16">
        <div className="overflow-hidden rounded-[18px] border border-border bg-surface shadow-(--shadow-border)">
          <AuthTabs active="register" lang={lang} />
          <div className="p-6">
            <h1 className="font-display text-xl font-semibold">{text.auth.register.heading}</h1>
            <p className="mt-1 text-sm text-text-muted">{text.auth.register.subtitle}</p>
            <div className="mt-6">
              <RegisterForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
