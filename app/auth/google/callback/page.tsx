import type { Metadata } from "next";
import { Suspense } from "react";
import { GoogleCallbackStatus } from "@/components/auth/GoogleCallbackStatus";
import { text } from "@/lib/text";

export const metadata: Metadata = {
  title: text.auth.googleCallback.pageTitle,
  robots: { index: false, follow: false },
};

export default function GoogleCallbackPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center gap-6 px-4 py-16">
      <Suspense fallback={<p className="text-center text-neutral-600">{text.common.loading}</p>}>
        <GoogleCallbackStatus />
      </Suspense>
    </div>
  );
}
