import type { Difficulty } from "@/lib/types";
import { DIFFICULTY_OPTIONS } from "@/lib/constants";

export function parseDifficulty(value?: string): Difficulty | undefined {
  return (DIFFICULTY_OPTIONS as readonly string[]).includes(value as Difficulty)
    ? (value as Difficulty)
    : undefined;
}

export function parsePremium(value?: string): boolean | undefined {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

export function parsePage(value?: string): number {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : 1;
}

// Next.js's `searchParams` gives a plain string for one `?tag=a`, and a
// real array for repeated keys (`?tag=a&tag=b`) — normalize to always-array
// so every caller (sidebar, multi-select, canonical builder) agrees on one
// shape (FU-22).
export function parseTags(value?: string | string[]): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

/**
 * Shared by /questions and /categories/[slug]'s `generateMetadata` — both
 * canonicalize the same way (keep category/difficulty/premium/tag/page,
 * drop free-text `q`; see FU-05's canonical-strategy note in
 * tasks/frontend-user.md for why `q` is excluded). `tag` (BE-54/FU-21,
 * multi-value since FU-22) is a structured filter dimension like the
 * others, not free text, so it's included the same way.
 */
export function buildQuestionListCanonical(
  basePath: string,
  filters: { category?: string; difficulty?: Difficulty; premium?: boolean; tag?: string[]; page: number },
): string {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.difficulty) params.set("difficulty", filters.difficulty);
  if (filters.premium !== undefined) params.set("premium", String(filters.premium));
  for (const t of filters.tag ?? []) params.append("tag", t);
  if (filters.page > 1) params.set("page", String(filters.page));
  const qs = params.toString();
  return `${basePath}${qs ? `?${qs}` : ""}`;
}

export type QuestionFilterState = {
  difficulty?: string;
  premium?: string;
  tag?: string[];
  q?: string;
};

/**
 * Shared URL builder for client-side filter navigation — the sidebar's
 * topic links, the tag multi-select, and a question card's own clickable
 * tag chips all need to build "current filters, with one dimension
 * changed" the same way, so they agree on one URL shape rather than each
 * re-deriving it (FU-22). Never includes `page` — changing any filter
 * dimension implicitly resets to page 1 by omitting it, same as
 * QuestionFilters' own pre-existing `navigate()` behavior.
 */
export function buildFilterHref(basePath: string, filters: QuestionFilterState): string {
  const params = new URLSearchParams();
  if (filters.difficulty) params.set("difficulty", filters.difficulty);
  if (filters.premium) params.set("premium", filters.premium);
  for (const t of filters.tag ?? []) params.append("tag", t);
  if (filters.q) params.set("q", filters.q);
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}
