// Mirrors docs/api/openapi.yaml's SubscriptionPlan/SubscriptionStatus
// schemas exactly (see docs/business/business-rule.md#subscription for the
// three seeded plan codes/prices this drives display for).
export type SubscriptionPlan = {
  id: string;
  code: string;
  name: string;
  priceVnd: number;
  isLifetime: boolean;
};

export type SubscriptionStatus = {
  hasActiveSubscription: boolean;
  planCode: string | null;
  currentPeriodEnd: string | null;
};

export type CheckoutRequest = { planId: string };
export type CheckoutResponse = { redirectUrl: string };
