"use client";

import { useId, useState } from "react";
import { Link } from "@/components/i18n/LocaleLink";
import { useSearchParams } from "next/navigation";
import { useResetPasswordMutation } from "@/lib/redux/authApi";
import type { ApiErrorBody } from "@/lib/types";
import { useText } from "@/lib/text/useText";
import type { TextDictionary } from "@/lib/text";
import { AUTH_PASSWORD_MIN_LENGTH } from "@/lib/constants";
import { PAGE_ROUTES } from "@/lib/routes";

function tokenErrorCopy(err: unknown, text: TextDictionary): string {
  if (err && typeof err === "object" && "data" in err) {
    const code = (err as { data?: ApiErrorBody }).data?.error.code;
    if (code === "TOKEN_EXPIRED") return text.auth.resetPassword.errors.tokenExpired;
    if (code === "TOKEN_ALREADY_USED") return text.auth.resetPassword.errors.tokenUsed;
  }
  return text.auth.resetPassword.errors.tokenInvalid;
}

export function ResetPasswordForm() {
  const text = useText();
  const token = useSearchParams().get("token");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [mismatchTouched, setMismatchTouched] = useState(false);
  const [resetPassword, { isLoading, isSuccess, error }] = useResetPasswordMutation();
  const confirmErrorId = useId();
  const passwordHintId = useId();

  const mismatch = mismatchTouched && confirm.length > 0 && newPassword !== confirm;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMismatchTouched(true);
    if (isLoading || !token || newPassword !== confirm) return;
    await resetPassword({ token, newPassword });
  }

  if (!token) {
    return (
      <div role="alert" className="rounded-lg border border-border bg-bg p-6 text-center">
        <p className="font-semibold text-text">{text.auth.resetPassword.missingToken.title}</p>
        <p className="mt-2 text-sm text-text-muted">{text.auth.resetPassword.missingToken.body}</p>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div role="status" className="rounded-lg border border-border bg-bg p-6 text-center">
        <p className="font-semibold text-text">{text.auth.resetPassword.success.title}</p>
        <p className="mt-2 text-sm text-text-muted">{text.auth.resetPassword.success.body}</p>
        <Link href={PAGE_ROUTES.login} className="mt-4 inline-block text-sm font-medium text-marker-700">
          {text.common.goToLoginLink}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4" aria-busy={isLoading}>
      {error && (
        <div role="alert" className="rounded-md bg-flag-bg px-4 py-3 text-sm text-flag-text">
          {tokenErrorCopy(error, text)}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="reset-password" className="text-sm font-semibold text-text">
          {text.auth.resetPassword.newPasswordLabel}
        </label>
        <input
          id="reset-password"
          type="password"
          autoComplete="new-password"
          required
          minLength={AUTH_PASSWORD_MIN_LENGTH}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          aria-describedby={passwordHintId}
          className="min-h-11 rounded-md border border-border bg-surface px-3 text-text"
        />
        <span id={passwordHintId} className="text-sm text-text-muted">
          {text.common.passwordHint(AUTH_PASSWORD_MIN_LENGTH)}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="reset-password-confirm" className="text-sm font-semibold text-text">
          {text.auth.resetPassword.confirmPasswordLabel}
        </label>
        <input
          id="reset-password-confirm"
          type="password"
          autoComplete="new-password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          onBlur={() => setMismatchTouched(true)}
          aria-invalid={mismatch || undefined}
          aria-describedby={mismatch ? confirmErrorId : undefined}
          className="min-h-11 rounded-md border border-border bg-surface px-3 text-text aria-invalid:border-flag-600"
        />
        {mismatch && (
          <p id={confirmErrorId} className="text-sm text-flag-text">
            {text.auth.resetPassword.mismatchError}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="min-h-11 rounded-md bg-marker-500 font-semibold text-ink-950 hover:bg-marker-600 disabled:opacity-60"
      >
        {isLoading ? text.auth.resetPassword.submitLoading : text.auth.resetPassword.submitLabel}
      </button>
    </form>
  );
}
