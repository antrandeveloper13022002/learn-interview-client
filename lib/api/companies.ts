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

export function getCompanies(params: CompanyListParams): Promise<CompanyListResponse> {
  const query = buildQuery(params);
  return apiFetch<CompanyListResponse>(`${API_ROUTES.companies}${query}`, {
    next: { revalidate: LISTING_REVALIDATE_SECONDS },
  });
}

export function getCompanyDetail(slug: string): Promise<Company> {
  return apiFetch<Company>(API_ROUTES.companyDetail(slug), {
    next: { revalidate: LISTING_REVALIDATE_SECONDS },
  });
}
