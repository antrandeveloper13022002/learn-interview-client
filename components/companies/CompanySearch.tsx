"use client";

import { useCallback, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { useText } from "@/lib/text/useText";
import { PAGE_ROUTES } from "@/lib/routes";
import { SearchAutocomplete, type SearchSuggestion } from "@/components/ui/SearchAutocomplete";
import { useLazySearchCompaniesQuery } from "@/lib/redux/companiesApi";

type CompanySearchProps = {
  basePath: string;
  q?: string;
};

export function CompanySearch({ basePath, q: initialQ }: CompanySearchProps) {
  const router = useRouter();
  const text = useText();
  const [q, setQ] = useState(initialQ ?? "");
  const searchId = useId();

  const [triggerSearch] = useLazySearchCompaniesQuery();
  const fetchCompanySuggestions = useCallback(
    async (query: string): Promise<SearchSuggestion[]> => {
      const res = await triggerSearch(query).unwrap();
      return res.items.map((item) => ({
        key: item.id,
        href: PAGE_ROUTES.companyDetail(item.slug),
        primary: item.name,
        secondary: item.province?.name,
      }));
    },
    [triggerSearch],
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    const trimmed = q.trim();
    if (trimmed) params.set("q", trimmed);
    const qs = params.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath);
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label={text.companies.filters.formAriaLabel}
      className="mt-6 flex flex-col gap-1 rounded-lg border border-border bg-surface p-4 shadow-(--shadow-border) sm:flex-row sm:items-end sm:gap-2"
    >
      <div className="flex flex-1 flex-col gap-1">
        <label htmlFor={searchId} className="text-sm font-medium text-text">
          {text.companies.filters.searchLabel}
        </label>
        <SearchAutocomplete
          id={searchId}
          ariaLabel={text.companies.filters.searchLabel}
          value={q}
          onChange={setQ}
          fetchSuggestions={fetchCompanySuggestions}
          placeholder={text.companies.filters.searchPlaceholder}
        />
      </div>
      <button
        type="submit"
        className="min-h-11 shrink-0 rounded-md bg-marker-500 px-4 font-semibold text-ink-950 hover:bg-marker-600"
      >
        {text.companies.filters.searchSubmit}
      </button>
    </form>
  );
}
