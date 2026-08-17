// Mirrors docs/api/openapi.yaml's SubscriptionPlan/SubscriptionStatus
// schemas exactly (see docs/business/business-rule.md#subscription for the
// three seeded plan codes/prices this drives display for).
export type SubscriptionPlan = {
  id: string;
  code: string;
  name: string;
  priceVnd: number;
  // Meaningful only when currency is "USD" (BE-53) — the VND rows carry
  // priceUsdCents: null, the USD rows carry priceVnd: 0. See
  // business-rule.md#subscription: USD plans are display-only until a
  // USD-capable PaymentProvider exists.
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
