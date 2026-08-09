"use client";

import { useState } from "react";
import { Link } from "@/components/i18n/LocaleLink";
import { useAppSelector } from "@/lib/redux/hooks";
import { useCheckoutMutation, useGetMySubscriptionQuery } from "@/lib/redux/subscriptionApi";
import { formatVnd } from "@/lib/format";
import { useText } from "@/lib/text/useText";
import { PAGE_ROUTES } from "@/lib/routes";
import { LockIcon } from "@/components/icons";
import type { SubscriptionPlan } from "@/lib/types";

type PlanSelectorProps = {
  plans: SubscriptionPlan[];
};

/**
 * Plan list itself is server-fetched (guest-visible, SEO-relevant — see
 * app/(public)/subscribe/page.tsx). Only the interactive "select a plan"
 * action and the "already subscribed" check need a real session, so those
 * are the only parts behind `'use client'`/RTK Query here.
 */
export function PlanSelector({ plans }: PlanSelectorProps) {
  const text = useText();
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const isBootstrapped = useAppSelector((s) => s.auth.isBootstrapped);
  const { data: subscription } = useGetMySubscriptionQuery(undefined, { skip: !accessToken });
  const [checkout, { isLoading: isCheckingOut }] = useCheckoutMutation();
  const [pendingPlanId, setPendingPlanId] = useState<string | null>(null);
  const [checkoutFailed, setCheckoutFailed] = useState(false);

  async function handleSelect(plan: SubscriptionPlan): Promise<void> {
    if (isCheckingOut) return; // one in-flight checkout at a time, across every plan button
    setCheckoutFailed(false);
    setPendingPlanId(plan.id);
    try {
      const result = await checkout({ planId: plan.id }).unwrap();
      // Real browser navigation to VNPay's own domain, not router.push —
      // this is leaving the Next.js app entirely. `.assign()` rather than
      // `.href =`: the React Compiler's eslint rule (react-hooks v6,
      // bundled by eslint-config-next in this Next.js version) flags a
      // direct assignment to `window.location` as an external mutation; the
      // method call form is behaviorally identical and satisfies the rule.
      window.location.assign(result.redirectUrl);
    } catch {
      setCheckoutFailed(true);
      setPendingPlanId(null);
    }
  }

  return (
    <div className="mt-8">
      {isBootstrapped && accessToken && subscription?.hasActiveSubscription && (
        <div className="mb-6 rounded-lg border border-marker-300 bg-wash-bg p-4 text-sm text-wash-text">
          <p className="font-semibold">{text.subscription.subscribe.alreadySubscribed.title}</p>
          <p className="mt-1">
            {subscription.currentPeriodEnd
              ? text.subscription.subscribe.alreadySubscribed.bodyWithExpiry(
                  new Date(subscription.currentPeriodEnd).toLocaleDateString("vi-VN"),
                )
              : text.subscription.subscribe.alreadySubscribed.bodyLifetime}
          </p>
        </div>
      )}

      {checkoutFailed && (
        <p role="alert" className="mb-4 text-sm text-flag-text">
          {text.subscription.subscribe.checkoutError}
        </p>
      )}

      {plans.length === 0 ? (
        <p className="text-text-muted">{text.subscription.subscribe.emptyTitle}</p>
      ) : (
        <ul className="grid gap-4 text-left sm:grid-cols-3">
          {/* Display-only — not a SubscriptionPlan row. Free is just "no
              active subscription," the same state as before this card
              existed; there is no checkout for it. */}
          <li className="flex flex-col overflow-hidden rounded-[18px] border border-border bg-surface shadow-(--shadow-border)">
            <div className="flex flex-1 flex-col p-6">
              <p className="font-display text-lg font-semibold">{text.subscription.subscribe.freeTitle}</p>
              <p className="mt-1 text-sm text-text-muted">{text.subscription.subscribe.freeDescription}</p>
              <p className="font-display mt-4 text-2xl font-bold tracking-tight">
                {text.subscription.subscribe.freePriceLabel}
              </p>
              <Link
                href={PAGE_ROUTES.questions}
                className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md border border-border px-5 py-2 text-center font-semibold text-text hover:bg-border"
              >
                {text.subscription.subscribe.freeCta}
              </Link>
            </div>
          </li>

          {plans.map((plan) => {
            const isPending = isCheckingOut && pendingPlanId === plan.id;
            const isRecommended = plan.code === "LIFETIME";
            const description = text.subscription.subscribe.planDescription[plan.code];
            return (
              <li
                key={plan.id}
                className={`flex flex-col overflow-hidden rounded-[18px] bg-surface shadow-(--shadow-border) ${
                  isRecommended ? "border-2 border-marker-600" : "border border-border"
                }`}
              >
                {isRecommended && (
                  <p className="font-mono bg-marker-500 py-1.5 text-center text-xs font-bold tracking-wide text-ink-950 uppercase">
                    {text.subscription.subscribe.recommendedBadge}
                  </p>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <p className="font-display text-lg font-semibold">{text.subscription.planName[plan.code] ?? plan.name}</p>
                  {description && <p className="mt-1 text-sm text-text-muted">{description}</p>}
                  <p className="font-display mt-4 text-2xl font-bold tracking-tight">{formatVnd(plan.priceVnd)}</p>
                  {plan.isLifetime && <p className="mt-1 text-sm text-text-muted">{text.subscription.subscribe.lifetimeBadge}</p>}

                  {isBootstrapped && !accessToken ? (
                    <Link
                      href={PAGE_ROUTES.login}
                      className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-marker-500 px-5 py-2 text-center font-semibold text-ink-950 hover:bg-marker-600"
                    >
                      {text.subscription.subscribe.signedOutTitle}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSelect(plan)}
                      disabled={!isBootstrapped || isCheckingOut}
                      className="mt-6 min-h-11 rounded-md bg-marker-500 px-5 py-2 font-semibold text-ink-950 hover:bg-marker-600 disabled:opacity-60"
                    >
                      {isPending ? text.subscription.subscribe.selectCtaLoading : text.subscription.subscribe.selectCta}
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {plans.length > 0 && (
        <p className="mt-6 flex items-center justify-center gap-2 text-sm text-text-muted">
          <LockIcon className="size-4" />
          {text.subscription.subscribe.paymentNote}
        </p>
      )}
    </div>
  );
}
