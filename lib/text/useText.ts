"use client";

import { useLocale } from "@/lib/routes/useLocale";
import { getText, type TextDictionary } from "./index";

/** Locale-aware `text` for Client Components — reads the current `[lang]`
 * segment via `useLocale()`. Server Components should call `getText(lang)`
 * directly with the `lang` they already have from `params` instead. */
export function useText(): TextDictionary {
  const lang = useLocale();
  return getText(lang);
}
