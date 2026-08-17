import { api } from "@/lib/redux/api";
import { API_ROUTES } from "@/lib/routes";
import type { CompanyListResponse } from "@/lib/types";

export const companiesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Typeahead suggestions for CompanySearch's search box — same
    // Postgres FTS-backed /companies endpoint the full search already
    // uses, just a small pageSize and triggered on-demand instead of on
    // mount.
    searchCompanies: builder.query<CompanyListResponse, string>({
      query: (q) => `${API_ROUTES.companies}?q=${encodeURIComponent(q)}&pageSize=6`,
    }),
  }),
});

export const { useLazySearchCompaniesQuery } = companiesApi;
