import { api } from "@/lib/redux/api";
import { sessionCleared, sessionEstablished } from "@/lib/redux/authSlice";
import { API_ROUTES } from "@/lib/routes";
import type {
  AuthResponse,
  RegisterRequest,
  LoginRequest,
  VerifyEmailRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "@/lib/types";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<void, RegisterRequest>({
      query: (body) => ({ url: API_ROUTES.auth.register, method: "POST", body }),
    }),
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({ url: API_ROUTES.auth.login, method: "POST", body }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(sessionEstablished(data));
      },
    }),
    refresh: builder.mutation<AuthResponse, void>({
      query: () => ({ url: API_ROUTES.auth.refresh, method: "POST" }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(sessionEstablished(data));
        } catch {
          // No valid refresh cookie (guest, or it expired) — not an error the caller needs to handle.
          dispatch(sessionCleared());
        }
      },
    }),
    logout: builder.mutation<void, void>({
      query: () => ({ url: API_ROUTES.auth.logout, method: "POST" }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await queryFulfilled.catch(() => undefined);
        dispatch(sessionCleared());
      },
    }),
    verifyEmail: builder.mutation<void, VerifyEmailRequest>({
      query: (body) => ({ url: API_ROUTES.auth.verifyEmail, method: "POST", body }),
    }),
    forgotPassword: builder.mutation<void, ForgotPasswordRequest>({
      query: (body) => ({ url: API_ROUTES.auth.forgotPassword, method: "POST", body }),
    }),
    resetPassword: builder.mutation<void, ResetPasswordRequest>({
      query: (body) => ({ url: API_ROUTES.auth.resetPassword, method: "POST", body }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshMutation,
  useLogoutMutation,
  useVerifyEmailMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
