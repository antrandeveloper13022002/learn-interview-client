import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { text } from "@/lib/text";
import { PAGE_ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: text.auth.register.pageTitle,
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center gap-6 px-4 py-16">
      <h1 className="text-center text-xl font-semibold">{text.auth.register.heading}</h1>
      <RegisterForm />
      <p className="text-center text-sm text-neutral-600">
        {text.auth.register.haveAccount}{" "}
        <Link href={PAGE_ROUTES.login} className="font-medium text-blue-700">
          {text.auth.register.loginLink}
        </Link>
      </p>
    </div>
  );
}
