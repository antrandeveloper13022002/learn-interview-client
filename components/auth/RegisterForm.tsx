"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { useRegisterMutation } from "@/lib/redux/authApi";
import type { ApiErrorBody } from "@/lib/types";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { text } from "@/lib/text";
import { AUTH_PASSWORD_MIN_LENGTH } from "@/lib/constants";
import { PAGE_ROUTES } from "@/lib/routes";

function errorMessage(err: unknown): { code: string | null; message: string } {
  if (err && typeof err === "object" && "data" in err) {
    const data = (err as { data?: ApiErrorBody }).data;
    if (data?.error) {
      return { code: data.error.code, message: data.error.message };
    }
  }
  return { code: null, message: text.common.networkError };
}

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [register, { isLoading, isSuccess, error }] = useRegisterMutation();

  const emailErrorId = useId();
  const passwordHintId = useId();
  const formErrorId = useId();

  const parsed = error ? errorMessage(error) : null;
  const isEmailTaken = parsed?.code === "EMAIL_ALREADY_REGISTERED";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isLoading) return;
    await register({ email, password });
  }

  if (isSuccess) {
    return (
      <div role="status" className="rounded-lg border border-neutral-200 bg-white p-6 text-center">
        <p className="font-semibold">{text.auth.register.success.title}</p>
        <p className="mt-2 text-sm text-neutral-600">
          {text.auth.register.success.bodyBeforeEmail}
          <strong>{email}</strong>
          {text.auth.register.success.bodyAfterEmail}
        </p>
        <Link href={PAGE_ROUTES.login} className="mt-4 inline-block text-sm font-medium text-blue-700">
          {text.common.goToLoginLink}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4" aria-busy={isLoading}>
      {parsed && !isEmailTaken && (
        <div id={formErrorId} role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">
          {parsed.message}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="register-email" className="text-sm font-semibold">
          {text.auth.register.emailLabel}
        </label>
        <input
          id="register-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={isEmailTaken || undefined}
          aria-describedby={isEmailTaken ? emailErrorId : undefined}
          className="min-h-11 rounded-md border border-neutral-300 px-3 aria-invalid:border-red-600"
        />
        {isEmailTaken && (
          <p id={emailErrorId} className="text-sm text-red-700">
            {text.auth.register.emailTakenPrefix}{" "}
            <Link href={PAGE_ROUTES.login} className="font-medium underline">
              {text.auth.register.emailTakenLoginLink}
            </Link>{" "}
            {text.auth.register.emailTakenSuffix}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="register-password" className="text-sm font-semibold">
          {text.auth.register.passwordLabel}
        </label>
        <input
          id="register-password"
          type="password"
          autoComplete="new-password"
          required
          minLength={AUTH_PASSWORD_MIN_LENGTH}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-describedby={passwordHintId}
          className="min-h-11 rounded-md border border-neutral-300 px-3"
        />
        <span id={passwordHintId} className="text-sm text-neutral-500">
          {text.common.passwordHint(AUTH_PASSWORD_MIN_LENGTH)}
        </span>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="min-h-11 rounded-md bg-blue-700 font-semibold text-white disabled:opacity-60"
      >
        {isLoading ? text.auth.register.submitLoading : text.auth.register.submitLabel}
      </button>

      <div className="flex items-center gap-3 text-sm text-neutral-500">
        <span className="h-px flex-1 bg-neutral-200" aria-hidden="true" />
        {text.common.or}
        <span className="h-px flex-1 bg-neutral-200" aria-hidden="true" />
      </div>
      <GoogleSignInButton label={text.auth.register.googleLabel} />
    </form>
  );
}
