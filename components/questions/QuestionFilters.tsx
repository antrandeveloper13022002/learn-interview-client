"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { useText } from "@/lib/text/useText";
import { DIFFICULTY_OPTIONS } from "@/lib/constants";
import { buildFilterHref, type QuestionFilterState } from "@/lib/questionSearchParams";
import { Dropdown, type DropdownOption } from "@/components/ui/Dropdown";
import { TagMultiSelect } from "@/components/questions/TagMultiSelect";
import type { QuestionTagOption } from "@/lib/types";

// Same difficulty→color mapping as QuestionList's DIFFICULTY_BADGE_CLASS —
// the `-text` token variant (more saturated) reads better as a small solid
// dot than the `-bg` (pale) variant used for the badge fill.
const DIFFICULTY_DOT_CLASS: Record<(typeof DIFFICULTY_OPTIONS)[number], string> = {
  EASY: "bg-correct-text",
  MEDIUM: "bg-premium-text",
  HARD: "bg-flag-text",
};

type QuestionFiltersProps = {
  // Category isn't a query param here (FU-22) — it's route-level, picked
  // via TopicSidebar navigating between /questions and /categories/[slug].
  // `basePath` is whichever of those two pages is currently rendering this.
  basePath: string;
  tagOptions?: QuestionTagOption[];
  current: QuestionFilterState;
};

export function QuestionFilters({ basePath, tagOptions = [], current }: QuestionFiltersProps) {
  const router = useRouter();
  const text = useText();
  const [q, setQ] = useState(current.q ?? "");
  const difficultyId = useId();
  const premiumId = useId();
  const searchId = useId();

  const selectedTags = current.tag ?? [];

  function navigate(next: Partial<QuestionFilterState>) {
    router.push(buildFilterHref(basePath, { ...current, ...next }));
  }

  function toggleTag(name: string) {
    navigate({ tag: selectedTags.includes(name) ? selectedTags.filter((t) => t !== name) : [...selectedTags, name] });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate({ q: q.trim() || undefined });
  }

  return (
    <>
      {selectedTags.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-text-muted">{text.questions.filters.activeTagsPrefix}</span>
          {selectedTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 rounded-full bg-wash-bg px-2.5 py-1 text-xs font-medium text-wash-text"
            >
              {tag}
              <button
                type="button"
                onClick={() => toggleTag(tag)}
                aria-label={text.questions.filters.removeTagAriaLabel(tag)}
                className="text-wash-text hover:text-text"
              >
                ✕
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={() => navigate({ tag: undefined })}
            className="text-xs font-medium text-text-muted hover:text-text"
          >
            {text.questions.filters.clearTagsLabel}
          </button>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        aria-label={text.questions.filters.formAriaLabel}
        className="mt-6 flex flex-col gap-4 rounded-lg border border-border bg-surface p-4 shadow-(--shadow-border) sm:flex-row sm:flex-wrap sm:items-end"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor={difficultyId} className="text-sm font-medium text-text">
            {text.questions.filters.difficultyLabel}
          </label>
          <Dropdown
            id={difficultyId}
            value={current.difficulty ?? ""}
            placeholder={text.questions.filters.allDifficulties}
            onChange={(v) => navigate({ difficulty: v || undefined })}
            options={DIFFICULTY_OPTIONS.map(
              (d): DropdownOption => ({
                value: d,
                label: text.questions.difficultyLabel[d],
                dotClassName: DIFFICULTY_DOT_CLASS[d],
              }),
            )}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor={premiumId} className="text-sm font-medium text-text">
            {text.questions.filters.planLabel}
          </label>
          <Dropdown
            id={premiumId}
            value={current.premium ?? ""}
            placeholder={text.questions.filters.allPlans}
            onChange={(v) => navigate({ premium: v || undefined })}
            options={[
              { value: "false", label: text.questions.filters.freePlan },
              { value: "true", label: text.questions.filters.premiumPlan },
            ]}
          />
        </div>

        {tagOptions.length > 0 && (
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-text">{text.questions.filters.tagLabel}</span>
            <TagMultiSelect
              options={tagOptions}
              selected={selectedTags}
              onToggle={toggleTag}
              onClear={() => navigate({ tag: undefined })}
            />
          </div>
        )}

        <div className="flex flex-1 flex-col gap-1">
          <label htmlFor={searchId} className="text-sm font-medium text-text">
            {text.questions.filters.searchLabel}
          </label>
          <div className="flex gap-2">
            <input
              id={searchId}
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={text.questions.filters.searchPlaceholder}
              className="min-h-11 w-full rounded-md border border-border bg-surface px-3 text-text"
            />
            <button
              type="submit"
              className="min-h-11 shrink-0 rounded-md bg-marker-500 px-4 font-semibold text-ink-950 hover:bg-marker-600"
            >
              {text.questions.filters.searchSubmit}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
