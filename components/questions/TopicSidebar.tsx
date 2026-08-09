import { Link } from "@/components/i18n/LocaleLink";
import { PAGE_ROUTES } from "@/lib/routes";
import { buildFilterHref, type QuestionFilterState } from "@/lib/questionSearchParams";
import { getText } from "@/lib/text";
import type { Locale } from "@/lib/routes/locale";
import type { Category } from "@/lib/types";
import { StudyMarkButton } from "@/components/questions/StudyMarkButton";

type TopicSidebarProps = {
  categories: Category[];
  totalQuestionCount: number;
  /** undefined on /questions (no category chosen); the category's slug on /categories/[slug]. */
  selectedSlug?: string;
  /** Every non-category filter currently active, preserved when switching topic. */
  otherFilters: QuestionFilterState;
  lang: Locale;
};

/**
 * Desktop-only persistent topic list, replacing the old "Chủ đề" dropdown
 * (FU-22) — real `<Link>`s to `/questions` or `/categories/[slug]` rather
 * than client-side state, so switching topic stays a normal, crawlable
 * navigation. See `MobileTopicChips` for the small-viewport equivalent.
 */
export function TopicSidebar({ categories, totalQuestionCount, selectedSlug, otherFilters, lang }: TopicSidebarProps) {
  const text = getText(lang);

  return (
    <nav
      aria-label={text.questions.filters.categoryLabel}
      className="hidden w-65 shrink-0 self-start border-r border-border bg-surface py-6 lg:block"
    >
      <h2 className="px-4 font-mono text-xs font-semibold tracking-widest text-text-muted uppercase">
        {text.questions.filters.categoryLabel}
      </h2>

      <ul className="mt-4 px-2">
        <li>
          <TopicRow
            href={buildFilterHref(PAGE_ROUTES.questions, otherFilters)}
            label={text.questions.filters.allCategories}
            count={totalQuestionCount}
            active={!selectedSlug}
          />
        </li>
      </ul>

      <div className="mx-4 my-2 h-px bg-border" />

      <ul className="px-2">
        {categories.map((c) => (
          <li key={c.id}>
            <TopicRow
              href={buildFilterHref(PAGE_ROUTES.category(c.slug), otherFilters)}
              label={c.name}
              count={c.questionCount}
              active={selectedSlug === c.slug}
              categoryId={c.id}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}

function TopicRow({
  href,
  label,
  count,
  active,
  categoryId,
}: {
  href: string;
  label: string;
  count: number;
  active: boolean;
  /** Omitted for the "all topics" row — studying doesn't apply there. */
  categoryId?: string;
}) {
  return (
    <div
      className={`relative flex min-h-11 items-center rounded-lg transition-colors ${
        active ? "bg-marker-100" : "hover:bg-wash-bg"
      }`}
    >
      {active && <span className="absolute inset-y-1 left-0 w-0.75 rounded-r-full bg-marker-500" />}
      <Link href={href} className={`flex flex-1 items-center gap-2.5 py-2.5 pl-4 text-[15px] ${active ? "font-semibold text-text" : "font-normal text-text"}`}>
        <span className="flex-1">{label}</span>
        <span className="font-mono text-xs text-text-muted">{count}</span>
      </Link>
      {categoryId && <StudyMarkButton categoryId={categoryId} className="mr-1" />}
    </div>
  );
}
