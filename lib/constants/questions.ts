// `as const` (not `Difficulty[]`) so lib/types/questions.ts can derive the
// `Difficulty` type from this array's literal values — this is the single
// source of truth for both the runtime option list and the compile-time
// union, instead of maintaining the same 3 strings in two places.
export const DIFFICULTY_OPTIONS = ["EASY", "MEDIUM", "HARD"] as const;

// Duplicated as a literal in questions/page.tsx and categories/[slug]/page.tsx
// before this refactor — single source now so the two listing pages can't
// silently drift to different page sizes.
export const QUESTION_LIST_PAGE_SIZE = 20;

/** Public catalog content is admin-driven and changes infrequently — short-TTL ISR, not per-request SSR. */
export const LISTING_REVALIDATE_SECONDS = 60;
