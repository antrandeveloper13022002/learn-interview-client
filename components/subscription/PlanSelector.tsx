"use client";

import { useState } from "react";
import { Link } from "@/components/i18n/LocaleLink";
import { useAppSelector } from "@/lib/redux/hooks";
import { useCheckoutMutation, useGetMySubscriptionQuery } from "@/lib/redux/subscriptionApi";
import { formatUsd, formatVnd } from "@/lib/format";
import { useText } from "@/lib/text/useText";
import { PAGE_ROUTES } from "@/lib/routes";
import { CheckIcon, LockIcon } from "@/components/icons";
import type { SubscriptionPlan } from "@/lib/types";

type PlanSelectorProps = {
  plans: SubscriptionPlan[];
  freeQuestionCount: number;
};

/**
 * Plan list itself is server-fetched (guest-visible, SEO-relevant — see
 * app/(public)/subscribe/page.tsx). Only the interactive "select a plan"
 * action and the "already subscribed" check need a real session, so those
 * are the only parts behind `'use client'`/RTK Query here.
 */
export function PlanSelector({ plans, freeQuestionCount }: PlanSelectorProps) {
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
      // Real browser navigation to MoMo's own domain, not router.push —
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
        <ul className="grid gap-6 text-left sm:grid-cols-3">
          {/* Display-only — not a SubscriptionPlan row. Free is just "no
              active subscription," the same state as before this card
              existed; there is no checkout for it. Same border-2/badge-row
              spacer as the paid cards below so all three line up — a 1px
              vs 2px border, or a badge row only some cards have, shifts
              this card's content out of alignment with the others. */}
          <li className="flex flex-col overflow-hidden rounded-[18px] border-2 border-border bg-surface shadow-(--shadow-border)">
            <p aria-hidden="true" className="invisible py-1.5 text-center font-mono text-xs font-bold tracking-wide uppercase">
              {text.subscription.subscribe.recommendedBadge}
            </p>
            <div className="flex flex-1 flex-col p-8">
              <p className="font-display text-lg font-semibold">{text.subscription.subscribe.freeTitle}</p>
              <p className="mt-1 text-sm text-text-muted">{text.subscription.subscribe.freeDescription}</p>
              <p className="font-display mt-4 text-2xl font-bold tracking-tight">
                {text.subscription.subscribe.freePriceLabel}
              </p>
              <Link
                href={PAGE_ROUTES.questions}
                className="mt-4 inline-flex min-h-11 items-center justify-center rounded-md border border-border px-5 py-2 text-center font-semibold text-text hover:bg-border"
              >
                {text.subscription.subscribe.freeCta}
              </Link>

              <ul className="mt-6 space-y-2 text-left text-sm text-text-muted">
                {text.subscription.subscribe.freeBenefits(freeQuestionCount).map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2">
                    <CheckIcon className="mt-0.5 size-4 shrink-0 text-marker-600" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </li>

          {plans.map((plan) => {
            const isPending = isCheckingOut && pendingPlanId === plan.id;
            // USD rows are their own plan codes (MONTHLY_USD/LIFETIME_USD,
            // business-rule.md#subscription) but share display copy with
            // their VND counterpart — strip the suffix to look it up.
            const baseCode = plan.code.replace(/_USD$/, "");
            const isRecommended = baseCode === "MONTHLY";
            const description = text.subscription.subscribe.planDescription[baseCode];
            const price = plan.currency === "USD" ? formatUsd(plan.priceUsdCents ?? 0) : formatVnd(plan.priceVnd);
            return (
              <li
                key={plan.id}
                className={`flex flex-col overflow-hidden rounded-[18px] bg-surface shadow-(--shadow-border) ${
                  isRecommended ? "border-2 border-marker-600" : "border-2 border-border"
                }`}
              >
                {/* Rendered on every card, invisible unless recommended —
                    keeps the badge row's height reserved so titles start at
                    the same y across all three cards regardless of which
                    one is recommended. */}
                <p
                  aria-hidden={!isRecommended || undefined}
                  className={`py-1.5 text-center font-mono text-xs font-bold tracking-wide uppercase ${
                    isRecommended ? "bg-marker-500 text-ink-950" : "invisible"
                  }`}
                >
                  {text.subscription.subscribe.recommendedBadge}
                </p>
                <div className="flex flex-1 flex-col p-8">
                  <p className="font-display text-lg font-semibold">{text.subscription.planName[baseCode] ?? plan.name}</p>
                  {description && <p className="mt-1 text-sm text-text-muted">{description}</p>}
                  <p className="font-display mt-4 text-2xl font-bold tracking-tight">
                    {price}
                    <span className="text-sm font-normal text-text-muted">
                      {" "}
                      {plan.isLifetime ? text.subscription.subscribe.oneTimeSuffix : text.subscription.subscribe.perPeriodSuffix}
                    </span>
                  </p>

                  {isBootstrapped && !accessToken ? (
                    <Link
                      href={PAGE_ROUTES.login}
                      className="mt-4 inline-flex min-h-11 items-center justify-center rounded-md bg-marker-500 px-5 py-2 text-center font-semibold text-ink-950 hover:bg-marker-600"
                    >
                      {text.subscription.subscribe.signedOutTitle}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSelect(plan)}
                      disabled={!isBootstrapped || isCheckingOut}
                      className="mt-4 min-h-11 rounded-md bg-marker-500 px-5 py-2 font-semibold text-ink-950 hover:bg-marker-600 disabled:opacity-60"
                    >
                      {isPending ? text.subscription.subscribe.selectCtaLoading : text.subscription.subscribe.selectCta}
                    </button>
                  )}

                  <ul className="mt-6 space-y-2 text-left text-sm text-text-muted">
                    {text.subscription.subscribe.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2">
                        <CheckIcon className="mt-0.5 size-4 shrink-0 text-marker-600" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
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
