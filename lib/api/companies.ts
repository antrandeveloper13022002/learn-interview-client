import { apiFetch } from "@/lib/api/client";
import { LISTING_REVALIDATE_SECONDS } from "@/lib/constants";
import { API_ROUTES } from "@/lib/routes";
import type { Company, CompanyListParams, CompanyListResponse } from "@/lib/types";

function buildQuery(params: Record<string, string | number | boolean | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") continue;
    search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

// `lang` is a separate parameter, not folded into `CompanyListParams` — it's
// a locale concern resolved server-side (US-50/51), not a filter.
export function getCompanies(params: CompanyListParams, lang: string): Promise<CompanyListResponse> {
  const query = buildQuery({ ...params, lang });
  return apiFetch<CompanyListResponse>(`${API_ROUTES.companies}${query}`, {
    next: { revalidate: LISTING_REVALIDATE_SECONDS },
  });
}

export function getCompanyDetail(slug: string, lang: string): Promise<Company> {
  return apiFetch<Company>(`${API_ROUTES.companyDetail(slug)}?lang=${lang}`, {
    next: { revalidate: LISTING_REVALIDATE_SECONDS },
  });
}
