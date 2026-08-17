import { Link } from "@/components/i18n/LocaleLink";
import type { Category, Difficulty, QuestionSummary } from "@/lib/types";
import { getText } from "@/lib/text";
import type { Locale } from "@/lib/routes/locale";
import { PAGE_ROUTES } from "@/lib/routes";
import { buildFilterHref, type QuestionFilterState } from "@/lib/questionSearchParams";
import { BookmarkToggle } from "@/components/questions/BookmarkToggle";

type QuestionListProps = {
  questions: QuestionSummary[];
  categories: Category[];
  /** 0-based offset of the first item on this page, for the #001-style row number. */
  startIndex?: number;
  lang: Locale;
  /** Current page's own path (/questions or /categories/[slug]) and active
   * filters — a tag chip toggles itself into/out of this same filter set
   * rather than navigating to a fixed /questions?tag=… (FU-22). Pass the
   * RAW `PAGE_ROUTES` path here, not `localizedPath(lang, ...)` — this
   * component renders via `LocaleLink`, which prefixes the locale itself;
   * passing an already-localized path double-prefixes it (/vi/vi/...). */
  basePath: string;
  currentFilters: QuestionFilterState;
};

// Difficulty reuses the mockup's badge-easy/medium/hard palette: correct
// (green) for easy, premium/marker (amber) for medium, flag (red) for hard.
// Exported so the question-detail page's badges stay visually identical.
export const DIFFICULTY_BADGE_CLASS: Record<Difficulty, string> = {
  EASY: "bg-correct-bg text-correct-text",
  MEDIUM: "bg-premium-bg text-premium-text",
  HARD: "bg-flag-bg text-flag-text",
};

export function QuestionList({ questions, categories, startIndex = 0, lang, basePath, currentFilters }: QuestionListProps) {
  const text = getText(lang);
  const selectedTags = currentFilters.tag ?? [];

  function tagHref(tag: string): string {
    const nextTags = selectedTags.includes(tag) ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag];
    return buildFilterHref(basePath, { ...currentFilters, tag: nextTags });
  }

  if (questions.length === 0) {
    return (
      <div role="status" className="mt-8 rounded-lg border border-dashed border-border p-10 text-center">
        <p className="font-semibold text-text">{text.questions.list.emptyTitle}</p>
        <p className="mt-2 text-sm text-text-muted">{text.questions.list.emptyBody}</p>
      </div>
    );
  }

  const categoryById = new Map(categories.map((c) => [c.id, c]));

  return (
    <ul className="mt-8 flex flex-col gap-3">
      {questions.map((question, i) => {
        const category = categoryById.get(question.categoryId);
        return (
          <li
            key={question.id}
            className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-4 shadow-(--shadow-border) hover:shadow-(--shadow-border-hover)"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <Link href={PAGE_ROUTES.questionDetail(question.slug)} className="flex-1">
                <span className="font-mono text-xs text-text-muted">#{String(startIndex + i + 1).padStart(3, "0")}</span>
                <p className="font-medium text-text">{question.title}</p>
                {category && <p className="mt-1 text-sm text-text-muted">{category.name}</p>}
              </Link>
              <div className="flex shrink-0 items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${DIFFICULTY_BADGE_CLASS[question.difficulty]}`}>
                  {text.questions.difficultyLabel[question.difficulty]}
                </span>
                {question.isPremium && (
                  <span className="rounded-full bg-premium-bg px-3 py-1 text-xs font-medium text-premium-text">
                    {text.common.premiumBadge}
                  </span>
                )}
                <BookmarkToggle question={question} />
              </div>
            </div>
            {/* Siblings of the card's main Link above, never nested inside
                it — an <a> inside another <a> is invalid HTML and breaks
                the outer link, so each tag gets its own row instead. */}
            {question.tags.length > 0 && (
              <ul className="flex flex-wrap gap-1.5">
                {question.tags.map((tag) => {
                  const active = selectedTags.includes(tag);
                  return (
                    <li key={tag}>
                      <Link
                        href={tagHref(tag)}
                        className={`rounded-full px-2 py-0.5 text-xs font-medium transition-colors ${
                          active ? "bg-marker-500 text-ink-950" : "bg-wash-bg text-wash-text hover:bg-wash-bg/80"
                        }`}
                      >
                        {tag}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}
