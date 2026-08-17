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
  questionTags: "/question-tags",
  questions: "/questions",
  questionDetail: (slug: string) => `/questions/${slug}`,
  companies: "/companies",
  companyDetail: (slug: string) => `/companies/${slug}`,
  companyReviews: (companyId: string) => `/companies/${companyId}/reviews`,
  review: (reviewId: string) => `/reviews/${reviewId}`,
  reviewReport: (reviewId: string) => `/reviews/${reviewId}/report`,
  bookmark: (questionId: string) => `/questions/${questionId}/bookmark`,
  myBookmarks: "/me/bookmarks",
  categoryStudyMark: (categoryId: string) => `/categories/${categoryId}/study-mark`,
  myStudiedCategories: "/me/studied-categories",
  myProfile: "/me/profile",
  subscriptionPlans: "/subscription-plans",
  checkout: "/subscriptions/checkout",
  mySubscription: "/me/subscription",
  questionSubmissions: "/question-submissions",
  questionSubmission: (id: string) => `/question-submissions/${id}`,
  myQuestionSubmissions: "/me/question-submissions",
  myNotifications: "/me/notifications",
  notificationRead: (id: string) => `/me/notifications/${id}/read`,
  notificationPreferences: "/me/notification-preferences",
} as const;
