import { apiFetch } from "@/lib/api/client";
import { LISTING_REVALIDATE_SECONDS } from "@/lib/constants";
import { API_ROUTES } from "@/lib/routes";
import type { Category, QuestionDetail, QuestionListParams, QuestionListResponse } from "@/lib/types";

function buildQuery(params: Record<string, string | number | boolean | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") continue;
    search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export function getCategories(): Promise<Category[]> {
  return apiFetch<Category[]>(API_ROUTES.categories, {
    next: { revalidate: LISTING_REVALIDATE_SECONDS },
  });
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug);
}

export async function getCategoryById(id: string): Promise<Category | undefined> {
  const categories = await getCategories();
  return categories.find((c) => c.id === id);
}

export function getQuestions(params: QuestionListParams): Promise<QuestionListResponse> {
  const query = buildQuery(params);
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
export function getQuestionDetail(slug: string): Promise<QuestionDetail> {
  return apiFetch<QuestionDetail>(API_ROUTES.questionDetail(slug), {
    next: { revalidate: LISTING_REVALIDATE_SECONDS },
  });
}
