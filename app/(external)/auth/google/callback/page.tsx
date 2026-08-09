import type { Metadata } from "next";
import { Suspense } from "react";
import { GoogleCallbackStatus } from "@/components/auth/GoogleCallbackStatus";
import { getText } from "@/lib/text";
import { DEFAULT_LOCALE } from "@/lib/routes/locale";

const text = getText(DEFAULT_LOCALE);

export const metadata: Metadata = {
  title: text.auth.googleCallback.pageTitle,
  robots: { index: false, follow: false },
};

export default function GoogleCallbackPage() {
  return (
    <div className="min-h-full bg-bg text-text">
      <div className="mx-auto flex min-h-[80vh] w-full max-w-sm flex-col justify-center gap-6 px-4 py-16">
        <Suspense fallback={<p className="text-center text-text-muted">{text.common.loading}</p>}>
          <GoogleCallbackStatus />
        </Suspense>
      </div>
    </div>
  );
}
