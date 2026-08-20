import { api } from "@/lib/redux/api";
import { API_ROUTES } from "@/lib/routes";
import type { CreateCommentRequest, RatingSummary, ThreadedComment } from "@/lib/types";

export const answerCommentsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAnswerComments: builder.query<ThreadedComment[], string>({
      query: (answerId) => API_ROUTES.answerComments(answerId),
      providesTags: (_result, _err, answerId) => [{ type: "AnswerComments", id: answerId }],
    }),
    // Invalidate-and-refetch, not a manual cache patch — a new comment can
    // land as either a new top-level entry or a reply nested under an
    // existing one, and only the server knows which; not worth duplicating
    // that branch client-side for one extra round-trip.
    createAnswerComment: builder.mutation<void, { answerId: string } & CreateCommentRequest>({
      query: ({ answerId, ...body }) => ({ url: API_ROUTES.answerComments(answerId), method: "POST", body }),
      invalidatesTags: (_result, _err, { answerId }) => [{ type: "AnswerComments", id: answerId }],
    }),
    // BE-49: same "no first-report-vs-already-reported signal" shape as
    // reportCompanyReview — the caller (CommentList) tracks "reported this
    // session" locally.
    reportComment: builder.mutation<void, { commentId: string; reason?: string }>({
      query: ({ commentId, reason }) => ({
        url: API_ROUTES.commentReport(commentId),
        method: "POST",
        body: reason ? { reason } : {},
      }),
    }),
    // FU-34 — `answerId` isn't part of the PATCH/DELETE /comments/:id URL,
    // so it's threaded through here purely to invalidate the one comment
    // list this edit/delete affects, same as createAnswerComment.
    updateAnswerComment: builder.mutation<void, { commentId: string; answerId: string; content: string }>({
      query: ({ commentId, content }) => ({ url: API_ROUTES.comment(commentId), method: "PATCH", body: { content } }),
      invalidatesTags: (_result, _err, { answerId }) => [{ type: "AnswerComments", id: answerId }],
    }),
    deleteAnswerComment: builder.mutation<void, { commentId: string; answerId: string }>({
      query: ({ commentId }) => ({ url: API_ROUTES.comment(commentId), method: "DELETE" }),
      invalidatesTags: (_result, _err, { answerId }) => [{ type: "AnswerComments", id: answerId }],
    }),
    getAnswerRating: builder.query<RatingSummary, string>({
      query: (answerId) => API_ROUTES.answerRating(answerId),
      providesTags: (_result, _err, answerId) => [{ type: "AnswerRating", id: answerId }],
    }),
    upsertAnswerRating: builder.mutation<void, { answerId: string; score: number }>({
      query: ({ answerId, score }) => ({ url: API_ROUTES.answerRating(answerId), method: "PUT", body: { score } }),
      invalidatesTags: (_result, _err, { answerId }) => [{ type: "AnswerRating", id: answerId }],
    }),
  }),
});

export const {
  useGetAnswerCommentsQuery,
  useCreateAnswerCommentMutation,
  useReportCommentMutation,
  useUpdateAnswerCommentMutation,
  useDeleteAnswerCommentMutation,
  useGetAnswerRatingQuery,
  useUpsertAnswerRatingMutation,
} = answerCommentsApi;
