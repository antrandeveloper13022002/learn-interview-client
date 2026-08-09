import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { getText } from "@/lib/text";
import { resolveLocale } from "@/lib/routes/locale";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const text = getText(resolveLocale(rawLang));
  return {
    title: text.auth.forgotPassword.pageTitle,
    robots: { index: false, follow: false },
  };
}

export default async function ForgotPasswordPage({ params }: Props) {
  const { lang: rawLang } = await params;
  const text = getText(resolveLocale(rawLang));

  return (
    <div className="min-h-full bg-bg text-text">
      <div className="mx-auto flex min-h-[80vh] w-full max-w-sm flex-col justify-center gap-6 px-4 py-16">
        <div className="rounded-[18px] border border-border bg-surface p-6 shadow-(--shadow-border)">
          <h1 className="font-display text-center text-xl font-semibold">{text.auth.forgotPassword.heading}</h1>
          <div className="mt-6">
            <ForgotPasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}
