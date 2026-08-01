import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { text } from "@/lib/text";
import { PAGE_ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: text.auth.login.pageTitle,
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center gap-6 px-4 py-16">
      <h1 className="text-center text-xl font-semibold">{text.auth.login.heading}</h1>
      <LoginForm />
      <p className="text-center text-sm text-neutral-600">
        {text.auth.login.noAccount}{" "}
        <Link href={PAGE_ROUTES.register} className="font-medium text-blue-700">
          {text.auth.login.createAccountLink}
        </Link>
      </p>
    </div>
  );
}
