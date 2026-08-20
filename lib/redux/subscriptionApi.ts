import { api } from "@/lib/redux/api";
import { API_ROUTES } from "@/lib/routes";
import type { CheckoutRequest, CheckoutResponse, PaymentHistoryEntry, SubscriptionStatus } from "@/lib/types";

export const subscriptionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMySubscription: builder.query<SubscriptionStatus, void>({
      query: () => API_ROUTES.mySubscription,
      providesTags: ["Subscription"],
    }),
    // BE-78/FU-44 — no cache tag/invalidation: this list only ever grows
    // via a checkout the user just completed, which lands on
    // /checkout/return, not this page — a plain fetch-on-mount is enough.
    getMyPayments: builder.query<PaymentHistoryEntry[], void>({
      query: () => API_ROUTES.myPayments,
    }),
    checkout: builder.mutation<CheckoutResponse, CheckoutRequest>({
      query: (body) => ({ url: API_ROUTES.checkout, method: "POST", body }),
    }),
    // BE-75 — the /checkout/fake page's confirm button. No cache
    // invalidation here: the success state is read via getMySubscription's
    // own polling (CheckoutCallbackStatus, reused unchanged by
    // FakeCheckoutStatus), not an optimistic update.
    confirmFakePayment: builder.mutation<void, { txnRef: string }>({
      query: (body) => ({ url: API_ROUTES.fakePaymentConfirm, method: "POST", body }),
    }),
  }),
});

export const { useGetMySubscriptionQuery, useGetMyPaymentsQuery, useCheckoutMutation, useConfirmFakePaymentMutation } = subscriptionApi;
