import type { Metadata } from "next";
import { Suspense } from "react";
import { VerifyEmailStatus } from "@/components/auth/VerifyEmailStatus";
import { text } from "@/lib/text";

export const metadata: Metadata = {
  title: text.auth.verifyEmail.pageTitle,
  robots: { index: false, follow: false },
};

export default function VerifyEmailPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center gap-6 px-4 py-16">
      <h1 className="text-center text-xl font-semibold">{text.auth.verifyEmail.heading}</h1>
      <Suspense fallback={<p className="text-center text-neutral-600">{text.common.loading}</p>}>
        <VerifyEmailStatus />
      </Suspense>
    </div>
  );
}
