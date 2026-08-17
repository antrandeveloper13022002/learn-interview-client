import { api } from "@/lib/redux/api";
import { API_ROUTES } from "@/lib/routes";
import type { QuestionSummary } from "@/lib/types";

export const bookmarksApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // US-50/51 — `lang` is part of the query arg (not just appended to the
    // URL) so RTK Query caches per-locale; every caller passes the current
    // page's locale (useLocale()), so callers on the same page still dedupe
    // into one network request, same as before this param existed.
    getMyBookmarks: builder.query<QuestionSummary[], { lang: string }>({
      query: ({ lang }) => `${API_ROUTES.myBookmarks}?lang=${lang}`,
      providesTags: (result) =>
        result
          ? [...result.map((q) => ({ type: "Bookmarks" as const, id: q.id })), { type: "Bookmarks" as const, id: "LIST" }]
          : [{ type: "Bookmarks" as const, id: "LIST" }],
    }),
    addBookmark: builder.mutation<void, QuestionSummary & { lang: string }>({
      query: (question) => ({ url: API_ROUTES.bookmark(question.id), method: "POST" }),
      // Optimistic: the backend write is idempotent (composite-PK
      // upsert/delete — bookmark-idempotency.test.ts), so a duplicate
      // request from an aggressive double-click is harmless. Updating the
      // cache immediately (rather than waiting on invalidatesTags + a
      // refetch) is what makes the toggle feel instant instead of lagging
      // behind a real network round trip to Supabase.
      async onQueryStarted({ lang, ...question }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          bookmarksApi.util.updateQueryData("getMyBookmarks", { lang }, (draft) => {
            if (!draft.some((q) => q.id === question.id)) draft.push(question);
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),
    removeBookmark: builder.mutation<void, { questionId: string; lang: string }>({
      query: ({ questionId }) => ({ url: API_ROUTES.bookmark(questionId), method: "DELETE" }),
      async onQueryStarted({ questionId, lang }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          bookmarksApi.util.updateQueryData("getMyBookmarks", { lang }, (draft) => {
            const index = draft.findIndex((q) => q.id === questionId);
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

export const { useGetMyBookmarksQuery, useAddBookmarkMutation, useRemoveBookmarkMutation } = bookmarksApi;
