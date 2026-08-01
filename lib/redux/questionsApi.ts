import { api } from "@/lib/redux/api";
import { API_ROUTES } from "@/lib/routes";
import type { QuestionDetail } from "@/lib/types";

export const questionsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getQuestionDetail: builder.query<QuestionDetail, string>({
      query: (slug) => API_ROUTES.questionDetail(slug),
    }),
  }),
});

export const { useGetQuestionDetailQuery } = questionsApi;
