import { apiFetch } from "@/lib/api/client";
import { LISTING_REVALIDATE_SECONDS } from "@/lib/constants";
import { API_ROUTES } from "@/lib/routes";
import type { SubscriptionPlan } from "@/lib/types";

// Guest-visible, part of initial render (coding-style.md: no client useEffect
// fetch for anything affecting first paint) — same Server Component fetcher
// used for categories/questions, not RTK Query. Checkout/subscription-status
// (real session required) go through lib/redux/subscriptionApi.ts instead.
export function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  return apiFetch<SubscriptionPlan[]>(API_ROUTES.subscriptionPlans, {
    next: { revalidate: LISTING_REVALIDATE_SECONDS },
  });
}
