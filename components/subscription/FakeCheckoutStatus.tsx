"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Link } from "@/components/i18n/LocaleLink";
import { useAppSelector } from "@/lib/redux/hooks";
import { useConfirmFakePaymentMutation } from "@/lib/redux/subscriptionApi";
import { useText } from "@/lib/text/useText";
import { PAGE_ROUTES } from "@/lib/routes";
import { formatVnd } from "@/lib/format";

/**
 * BE-75/FU-40 — landing page for the fake payment provider's checkout
 * redirect (payment.service.ts's createCheckout only ever returns this
 * page's URL when PAYMENT_PROVIDER=fake). Deliberately requires an
 * explicit confirm click rather than activating on load — mirrors the
 * shape of a real gateway redirect (checkout -> provider page -> return),
 * so switching to real MoMo later only changes which page the redirect
 * lands on, not the surrounding UX.
 *
 * `router` here is plain next/navigation, not useLocalizedRouter: the
 * destination (PAGE_ROUTES.checkoutReturn) is a deliberately unprefixed
 * fixed URL, same reasoning as its own comment in pages.ts.
 */
export function FakeCheckoutStatus() {
  const text = useText();
  const router = useRouter();
  const searchParams = useSearchParams();
  const txnRef = searchParams.get("txnRef");
  const amountParam = searchParams.get("amount");
  const amount = amountParam !== null && !Number.isNaN(Number(amountParam)) ? Number(amountParam) : null;

  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const isBootstrapped = useAppSelector((s) => s.auth.isBootstrapped);
  const [confirmFakePayment, { isLoading, isError }] = useConfirmFakePaymentMutation();

  async function handleConfirm() {
    if (!txnRef) return;
    try {
      await confirmFakePayment({ txnRef }).unwrap();
      router.push(PAGE_ROUTES.checkoutReturn);
    } catch {
      // isError from the mutation state already drives the error UI below
    }
  }

  if (!isBootstrapped) {
    return (
      <div role="status" aria-busy="true" className="text-center">
        <p className="text-text-muted">{text.common.loading}</p>
      </div>
    );
  }

  if (!accessToken) {
    return (
      <div role="alert" className="rounded-lg border border-border bg-surface p-6 text-center shadow-(--shadow-border)">
        <p className="font-semibold text-text">{text.subscription.callback.signedOutTitle}</p>
        <p className="mt-2 text-sm text-text-muted">{text.subscription.callback.signedOutBody}</p>
        <Link href={PAGE_ROUTES.login} className="mt-4 inline-block text-sm font-medium text-marker-700">
          {text.auth.login.submitLabel}
        </Link>
      </div>
    );
  }

  if (!txnRef) {
    return (
      <div role="alert" className="rounded-lg border border-border bg-surface p-6 text-center shadow-(--shadow-border)">
        <p className="font-semibold text-text">{text.subscription.fakeCheckout.missingTxnTitle}</p>
        <p className="mt-2 text-sm text-text-muted">{text.subscription.fakeCheckout.missingTxnBody}</p>
        <Link href={PAGE_ROUTES.subscribe} className="mt-4 inline-block text-sm font-medium text-marker-700">
          {text.subscription.fakeCheckout.cancelLink}
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-marker-500/40 bg-surface p-6 text-center shadow-(--shadow-border)">
      <span className="inline-block rounded-full bg-marker-100 px-3 py-1 text-xs font-semibold text-marker-700">
        {text.subscription.fakeCheckout.badgeLabel}
      </span>
      <p className="mt-4 font-display text-xl font-semibold text-text">{text.subscription.fakeCheckout.heading}</p>
      <p className="mt-2 text-sm text-text-muted">{text.subscription.fakeCheckout.body}</p>

      {amount !== null && (
        <div className="mt-4 rounded-md bg-wash-bg p-3">
          <p className="text-xs text-wash-text">{text.subscription.fakeCheckout.amountLabel}</p>
          <p className="font-display text-lg font-semibold text-wash-text">{formatVnd(amount)}</p>
        </div>
      )}

      {isError && (
        <p role="alert" className="mt-4 text-sm text-flag-text">
          {text.subscription.fakeCheckout.errorBody}
        </p>
      )}

      <button
        type="button"
        onClick={handleConfirm}
        disabled={isLoading}
        className="mt-5 min-h-11 w-full rounded-md bg-marker-500 px-5 font-semibold text-ink-950 hover:bg-marker-600 disabled:opacity-60"
      >
        {isLoading
          ? text.subscription.fakeCheckout.confirmingLabel
          : isError
            ? text.subscription.fakeCheckout.retryLabel
            : text.subscription.fakeCheckout.confirmLabel}
      </button>

      <Link
        href={PAGE_ROUTES.subscribe}
        className="mt-3 block text-sm font-medium text-text-muted hover:text-text"
      >
        {text.subscription.fakeCheckout.cancelLink}
      </Link>
    </div>
  );
}
