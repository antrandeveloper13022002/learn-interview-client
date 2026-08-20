"use client";

import { useId, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

      {/* Keyed by `page` so the input's local draft resets to the new
          current page after Prev/Next navigation, without an effect. */}
      <PageJumpForm key={page} page={page} totalPages={totalPages} hrefFor={hrefFor} text={text} />

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

type PageJumpFormProps = {
  page: number;
  totalPages: number;
  hrefFor: (targetPage: number) => string;
  text: ReturnType<typeof getText>;
};

function PageJumpForm({ page, totalPages, hrefFor, text }: PageJumpFormProps) {
  const router = useRouter();
  const inputId = useId();
  const [jumpValue, setJumpValue] = useState(String(page));

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const parsed = Number(jumpValue);
    if (!Number.isInteger(parsed)) return;
    const clamped = Math.min(Math.max(parsed, 1), totalPages);
    router.push(hrefFor(clamped));
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 text-sm text-text-muted">
      <label htmlFor={inputId} className="sr-only">
        {text.questions.pagination.jumpAriaLabel}
      </label>
      <span>{text.questions.pagination.pagePrefix}</span>
      <input
        id={inputId}
        type="number"
        inputMode="numeric"
        min={1}
        max={totalPages}
        value={jumpValue}
        onChange={(event) => setJumpValue(event.target.value)}
        className="min-h-11 w-16 rounded-md border border-border bg-surface px-2 text-center text-text"
      />
      <span>/ {totalPages}</span>
      <button type="submit" className="min-h-11 rounded-md border border-border px-3 font-medium text-text hover:bg-border">
        {text.questions.pagination.goButton}
      </button>
    </form>
  );
}
