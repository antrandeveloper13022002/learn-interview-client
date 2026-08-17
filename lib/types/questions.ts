import type { DIFFICULTY_OPTIONS } from "@/lib/constants";

// Derived from the constant array (not redeclared as its own literal union)
// so the two can never drift apart — see lib/constants/questions.ts.
export type Difficulty = (typeof DIFFICULTY_OPTIONS)[number];

export type Category = {
  id: string;
  name: string;
  slug: string;
  questionCount: number;
};

export type QuestionTagOption = {
  id: string;
  name: string;
  questionCount: number;
};

export type QuestionSummary = {
  id: string;
  slug: string;
  title: string;
  difficulty: Difficulty;
  isPremium: boolean;
  categoryId: string;
  // Confirmed 2026-08-06 (BE-51/52) — fixed taxonomy, tag names not objects.
  tags: string[];
};

export type QuestionListResponse = {
  items: QuestionSummary[];
  total: number;
  page: number;
  pageSize: number;
};

/**
 * `answer` is only ever present when the requester is entitled — the
 * backend omits the key entirely otherwise (never sends null/blank as a
 * disguised-empty value). See business-rule.md#premium-gating.
 */
/**
 * Set from BE-60 — present (with the contributor's `displayName`) only for
 * a question published from an approved QuestionSubmission; `null` for the
 * existing admin-authored catalog.
 */
export type QuestionDetail = QuestionSummary & {
  hasAnswer: boolean;
  answer?: string;
  // Opened 2026-08-13 — optional, same premium-gating as `answer` (present
  // only when `answer` is). A question may have neither, either, or both.
  codeDemo?: { language: string; code: string };
  note?: { title: string | null; items: string[] };
  // Not gated — always present (possibly empty), unlike answer/codeDemo/note.
  referenceLinks: { title: string; url: string }[];
  contributor: { displayName: string } | null;
};

export type QuestionListParams = {
  categoryId?: string;
  difficulty?: Difficulty;
  isPremium?: boolean;
  // Tag name(s), not id — matches QuestionSummary.tags' shape (BE-54).
  // Multiple tags are AND-matched server-side (FU-22).
  tag?: string[];
  q?: string;
  page?: number;
  pageSize?: number;
};
