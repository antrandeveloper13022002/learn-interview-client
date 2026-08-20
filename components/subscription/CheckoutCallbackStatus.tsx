"use client";

import { useEffect, useState } from "react";
import { Link } from "@/components/i18n/LocaleLink";
import { useAppSelector } from "@/lib/redux/hooks";
import { useGetMySubscriptionQuery } from "@/lib/redux/subscriptionApi";
import { useText } from "@/lib/text/useText";
import { useLocale } from "@/lib/routes/useLocale";
import { PAGE_ROUTES } from "@/lib/routes";
import { formatDate } from "@/lib/format";
import { CheckIcon } from "@/components/icons";

const POLL_INTERVAL_MS = 2500;
const MAX_WAIT_MS = 45_000;

/**
 * The MoMo redirect landing here is never trusted as proof of payment on
 * its own (docs/architecture/sequence-diagram.md: "the webhook, not the
 * redirect, is authoritative" — a user could close the tab, or the redirect
 * could be manipulated client-side). This polls GET /me/subscription
 * (reflecting the webhook's own write) until it confirms, rather than
 * reading any MoMo query param off this page's own URL.
 *
 * Giving up after MAX_WAIT_MS is a real, expected outcome (webhook
 * delay/loss), not a failure — payment idempotency means the true state
 * still resolves correctly on a later check (BE-16/BE-30), so this offers a
 * manual retry rather than an alarming error.
 */
export function CheckoutCallbackStatus() {
  const text = useText();
  const lang = useLocale();
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
    const planLabel = data.planCode ? (text.subscription.planName[data.planCode] ?? data.planCode) : null;

    return (
      <div className="mx-auto w-full max-w-sm rounded-lg border border-border bg-surface p-8 text-center shadow-(--shadow-border)">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-marker-500">
          <CheckIcon className="size-5 text-ink-950" />
        </span>
        <p className="mt-4 font-display text-[22px] leading-[1.3] font-bold text-text">
          {text.subscription.callback.successTitle}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-text-muted">{text.subscription.callback.successBody}</p>

        {planLabel && (
          <div className="mt-4 flex flex-col gap-1.5 rounded-md bg-premium-bg p-4 text-left">
            <div className="flex items-center justify-between">
              <span className="rounded bg-marker-500 px-2 py-1 font-mono text-[11px] font-bold uppercase text-ink-950">
                {planLabel}
              </span>
              <span className="font-display text-sm font-bold text-text">
                {text.subscription.callback.premiumAccessLabel}
              </span>
            </div>
            <p className="text-[13px] font-medium text-marker-700">
              {data.currentPeriodEnd
                ? text.subscription.callback.validUntilLabel(formatDate(data.currentPeriodEnd, lang))
                : text.subscription.callback.neverExpiresLabel}
            </p>
          </div>
        )}

        <ul className="mt-4 flex flex-col gap-3.5 text-left">
          {text.subscription.subscribe.benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-2.5">
              <span className="mt-1 size-4 shrink-0 rounded-full bg-marker-500" aria-hidden="true" />
              <span className="text-[13px] leading-relaxed text-text-muted">{benefit}</span>
            </li>
          ))}
        </ul>

        <Link
          href={PAGE_ROUTES.questions}
          className="mt-6 flex min-h-12 w-full items-center justify-center rounded-md bg-marker-500 px-5 text-[15px] font-semibold text-ink-950 shadow-[0_4px_12px_rgba(232,163,61,0.19)] hover:bg-marker-600"
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
