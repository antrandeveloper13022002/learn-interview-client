"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";
import { useLocale } from "@/lib/routes/useLocale";
import { localizedPath } from "@/lib/routes/locale";

type Props = ComponentProps<typeof NextLink>;

/** Drop-in replacement for `next/link`'s `Link` that prefixes a
 * `PAGE_ROUTES`-style relative `href` (e.g. "/questions") with the current
 * `[lang]` segment. Every internal `<Link>` in this app should import from
 * here instead of "next/link" directly — see tasks/frontend-user.md FU-19.
 * Non-string hrefs (UrlObject) pass through unprefixed; none of this
 * codebase's call sites use that form today. */
export function Link({ href, ...props }: Props) {
  const lang = useLocale();
  const localizedHref = typeof href === "string" ? localizedPath(lang, href) : href;
  return <NextLink href={localizedHref} {...props} />;
}
