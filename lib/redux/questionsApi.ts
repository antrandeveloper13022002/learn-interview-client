import { api } from "@/lib/redux/api";
import { API_ROUTES } from "@/lib/routes";
import type { QuestionDetail, QuestionListResponse } from "@/lib/types";

export const questionsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getQuestionDetail: builder.query<QuestionDetail, { slug: string; lang: string }>({
      query: ({ slug, lang }) => `${API_ROUTES.questionDetail(slug)}?lang=${lang}`,
    }),
    // Typeahead suggestions for QuestionFilters' search box — same Postgres
    // FTS-backed /questions endpoint the full search already uses, just a
    // small pageSize and triggered on-demand (useLazyQuery) instead of on
    // mount. Not Elasticsearch — the existing search backend already
    // supports this, per project_search_decision.
    searchQuestions: builder.query<QuestionListResponse, { q: string; lang: string }>({
      query: ({ q, lang }) => `${API_ROUTES.questions}?q=${encodeURIComponent(q)}&pageSize=6&lang=${lang}`,
    }),
  }),
});

export const { useGetQuestionDetailQuery, useLazySearchQuestionsQuery } = questionsApi;
