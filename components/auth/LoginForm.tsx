"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/lib/redux/authApi";
import type { ApiErrorBody } from "@/lib/types";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { text } from "@/lib/text";
import { PAGE_ROUTES } from "@/lib/routes";

function errorMessage(err: unknown): string {
  if (err && typeof err === "object" && "data" in err) {
    const data = (err as { data?: ApiErrorBody }).data;
    if (data?.error?.code === "EMAIL_NOT_VERIFIED") {
      return text.auth.login.errors.emailNotVerified;
    }
    if (data?.error?.code === "INVALID_CREDENTIALS") {
      return text.auth.login.errors.invalidCredentials;
    }
    if (data?.error?.message) {
      return data.error.message;
    }
  }
  return text.common.networkError;
}

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading, error }] = useLoginMutation();
  const formErrorId = useId();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isLoading) return;
    const result = await login({ email, password });
    if (!("error" in result)) {
      router.push(PAGE_ROUTES.home);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4" aria-busy={isLoading}>
      {error && (
        <div id={formErrorId} role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">
          {errorMessage(error)}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="login-email" className="text-sm font-semibold">
          {text.auth.login.emailLabel}
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="min-h-11 rounded-md border border-neutral-300 px-3"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="login-password" className="text-sm font-semibold">
          {text.auth.login.passwordLabel}
        </label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="min-h-11 rounded-md border border-neutral-300 px-3"
        />
        <Link href={PAGE_ROUTES.forgotPassword} className="self-end text-sm text-blue-700">
          {text.auth.login.forgotPasswordLink}
        </Link>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="min-h-11 rounded-md bg-blue-700 font-semibold text-white disabled:opacity-60"
      >
        {isLoading ? text.auth.login.submitLoading : text.auth.login.submitLabel}
      </button>

      <div className="flex items-center gap-3 text-sm text-neutral-500">
        <span className="h-px flex-1 bg-neutral-200" aria-hidden="true" />
        {text.common.or}
        <span className="h-px flex-1 bg-neutral-200" aria-hidden="true" />
      </div>
      <GoogleSignInButton label={text.auth.login.googleLabel} />
    </form>
  );
}
