import { apiFetch } from "@/lib/api/client";
import { LISTING_REVALIDATE_SECONDS } from "@/lib/constants";
import { API_ROUTES } from "@/lib/routes";
import type { Category, QuestionDetail, QuestionListParams, QuestionListResponse, QuestionTagOption } from "@/lib/types";

function buildQuery(params: Record<string, string | number | boolean | string[] | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") continue;
    // Repeated key per array entry (`?tag=a&tag=b`) — matches the backend's
    // Express 5 "simple" query-parser expectation (FU-22).
    if (Array.isArray(value)) {
      for (const v of value) search.append(key, v);
      continue;
    }
    search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

// `lang` is a separate parameter, not folded into the filter param types —
// it's a locale concern resolved server-side (US-50/51), not a filter.
export function getCategories(lang: string): Promise<Category[]> {
  return apiFetch<Category[]>(`${API_ROUTES.categories}?lang=${lang}`, {
    next: { revalidate: LISTING_REVALIDATE_SECONDS },
  });
}

export function getQuestionTags(): Promise<QuestionTagOption[]> {
  return apiFetch<QuestionTagOption[]>(API_ROUTES.questionTags, {
    next: { revalidate: LISTING_REVALIDATE_SECONDS },
  });
}

export async function getCategoryBySlug(slug: string, lang: string): Promise<Category | undefined> {
  const categories = await getCategories(lang);
  return categories.find((c) => c.slug === slug);
}

export async function getCategoryById(id: string, lang: string): Promise<Category | undefined> {
  const categories = await getCategories(lang);
  return categories.find((c) => c.id === id);
}

export function getQuestions(params: QuestionListParams, lang: string): Promise<QuestionListResponse> {
  const query = buildQuery({ ...params, lang });
  return apiFetch<QuestionListResponse>(`${API_ROUTES.questions}${query}`, {
    next: { revalidate: LISTING_REVALIDATE_SECONDS },
  });
}

/**
 * Guest-scoped (lib/api/client.ts never forwards a session — FU-03's
 * decision), so for a premium question this always comes back without
 * `answer` even if the visitor happens to be an entitled subscriber. The
 * client-side re-check for a logged-in visitor lives in
 * components/questions/PremiumAnswer.tsx via lib/redux/questionsApi.ts.
 */
export function getQuestionDetail(slug: string, lang: string): Promise<QuestionDetail> {
  return apiFetch<QuestionDetail>(`${API_ROUTES.questionDetail(slug)}?lang=${lang}`, {
    next: { revalidate: LISTING_REVALIDATE_SECONDS },
  });
}
