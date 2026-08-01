"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/lib/types";
import { text } from "@/lib/text";
import { DIFFICULTY_OPTIONS } from "@/lib/constants";

type CurrentFilters = {
  category?: string;
  difficulty?: string;
  premium?: string;
  q?: string;
};

type QuestionFiltersProps = {
  basePath: string;
  categories?: Category[];
  showCategoryFilter?: boolean;
  current: CurrentFilters;
};

export function QuestionFilters({
  basePath,
  categories = [],
  showCategoryFilter = false,
  current,
}: QuestionFiltersProps) {
  const router = useRouter();
  const [q, setQ] = useState(current.q ?? "");
  const categoryId = useId();
  const difficultyId = useId();
  const premiumId = useId();
  const searchId = useId();

  function navigate(next: Partial<CurrentFilters>) {
    const merged = { ...current, ...next };
    const params = new URLSearchParams();
    if (merged.category) params.set("category", merged.category);
    if (merged.difficulty) params.set("difficulty", merged.difficulty);
    if (merged.premium) params.set("premium", merged.premium);
    if (merged.q) params.set("q", merged.q);
    const qs = params.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate({ q: q.trim() || undefined });
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label={text.questions.filters.formAriaLabel}
      className="mt-6 flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-4 sm:flex-row sm:flex-wrap sm:items-end"
    >
      {showCategoryFilter && (
        <div className="flex flex-col gap-1">
          <label htmlFor={categoryId} className="text-sm font-medium">
            {text.questions.filters.categoryLabel}
          </label>
          <select
            id={categoryId}
            value={current.category ?? ""}
            onChange={(e) => navigate({ category: e.target.value || undefined })}
            className="min-h-11 rounded-md border border-neutral-300 px-3"
          >
            <option value="">{text.questions.filters.allCategories}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor={difficultyId} className="text-sm font-medium">
          {text.questions.filters.difficultyLabel}
        </label>
        <select
          id={difficultyId}
          value={current.difficulty ?? ""}
          onChange={(e) => navigate({ difficulty: e.target.value || undefined })}
          className="min-h-11 rounded-md border border-neutral-300 px-3"
        >
          <option value="">{text.questions.filters.allDifficulties}</option>
          {DIFFICULTY_OPTIONS.map((d) => (
            <option key={d} value={d}>
              {text.questions.difficultyLabel[d]}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor={premiumId} className="text-sm font-medium">
          {text.questions.filters.planLabel}
        </label>
        <select
          id={premiumId}
          value={current.premium ?? ""}
          onChange={(e) => navigate({ premium: e.target.value || undefined })}
          className="min-h-11 rounded-md border border-neutral-300 px-3"
        >
          <option value="">{text.questions.filters.allPlans}</option>
          <option value="false">{text.questions.filters.freePlan}</option>
          <option value="true">{text.questions.filters.premiumPlan}</option>
        </select>
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <label htmlFor={searchId} className="text-sm font-medium">
          {text.questions.filters.searchLabel}
        </label>
        <div className="flex gap-2">
          <input
            id={searchId}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={text.questions.filters.searchPlaceholder}
            className="min-h-11 w-full rounded-md border border-neutral-300 px-3"
          />
          <button
            type="submit"
            className="min-h-11 shrink-0 rounded-md border border-neutral-300 px-4 font-medium"
          >
            {text.questions.filters.searchSubmit}
          </button>
        </div>
      </div>
    </form>
  );
}
