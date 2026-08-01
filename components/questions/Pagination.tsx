import Link from "next/link";
import { text } from "@/lib/text";

type PaginationProps = {
  basePath: string;
  searchParams: Record<string, string | undefined>;
  page: number;
  pageSize: number;
  total: number;
};

export function Pagination({ basePath, searchParams, page, pageSize, total }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  function hrefFor(targetPage: number): string {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (key === "page" || !value) continue;
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
        <span
          aria-disabled="true"
          className="min-h-11 rounded-md border border-neutral-200 px-4 py-2 text-neutral-400"
        >
          {text.questions.pagination.prev}
        </span>
      ) : (
        <Link
          href={hrefFor(page - 1)}
          className="min-h-11 rounded-md border border-neutral-300 px-4 py-2 font-medium"
        >
          {text.questions.pagination.prev}
        </Link>
      )}
      <span className="text-sm text-neutral-600">{text.questions.pagination.pageOf(page, totalPages)}</span>
      {isLastPage ? (
        <span
          aria-disabled="true"
          className="min-h-11 rounded-md border border-neutral-200 px-4 py-2 text-neutral-400"
        >
          {text.questions.pagination.next}
        </span>
      ) : (
        <Link
          href={hrefFor(page + 1)}
          className="min-h-11 rounded-md border border-neutral-300 px-4 py-2 font-medium"
        >
          {text.questions.pagination.next}
        </Link>
      )}
    </nav>
  );
}
