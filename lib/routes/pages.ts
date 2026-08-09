// Internal frontend-user navigation targets — every `<Link href>`,
// `router.push`, and canonical-URL base path goes through here instead of a
// literal string.
export const PAGE_ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  verifyEmail: "/verify-email",
  googleCallback: "/auth/google/callback",
  questions: "/questions",
  questionDetail: (slug: string) => `/questions/${slug}`,
  category: (slug: string) => `/categories/${slug}`,
  companies: "/companies",
  companyDetail: (slug: string) => `/companies/${slug}`,
  bookmarks: "/bookmarks",
  profile: "/profile",
  subscribe: "/subscribe",
  /** Must match the backend's `VNPAY_RETURN_URL` env value exactly — VNPay
   * redirects here after checkout regardless of what route this frontend
   * actually names its callback page (same class of gotcha as FU-10's
   * Google OAuth callback path note). */
  checkoutReturn: "/checkout/return",
} as const;
