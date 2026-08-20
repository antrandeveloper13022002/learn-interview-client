import { api } from "@/lib/redux/api";
import { API_ROUTES } from "@/lib/routes";
import type { CompanyReview, CompanyReviewListResponse, CreateCompanyReviewRequest } from "@/lib/types";

export const companyReviewApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCompanyReviews: builder.query<CompanyReviewListResponse, string>({
      query: (companyId) => API_ROUTES.companyReviews(companyId),
      providesTags: (result, _err, companyId) =>
        result
          ? [
              ...result.items.map((r) => ({ type: "CompanyReviews" as const, id: r.id })),
              { type: "CompanyReviews" as const, id: companyId },
            ]
          : [{ type: "CompanyReviews" as const, id: companyId }],
    }),
    // Not a true optimistic update (no pre-response cache write) — the
    // author needs to see their own PENDING review immediately (FU-12), and
    // the create response already IS that exact row, so inserting it after
    // `queryFulfilled` is simpler and can't drift from what the server
    // actually stored (no id/timestamp to guess).
    createCompanyReview: builder.mutation<CompanyReview, { companyId: string } & CreateCompanyReviewRequest>({
      query: ({ companyId, ...body }) => ({ url: API_ROUTES.companyReviews(companyId), method: "POST", body }),
      async onQueryStarted({ companyId }, { dispatch, queryFulfilled }) {
        try {
          const { data: review } = await queryFulfilled;
          dispatch(
            companyReviewApi.util.updateQueryData("getCompanyReviews", companyId, (draft) => {
              draft.items.unshift(review);
              draft.total += 1;
            }),
          );
        } catch {
          // no-op — the form itself surfaces the mutation's own error state
        }
      },
    }),
    deleteCompanyReview: builder.mutation<void, { reviewId: string; companyId: string }>({
      query: ({ reviewId }) => ({ url: API_ROUTES.review(reviewId), method: "DELETE" }),
      async onQueryStarted({ reviewId, companyId }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          companyReviewApi.util.updateQueryData("getCompanyReviews", companyId, (draft) => {
            const index = draft.items.findIndex((r) => r.id === reviewId);
            if (index !== -1) {
              draft.items.splice(index, 1);
              draft.total -= 1;
            }
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),
    // BE-38: idempotent server-side, but the response gives no signal
    // distinguishing "first report" from "already reported" — the caller
    // (ReviewList) tracks "reported this session" locally since there's no
    // API to ask "did I already report this" after a reload.
    reportCompanyReview: builder.mutation<void, { reviewId: string; reason?: string }>({
      query: ({ reviewId, reason }) => ({
        url: API_ROUTES.reviewReport(reviewId),
        method: "POST",
        body: reason ? { reason } : {},
      }),
    }),
    // BE-73: true optimistic update (unlike createCompanyReview above,
    // which waits for the server row) — a like toggle has no server-
    // generated data worth waiting for, just a count/flag flip, same
    // undo-on-failure shape as deleteCompanyReview.
    likeCompanyReview: builder.mutation<void, { reviewId: string; companyId: string }>({
      query: ({ reviewId }) => ({ url: API_ROUTES.reviewLike(reviewId), method: "POST" }),
      async onQueryStarted({ reviewId, companyId }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          companyReviewApi.util.updateQueryData("getCompanyReviews", companyId, (draft) => {
            const review = draft.items.find((r) => r.id === reviewId);
            if (review && !review.isLikedByMe) {
              review.isLikedByMe = true;
              review.likeCount += 1;
            }
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),
    unlikeCompanyReview: builder.mutation<void, { reviewId: string; companyId: string }>({
      query: ({ reviewId }) => ({ url: API_ROUTES.reviewLike(reviewId), method: "DELETE" }),
      async onQueryStarted({ reviewId, companyId }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          companyReviewApi.util.updateQueryData("getCompanyReviews", companyId, (draft) => {
            const review = draft.items.find((r) => r.id === reviewId);
            if (review && review.isLikedByMe) {
              review.isLikedByMe = false;
              review.likeCount -= 1;
            }
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),
  }),
});

export const {
  useGetCompanyReviewsQuery,
  useCreateCompanyReviewMutation,
  useDeleteCompanyReviewMutation,
  useReportCompanyReviewMutation,
  useLikeCompanyReviewMutation,
  useUnlikeCompanyReviewMutation,
} = companyReviewApi;
