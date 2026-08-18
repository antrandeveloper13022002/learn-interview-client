import { api } from "@/lib/redux/api";
import { API_ROUTES } from "@/lib/routes";

/** Category ids the caller has marked "currently studying" (FU-22) — mirrors
 * bookmarksApi.ts's shape exactly, one level up (Category instead of Question). */
export const studyMarksApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMyStudiedCategories: builder.query<string[], void>({
      query: () => API_ROUTES.myStudiedCategories,
      providesTags: (result) =>
        result
          ? [...result.map((id) => ({ type: "StudiedCategories" as const, id })), { type: "StudiedCategories" as const, id: "LIST" }]
          : [{ type: "StudiedCategories" as const, id: "LIST" }],
    }),
    markCategoryStudying: builder.mutation<void, string>({
      query: (categoryId) => ({ url: API_ROUTES.categoryStudyMark(categoryId), method: "POST" }),
      // Optimistic, same reasoning as bookmarksApi.ts's addBookmark — the
      // backend write is an idempotent composite-PK upsert, so a duplicate
      // from a fast double-click is harmless.
      async onQueryStarted(categoryId, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          // unshift, not push — the backend orders this list most-recently
          // -marked-first (interview.repository.ts's findStudiedCategoryIds),
          // and a fresh mark is the most recent one by definition.
          studyMarksApi.util.updateQueryData("getMyStudiedCategories", undefined, (draft) => {
            if (!draft.includes(categoryId)) draft.unshift(categoryId);
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),
    unmarkCategoryStudying: builder.mutation<void, string>({
      query: (categoryId) => ({ url: API_ROUTES.categoryStudyMark(categoryId), method: "DELETE" }),
      async onQueryStarted(categoryId, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          studyMarksApi.util.updateQueryData("getMyStudiedCategories", undefined, (draft) => {
            const index = draft.indexOf(categoryId);
            if (index !== -1) draft.splice(index, 1);
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

export const { useGetMyStudiedCategoriesQuery, useMarkCategoryStudyingMutation, useUnmarkCategoryStudyingMutation } =
  studyMarksApi;
