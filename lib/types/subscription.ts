// Mirrors docs/api/openapi.yaml's SubscriptionPlan/SubscriptionStatus
// schemas exactly (see docs/business/business-rule.md#subscription for the
// 2 seeded plan codes/prices this drives display for).
export type SubscriptionPlan = {
  id: string;
  code: string;
  name: string;
  // The real amount charged at checkout, regardless of display language.
  priceVnd: number;
  // Display-only USD price, shown instead of priceVnd when the site is in
  // English (PlanSelector.tsx) — a fixed listed price, not a live
  // exchange-rate conversion. Both fields are always populated together
  // now (confirmed 2026-08-21, collapsed from an earlier 4-plan,
  // separate-USD-row shape — see business-rule.md#subscription).
  priceUsdCents: number | null;
  currency: "VND" | "USD";
  isLifetime: boolean;
};

export type SubscriptionStatus = {
  hasActiveSubscription: boolean;
  planCode: string | null;
  currentPeriodEnd: string | null;
};

export type CheckoutRequest = { planId: string };
export type CheckoutResponse = { redirectUrl: string };

// BE-78/FU-44 — GET /me/payments. Every attempt is included, not just
// SUCCESS (confirmed via AskUserQuestion) — a real billing-history view.
export type PaymentHistoryEntry = {
  id: string;
  planCode: string;
  planName: string;
  amount: number;
  currency: string;
  // The plan's *current* listed USD display price — see SubscriptionPlan's
  // own priceUsdCents comment. Not frozen at transaction time.
  priceUsdCents: number | null;
  status: "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";
  provider: string;
  createdAt: string;
};
