import Link from "next/link";
import { getText } from "@/lib/text";
import type { Locale } from "@/lib/routes/locale";

type PaginationProps = {
  basePath: string;
  // A repeated key (e.g. `?tag=a&tag=b`, FU-22) arrives as a real array
  // from Next.js's searchParams — must fan out to one `.append()` per
  // entry, not coerce to a single comma-joined value via `.set()`.
  searchParams: Record<string, string | string[] | undefined>;
  page: number;
  pageSize: number;
  total: number;
  lang: Locale;
};

export function Pagination({ basePath, searchParams, page, pageSize, total, lang }: PaginationProps) {
  const text = getText(lang);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  function hrefFor(targetPage: number): string {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (key === "page" || !value) continue;
      if (Array.isArray(value)) {
        for (const v of value) params.append(key, v);
        continue;
      }
      params.set(key, value);
    }
    if (targetPage > 1) params.set("page", String(targetPage));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  const isFirstPage = page <= 1;
  const isLastPage = page >= totalPages;

  return (
    <nav aria-label={text.questions.pagination.ariaLabel} className="mt-8 flex items-center justify-between">
      {isFirstPage ? (
        <span aria-disabled="true" className="min-h-11 rounded-md border border-border px-4 py-2 text-text-muted opacity-60">
          {text.questions.pagination.prev}
        </span>
      ) : (
        <Link href={hrefFor(page - 1)} className="min-h-11 rounded-md border border-border px-4 py-2 font-medium text-text hover:bg-border">
          {text.questions.pagination.prev}
        </Link>
      )}
      <span className="text-sm text-text-muted">{text.questions.pagination.pageOf(page, totalPages)}</span>
      {isLastPage ? (
        <span aria-disabled="true" className="min-h-11 rounded-md border border-border px-4 py-2 text-text-muted opacity-60">
          {text.questions.pagination.next}
        </span>
      ) : (
        <Link href={hrefFor(page + 1)} className="min-h-11 rounded-md border border-border px-4 py-2 font-medium text-text hover:bg-border">
          {text.questions.pagination.next}
        </Link>
      )}
    </nav>
  );
}
