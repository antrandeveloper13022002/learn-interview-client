"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useResetPasswordMutation } from "@/lib/redux/authApi";
import type { ApiErrorBody } from "@/lib/types";
import { text } from "@/lib/text";
import { AUTH_PASSWORD_MIN_LENGTH } from "@/lib/constants";
import { PAGE_ROUTES } from "@/lib/routes";

function tokenErrorCopy(err: unknown): string {
  if (err && typeof err === "object" && "data" in err) {
    const code = (err as { data?: ApiErrorBody }).data?.error.code;
    if (code === "TOKEN_EXPIRED") return text.auth.resetPassword.errors.tokenExpired;
    if (code === "TOKEN_ALREADY_USED") return text.auth.resetPassword.errors.tokenUsed;
  }
  return text.auth.resetPassword.errors.tokenInvalid;
}

export function ResetPasswordForm() {
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
      <div role="alert" className="rounded-lg border border-neutral-200 bg-white p-6 text-center">
        <p className="font-semibold">{text.auth.resetPassword.missingToken.title}</p>
        <p className="mt-2 text-sm text-neutral-600">{text.auth.resetPassword.missingToken.body}</p>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div role="status" className="rounded-lg border border-neutral-200 bg-white p-6 text-center">
        <p className="font-semibold">{text.auth.resetPassword.success.title}</p>
        <p className="mt-2 text-sm text-neutral-600">{text.auth.resetPassword.success.body}</p>
        <Link href={PAGE_ROUTES.login} className="mt-4 inline-block text-sm font-medium text-blue-700">
          {text.common.goToLoginLink}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4" aria-busy={isLoading}>
      {error && (
        <div role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">
          {tokenErrorCopy(error)}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="reset-password" className="text-sm font-semibold">
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
          className="min-h-11 rounded-md border border-neutral-300 px-3"
        />
        <span id={passwordHintId} className="text-sm text-neutral-500">
          {text.common.passwordHint(AUTH_PASSWORD_MIN_LENGTH)}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="reset-password-confirm" className="text-sm font-semibold">
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
          className="min-h-11 rounded-md border border-neutral-300 px-3 aria-invalid:border-red-600"
        />
        {mismatch && (
          <p id={confirmErrorId} className="text-sm text-red-700">
            {text.auth.resetPassword.mismatchError}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="min-h-11 rounded-md bg-blue-700 font-semibold text-white disabled:opacity-60"
      >
        {isLoading ? text.auth.resetPassword.submitLoading : text.auth.resetPassword.submitLabel}
      </button>
    </form>
  );
}
