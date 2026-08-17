import { Link } from "@/components/i18n/LocaleLink";
import { PAGE_ROUTES } from "@/lib/routes";
import { buildFilterHref, type QuestionFilterState } from "@/lib/questionSearchParams";
import { getText } from "@/lib/text";
import type { Locale } from "@/lib/routes/locale";
import type { Category } from "@/lib/types";

type MobileTopicChipsProps = {
  categories: Category[];
  selectedSlug?: string;
  otherFilters: QuestionFilterState;
  lang: Locale;
};

/** Small-viewport equivalent of `TopicSidebar` — a horizontally scrollable chip row (FU-22). */
export function MobileTopicChips({ categories, selectedSlug, otherFilters, lang }: MobileTopicChipsProps) {
  const text = getText(lang);

  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:hidden" style={{ scrollbarWidth: "none" }}>
      <Chip href={buildFilterHref(PAGE_ROUTES.questions, otherFilters)} label={text.questions.filters.allCategories} active={!selectedSlug} />
      {categories.map((c) => (
        <Chip
          key={c.id}
          href={buildFilterHref(PAGE_ROUTES.category(c.slug), otherFilters)}
          label={c.name}
          active={selectedSlug === c.slug}
        />
      ))}
    </div>
  );
}

function Chip({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex min-h-9 shrink-0 items-center rounded-full border px-3 py-2 text-sm whitespace-nowrap transition-colors ${
        active ? "border-marker-500 bg-marker-500 font-semibold text-ink-950" : "border-border bg-surface text-text"
      }`}
    >
      {label}
    </Link>
  );
}
