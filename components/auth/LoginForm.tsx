"use client";

import { useId, useState } from "react";
import { Link } from "@/components/i18n/LocaleLink";
import { useLocalizedRouter } from "@/lib/routes/useLocale";
import { useLoginMutation } from "@/lib/redux/authApi";
import type { ApiErrorBody } from "@/lib/types";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { useText } from "@/lib/text/useText";
import type { TextDictionary } from "@/lib/text";
import { PAGE_ROUTES } from "@/lib/routes";

function errorMessage(err: unknown, text: TextDictionary): string {
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
  const router = useLocalizedRouter();
  const text = useText();
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
        <div id={formErrorId} role="alert" className="rounded-md bg-flag-bg px-4 py-3 text-sm text-flag-text">
          {errorMessage(error, text)}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="login-email" className="text-sm font-semibold text-text">
          {text.auth.login.emailLabel}
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="min-h-11 rounded-md border border-border bg-surface px-3 text-text"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="login-password" className="text-sm font-semibold text-text">
          {text.auth.login.passwordLabel}
        </label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="min-h-11 rounded-md border border-border bg-surface px-3 text-text"
        />
        <Link href={PAGE_ROUTES.forgotPassword} className="self-end text-sm text-marker-700">
          {text.auth.login.forgotPasswordLink}
        </Link>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="min-h-11 rounded-md bg-marker-500 font-semibold text-ink-950 hover:bg-marker-600 disabled:opacity-60"
      >
        {isLoading ? text.auth.login.submitLoading : text.auth.login.submitLabel}
      </button>

      <div className="flex items-center gap-3 text-sm text-text-muted">
        <span className="h-px flex-1 bg-border" aria-hidden="true" />
        {text.common.or}
        <span className="h-px flex-1 bg-border" aria-hidden="true" />
      </div>
      <GoogleSignInButton label={text.auth.login.googleLabel} />
    </form>
  );
}
