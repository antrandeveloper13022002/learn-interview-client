"use client";

import { useEffect, useState } from "react";
import { Link } from "@/components/i18n/LocaleLink";
import { useAppSelector } from "@/lib/redux/hooks";
import { useGetMySubscriptionQuery } from "@/lib/redux/subscriptionApi";
import { useText } from "@/lib/text/useText";
import { PAGE_ROUTES } from "@/lib/routes";

const POLL_INTERVAL_MS = 2500;
const MAX_WAIT_MS = 45_000;

/**
 * The VNPay redirect landing here is never trusted as proof of payment on
 * its own (docs/architecture/sequence-diagram.md: "the webhook, not the
 * redirect, is authoritative" — a user could close the tab, or the redirect
 * could be manipulated client-side). This polls GET /me/subscription
 * (reflecting the webhook's own write) until it confirms, rather than
 * reading any VNPay query param off this page's own URL.
 *
 * Giving up after MAX_WAIT_MS is a real, expected outcome (webhook
 * delay/loss), not a failure — payment idempotency means the true state
 * still resolves correctly on a later check (BE-16/BE-30), so this offers a
 * manual retry rather than an alarming error.
 */
export function CheckoutCallbackStatus() {
  const text = useText();
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const isBootstrapped = useAppSelector((s) => s.auth.isBootstrapped);
  const [gaveUp, setGaveUp] = useState(false);

  const { data, refetch } = useGetMySubscriptionQuery(undefined, {
    skip: !accessToken || gaveUp,
    pollingInterval: accessToken && !gaveUp ? POLL_INTERVAL_MS : 0,
  });
  const isConfirmed = data?.hasActiveSubscription === true;

  useEffect(() => {
    if (isConfirmed || gaveUp || !accessToken) return;
    const timeout = setTimeout(() => setGaveUp(true), MAX_WAIT_MS);
    return () => clearTimeout(timeout);
  }, [isConfirmed, gaveUp, accessToken]);

  function handleRetry(): void {
    setGaveUp(false);
    void refetch();
  }

  if (!isBootstrapped) {
    return (
      <div role="status" aria-busy="true" className="text-center">
        <span className="sr-only">{text.subscription.callback.confirmingSrOnly}</span>
        <p className="text-text-muted">{text.subscription.callback.confirmingBody}</p>
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

  if (isConfirmed) {
    return (
      <div className="rounded-lg border border-correct-500/30 bg-correct-bg p-6 text-center">
        <p className="font-semibold text-correct-text">{text.subscription.callback.successTitle}</p>
        <p className="mt-2 text-sm text-correct-text">{text.subscription.callback.successBody}</p>
        <Link
          href={PAGE_ROUTES.questions}
          className="mt-4 inline-block min-h-11 content-center rounded-md bg-marker-500 px-5 py-2 font-semibold text-ink-950 hover:bg-marker-600"
        >
          {text.subscription.callback.goToQuestionsLink}
        </Link>
      </div>
    );
  }

  if (!gaveUp) {
    return (
      <div role="status" aria-busy="true" className="text-center">
        <span className="sr-only">{text.subscription.callback.confirmingSrOnly}</span>
        <p className="text-text-muted">{text.subscription.callback.confirmingBody}</p>
      </div>
    );
  }

  return (
    <div role="alert" className="rounded-lg border border-border bg-surface p-6 text-center shadow-(--shadow-border)">
      <p className="font-semibold text-text">{text.subscription.callback.pendingTitle}</p>
      <p className="mt-2 text-sm text-text-muted">{text.subscription.callback.pendingBody}</p>
      <div className="mt-4 flex justify-center gap-4">
        <button
          type="button"
          onClick={handleRetry}
          className="min-h-11 rounded-md border border-border px-5 py-2 font-medium text-text hover:bg-border"
        >
          {text.subscription.callback.retryLink}
        </button>
        <Link
          href={PAGE_ROUTES.subscribe}
          className="inline-flex min-h-11 items-center text-sm font-medium text-marker-700"
        >
          {text.subscription.callback.backToSubscribeLink}
        </Link>
      </div>
    </div>
  );
}
