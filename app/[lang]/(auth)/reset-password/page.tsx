import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { getText } from "@/lib/text";
import { resolveLocale } from "@/lib/routes/locale";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const text = getText(resolveLocale(rawLang));
  return {
    title: text.auth.resetPassword.pageTitle,
    robots: { index: false, follow: false },
  };
}

export default async function ResetPasswordPage({ params }: Props) {
  const { lang: rawLang } = await params;
  const text = getText(resolveLocale(rawLang));

  return (
    <div className="min-h-full bg-bg text-text">
      <div className="mx-auto flex min-h-[80vh] w-full max-w-sm flex-col justify-center gap-6 px-4 py-16">
        <div className="rounded-[18px] border border-border bg-surface p-6 shadow-(--shadow-border)">
          <h1 className="font-display text-center text-xl font-semibold">{text.auth.resetPassword.heading}</h1>
          <div className="mt-6">
            <Suspense fallback={<p className="text-center text-text-muted">{text.common.loading}</p>}>
              <ResetPasswordForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
