"use client";

import { Link } from "@/components/i18n/LocaleLink";
import { useAppSelector } from "@/lib/redux/hooks";
import { useGetMyBookmarksQuery } from "@/lib/redux/bookmarksApi";
import { BookmarkToggle } from "@/components/questions/BookmarkToggle";
import { DIFFICULTY_BADGE_CLASS } from "@/components/questions/QuestionList";
import { SkeletonGroup, Skeleton } from "@/components/Skeleton";
import { useText } from "@/lib/text/useText";
import { PAGE_ROUTES } from "@/lib/routes";

/**
 * Fully client-rendered — this route has no Server Component data fetch to
 * match (unlike PremiumAnswer.tsx, which mirrors an SSR-rendered locked
 * state). Gating on `isBootstrapped` rather than `accessToken` alone is
 * therefore the right call here, not the reverse: a real logged-in visitor
 * loading this page directly would otherwise flash the "sign in" prompt for
 * the moment before SessionBootstrap's silent refresh resolves.
 */
export function BookmarksView() {
  const text = useText();
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const isBootstrapped = useAppSelector((s) => s.auth.isBootstrapped);
  const { data, isLoading, isError, refetch } = useGetMyBookmarksQuery(undefined, { skip: !accessToken });

  if (!isBootstrapped) {
    return (
      <SkeletonGroup label={text.bookmarks.list.loadingSrOnly}>
        <div className="mt-8 flex flex-col gap-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </SkeletonGroup>
    );
  }

  if (!accessToken) {
    return (
      <div className="mt-8 rounded-lg border border-dashed border-border p-10 text-center">
        <p className="font-semibold text-text">{text.bookmarks.list.signedOutTitle}</p>
        <p className="mt-2 text-sm text-text-muted">{text.bookmarks.list.signedOutBody}</p>
        <Link
          href={PAGE_ROUTES.login}
          className="mt-4 inline-block min-h-11 rounded-md bg-marker-500 px-5 py-2 font-semibold text-ink-950 hover:bg-marker-600"
        >
          {text.auth.login.submitLabel}
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <SkeletonGroup label={text.bookmarks.list.loadingSrOnly}>
        <div className="mt-8 flex flex-col gap-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </SkeletonGroup>
    );
  }

  if (isError) {
    return (
      <div role="alert" className="mt-8 rounded-lg border border-border bg-bg p-10 text-center">
        <p className="font-semibold text-text">{text.bookmarks.list.errorTitle}</p>
        <p className="mt-2 text-sm text-text-muted">{text.bookmarks.list.errorBody}</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 min-h-11 rounded-md border border-border px-5 py-2 font-medium text-text hover:bg-border"
        >
          {text.common.retryLabel}
        </button>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="mt-8 rounded-lg border border-dashed border-border p-10 text-center">
        <p className="font-semibold text-text">{text.bookmarks.list.emptyTitle}</p>
        <p className="mt-2 text-sm text-text-muted">{text.bookmarks.list.emptyBody}</p>
        <Link href={PAGE_ROUTES.questions} className="mt-4 inline-block text-sm font-medium text-marker-700">
          {text.bookmarks.list.browseQuestionsLink}
        </Link>
      </div>
    );
  }

  return (
    <ul className="mt-8 flex flex-col gap-3">
      {data.map((question) => (
        <li
          key={question.id}
          className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-4 shadow-(--shadow-border) sm:flex-row sm:items-center sm:justify-between"
        >
          <Link href={PAGE_ROUTES.questionDetail(question.slug)} className="flex-1 text-text hover:underline">
            {question.title}
          </Link>
          <div className="flex shrink-0 items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${DIFFICULTY_BADGE_CLASS[question.difficulty]}`}>
              {text.questions.difficultyLabel[question.difficulty]}
            </span>
            {question.isPremium && (
              <span className="rounded-full bg-premium-bg px-3 py-1 text-xs font-medium text-premium-text">
                {text.common.premiumBadge}
              </span>
            )}
            <BookmarkToggle question={question} />
          </div>
        </li>
      ))}
    </ul>
  );
}
