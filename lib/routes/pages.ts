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
  /** Route doesn't exist yet (FU-08, not started) — kept here so
   * PremiumAnswer.tsx's link isn't a bare literal in the meantime. */
  subscribe: "/subscribe",
} as const;
