import { api } from "@/lib/redux/api";
import { API_ROUTES } from "@/lib/routes";
import type { CheckoutRequest, CheckoutResponse, SubscriptionStatus } from "@/lib/types";

export const subscriptionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMySubscription: builder.query<SubscriptionStatus, void>({
      query: () => API_ROUTES.mySubscription,
      providesTags: ["Subscription"],
    }),
    checkout: builder.mutation<CheckoutResponse, CheckoutRequest>({
      query: (body) => ({ url: API_ROUTES.checkout, method: "POST", body }),
    }),
  }),
});

export const { useGetMySubscriptionQuery, useCheckoutMutation } = subscriptionApi;
