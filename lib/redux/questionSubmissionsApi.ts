import { api } from "@/lib/redux/api";
import { API_ROUTES } from "@/lib/routes";
import type {
  CreateQuestionSubmissionRequest,
  QuestionSubmission,
  QuestionSubmissionListResponse,
  UpdateQuestionSubmissionRequest,
} from "@/lib/types";

export const questionSubmissionsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMyQuestionSubmissions: builder.query<QuestionSubmissionListResponse, void>({
      query: () => API_ROUTES.myQuestionSubmissions,
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((s) => ({ type: "QuestionSubmissions" as const, id: s.id })),
              { type: "QuestionSubmissions" as const, id: "LIST" },
            ]
          : [{ type: "QuestionSubmissions" as const, id: "LIST" }],
    }),
    // Not optimistic (unlike bookmarksApi's toggle) — creation can fail with
    // 422 DISPLAY_NAME_REQUIRED (ContributeForm.tsx reads that from the
    // mutation's own `error`), so the cache is only touched once the server
    // has actually accepted the submission.
    createQuestionSubmission: builder.mutation<QuestionSubmission, CreateQuestionSubmissionRequest>({
      query: (body) => ({ url: API_ROUTES.questionSubmissions, method: "POST", body }),
      async onQueryStarted(_body, { dispatch, queryFulfilled }) {
        try {
          const { data: submission } = await queryFulfilled;
          dispatch(
            questionSubmissionsApi.util.updateQueryData("getMyQuestionSubmissions", undefined, (draft) => {
              draft.items.unshift(submission);
              draft.total += 1;
            }),
          );
        } catch {
          // no-op — ContributeForm surfaces the mutation's own error state
        }
      },
    }),
    // Author-only, only while PENDING — a non-pending id 409s
    // (SUBMISSION_NOT_PENDING), which the caller's edit/withdraw controls
    // never render for in the first place.
    updateQuestionSubmission: builder.mutation<QuestionSubmission, { id: string } & UpdateQuestionSubmissionRequest>({
      query: ({ id, ...body }) => ({ url: API_ROUTES.questionSubmission(id), method: "PATCH", body }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data: submission } = await queryFulfilled;
          dispatch(
            questionSubmissionsApi.util.updateQueryData("getMyQuestionSubmissions", undefined, (draft) => {
              const index = draft.items.findIndex((s) => s.id === id);
              if (index !== -1) draft.items[index] = submission;
            }),
          );
        } catch {
          // no-op — caller surfaces the mutation's own error state
        }
      },
    }),
    deleteQuestionSubmission: builder.mutation<void, string>({
      query: (id) => ({ url: API_ROUTES.questionSubmission(id), method: "DELETE" }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          questionSubmissionsApi.util.updateQueryData("getMyQuestionSubmissions", undefined, (draft) => {
            const index = draft.items.findIndex((s) => s.id === id);
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
  }),
});

export const {
  useGetMyQuestionSubmissionsQuery,
  useCreateQuestionSubmissionMutation,
  useUpdateQuestionSubmissionMutation,
  useDeleteQuestionSubmissionMutation,
} = questionSubmissionsApi;
