"use client";

import { useAppSelector } from "@/lib/redux/hooks";
import { useAddBookmarkMutation, useGetMyBookmarksQuery, useRemoveBookmarkMutation } from "@/lib/redux/bookmarksApi";
import { useText } from "@/lib/text/useText";
import type { QuestionSummary } from "@/lib/types";

type BookmarkToggleProps = {
  question: QuestionSummary;
  className?: string;
};

/**
 * Guests never see this at all (a bookmark is inherently per-account) — no
 * server-rendered "locked" fallback needed here the way PremiumAnswer.tsx
 * has one, since there's nothing to show a guest in its place.
 *
 * Bookmark status has no field on QuestionSummary/QuestionDetail (checked
 * the OpenAPI schema — the only source is GET /me/bookmarks), so this cross-
 * references the cached bookmark list rather than a per-question flag from
 * the backend. `useGetMyBookmarksQuery` is called once per toggle instance
 * but RTK Query dedupes identical concurrent queries into one network
 * request, so a page with many toggles still only fetches the list once.
 */
export function BookmarkToggle({ question, className = "" }: BookmarkToggleProps) {
  const text = useText();
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const { data: bookmarks, isLoading: isLoadingBookmarks } = useGetMyBookmarksQuery(undefined, {
    skip: !accessToken,
  });
  const [addBookmark, { isLoading: isAdding }] = useAddBookmarkMutation();
  const [removeBookmark, { isLoading: isRemoving }] = useRemoveBookmarkMutation();

  if (!accessToken) return null;

  const isBookmarked = bookmarks?.some((q) => q.id === question.id) ?? false;
  // Disabled while the initial list is still loading too — otherwise a
  // question that's actually already bookmarked would render "unbookmarked"
  // for a moment and then flip once GET /me/bookmarks resolves.
  const isDisabled = isLoadingBookmarks || isAdding || isRemoving;

  function handleClick() {
    if (isDisabled) return;
    if (isBookmarked) removeBookmark(question.id);
    else addBookmark(question);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      aria-pressed={isBookmarked}
      aria-label={isBookmarked ? text.bookmarks.toggle.removeLabel : text.bookmarks.toggle.addLabel}
      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border transition-colors disabled:opacity-60 ${
        isBookmarked
          ? "border-marker-300 bg-wash-bg text-wash-text"
          : "border-border text-text-muted hover:bg-border"
      } ${className}`}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 4a1 1 0 0 0-1 1v15l7-4.5 7 4.5V5a1 1 0 0 0-1-1H6Z" />
      </svg>
    </button>
  );
}
