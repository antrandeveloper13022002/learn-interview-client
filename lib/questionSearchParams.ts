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

/**
 * Shared by /questions and /categories/[slug]'s `generateMetadata` — both
 * canonicalize the same way (keep category/difficulty/premium/page, drop
 * free-text `q`; see FU-05's canonical-strategy note in
 * tasks/frontend-user.md for why `q` is excluded).
 */
export function buildQuestionListCanonical(
  basePath: string,
  filters: { category?: string; difficulty?: Difficulty; premium?: boolean; page: number },
): string {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.difficulty) params.set("difficulty", filters.difficulty);
  if (filters.premium !== undefined) params.set("premium", String(filters.premium));
  if (filters.page > 1) params.set("page", String(filters.page));
  const qs = params.toString();
  return `${basePath}${qs ? `?${qs}` : ""}`;
}
