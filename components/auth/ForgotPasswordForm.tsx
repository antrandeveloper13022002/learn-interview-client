"use client";

import { useState } from "react";
import { useForgotPasswordMutation } from "@/lib/redux/authApi";
import { text } from "@/lib/text";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [forgotPassword, { isLoading, isSuccess, isError }] = useForgotPasswordMutation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isLoading) return;
    await forgotPassword({ email });
  }

  // Identical confirmation regardless of whether the account exists —
  // never let the UI leak what the backend already protects against
  // (business-rule.md / security.md, same class as BE-04's login guard).
  if (isSuccess) {
    return (
      <div role="status" className="rounded-lg border border-neutral-200 bg-white p-6 text-center">
        <p className="font-semibold">{text.auth.forgotPassword.success.title}</p>
        <p className="mt-2 text-sm text-neutral-600">
          {text.auth.forgotPassword.success.bodyBeforeEmail}
          <strong>{email}</strong>
          {text.auth.forgotPassword.success.bodyAfterEmail}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4" aria-busy={isLoading}>
      {isError && (
        <div role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">
          {text.common.networkError}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="forgot-email" className="text-sm font-semibold">
          {text.auth.forgotPassword.emailLabel}
        </label>
        <input
          id="forgot-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="min-h-11 rounded-md border border-neutral-300 px-3"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="min-h-11 rounded-md bg-blue-700 font-semibold text-white disabled:opacity-60"
      >
        {isLoading ? text.auth.forgotPassword.submitLoading : text.auth.forgotPassword.submitLabel}
      </button>
    </form>
  );
}
