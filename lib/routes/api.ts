// Backend endpoint paths (appended to NEXT_PUBLIC_API_URL) — every
// fetch/RTK Query call goes through here instead of a literal string, so a
// path never has to be grepped-and-replaced by hand across files.
export const API_ROUTES = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
    verifyEmail: "/auth/verify-email",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    /** Real top-level navigation (OAuth consent), not a fetch — still the
     * backend's own route, so it belongs here rather than in pages.ts. */
    google: "/auth/google",
  },
  categories: "/categories",
  questions: "/questions",
  questionDetail: (slug: string) => `/questions/${slug}`,
} as const;
