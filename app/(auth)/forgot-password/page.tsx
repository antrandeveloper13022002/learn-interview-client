import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { text } from "@/lib/text";

export const metadata: Metadata = {
  title: text.auth.forgotPassword.pageTitle,
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center gap-6 px-4 py-16">
      <h1 className="text-center text-xl font-semibold">{text.auth.forgotPassword.heading}</h1>
      <ForgotPasswordForm />
    </div>
  );
}
