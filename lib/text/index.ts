import { vi } from "./vi";
import { en } from "./en";
import type { Locale } from "@/lib/routes/locale";

// i18n opened 2026-08-06 (US-50, docs/business/vision.md#phase-amendment--2026-08-06).
// A single module-level `text` constant can't work once /vi and /en are
// real, concurrently-served routes in the same server process — use
// `getText(lang)` (Server Components, which already have `params.lang`) or
// `useText()` (Client Components, via lib/routes/useLocale.ts) instead.
// Never import `vi`/`en` directly from a component.

// `vi.ts`/`en.ts` both use `as const`, so `typeof vi` narrows every string
// leaf to its literal Vietnamese text — `en` (different literal strings)
// can never structurally satisfy that as-is. Widen leaves back to `string`
// (and function leaves' return types) so the two dictionaries are checked
// for matching *shape*, not matching *content*.
type Widen<T> = T extends (...args: infer A) => infer R
  ? (...args: A) => Widen<R>
  : T extends string
    ? string
    : T extends object
      ? { [K in keyof T]: Widen<T[K]> }
      : T;

export type TextDictionary = Widen<typeof vi>;

const dictionaries = { vi, en } satisfies Record<Locale, TextDictionary>;

export function getText(lang: Locale): TextDictionary {
  return dictionaries[lang];
}
