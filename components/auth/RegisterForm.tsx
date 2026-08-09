"use client";

import { useId, useState } from "react";
import { Link } from "@/components/i18n/LocaleLink";
import { useRegisterMutation } from "@/lib/redux/authApi";
import type { ApiErrorBody } from "@/lib/types";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { useText } from "@/lib/text/useText";
import type { TextDictionary } from "@/lib/text";
import { AUTH_PASSWORD_MIN_LENGTH } from "@/lib/constants";
import { PAGE_ROUTES } from "@/lib/routes";

function errorMessage(err: unknown, text: TextDictionary): { code: string | null; message: string } {
  if (err && typeof err === "object" && "data" in err) {
    const data = (err as { data?: ApiErrorBody }).data;
    if (data?.error?.code === "VALIDATION_ERROR") {
      return { code: data.error.code, message: text.auth.register.errors.validationError };
    }
    if (data?.error) {
      return { code: data.error.code, message: data.error.message };
    }
  }
  return { code: null, message: text.common.networkError };
}

export function RegisterForm() {
  const text = useText();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [register, { isLoading, isSuccess, error }] = useRegisterMutation();

  const emailErrorId = useId();
  const passwordHintId = useId();
  const formErrorId = useId();

  const parsed = error ? errorMessage(error, text) : null;
  const isEmailTaken = parsed?.code === "EMAIL_ALREADY_REGISTERED";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isLoading) return;
    await register({ email, password });
  }

  if (isSuccess) {
    return (
      <div role="status" className="rounded-lg border border-border bg-bg p-6 text-center">
        <p className="font-semibold text-text">{text.auth.register.success.title}</p>
        <p className="mt-2 text-sm text-text-muted">
          {text.auth.register.success.bodyBeforeEmail}
          <strong>{email}</strong>
          {text.auth.register.success.bodyAfterEmail}
        </p>
        <Link href={PAGE_ROUTES.login} className="mt-4 inline-block text-sm font-medium text-marker-700">
          {text.common.goToLoginLink}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" aria-busy={isLoading}>
      {parsed && !isEmailTaken && (
        <div id={formErrorId} role="alert" className="rounded-md bg-flag-bg px-4 py-3 text-sm text-flag-text">
          {parsed.message}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="register-email" className="text-sm font-semibold text-text">
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
          className="min-h-11 rounded-md border border-border bg-surface px-3 text-text aria-invalid:border-flag-600"
        />
        {isEmailTaken && (
          <p id={emailErrorId} className="text-sm text-flag-text">
            {text.auth.register.emailTakenPrefix}{" "}
            <Link href={PAGE_ROUTES.login} className="font-medium underline">
              {text.auth.register.emailTakenLoginLink}
            </Link>{" "}
            {text.auth.register.emailTakenSuffix}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="register-password" className="text-sm font-semibold text-text">
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
          className="min-h-11 rounded-md border border-border bg-surface px-3 text-text"
        />
        <span id={passwordHintId} className="text-sm text-text-muted">
          {text.common.passwordHint(AUTH_PASSWORD_MIN_LENGTH)}
        </span>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="min-h-11 rounded-md bg-marker-500 font-semibold text-ink-950 hover:bg-marker-600 disabled:opacity-60"
      >
        {isLoading ? text.auth.register.submitLoading : text.auth.register.submitLabel}
      </button>

      <div className="flex items-center gap-3 text-sm text-text-muted">
        <span className="h-px flex-1 bg-border" aria-hidden="true" />
        {text.common.or}
        <span className="h-px flex-1 bg-border" aria-hidden="true" />
      </div>
      <GoogleSignInButton label={text.auth.register.googleLabel} />
    </form>
  );
}
