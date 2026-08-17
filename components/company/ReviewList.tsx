"use client";

import { useState } from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import {
  useGetCompanyReviewsQuery,
  useDeleteCompanyReviewMutation,
  useReportCompanyReviewMutation,
} from "@/lib/redux/companyReviewApi";
import { useText } from "@/lib/text/useText";
import { useLocale } from "@/lib/routes/useLocale";
import { formatDate } from "@/lib/format";
import { StarIcon, FlagIcon } from "@/components/icons";

type ReviewListProps = { companyId: string };

const STATUS_BADGE_CLASS = {
  PENDING: "bg-wash-bg text-wash-text",
  REJECTED: "bg-flag-bg text-flag-text",
} as const;

export function ReviewList({ companyId }: ReviewListProps) {
  const text = useText();
  const lang = useLocale();
  const currentUserId = useAppSelector((s) => s.auth.user?.id);
  const isBootstrapped = useAppSelector((s) => s.auth.isBootstrapped);
  // Guests see this too (public read), so this can't skip on `!accessToken`
  // the way BookmarksView.tsx does — it only needs to wait until bootstrap
  // resolves, then fire with whatever accessToken that leaves (null or
  // real). Firing before that resolves would run as a guest even for an
  // already-logged-in visitor, permanently caching a response missing
  // their own PENDING/REJECTED reviews (real bug caught live: a real reload
  // made a just-submitted PENDING review disappear until the query was
  // re-triggered some other way).
  const { data, isLoading, isError } = useGetCompanyReviewsQuery(companyId, { skip: !isBootstrapped });
  const [deleteReview] = useDeleteCompanyReviewMutation();
  const [reportReview] = useReportCompanyReviewMutation();
  // BE-38's report endpoint gives no signal distinguishing "first report"
  // from "already reported" — this only tracks the current session, reset
  // on reload (documented in companyReviewApi.ts).
  const [reportedIds, setReportedIds] = useState<Set<string>>(new Set());

  if (!isBootstrapped || isLoading) {
    return <p className="text-sm text-text-muted">{text.common.loading}</p>;
  }
  if (isError) {
    return (
      <p role="alert" className="text-sm text-flag-text">
        {text.common.genericErrorBody}
      </p>
    );
  }
  if (!data || data.items.length === 0) {
    return <p className="text-sm text-text-muted">{text.companies.reviews.emptyBody}</p>;
  }

  async function handleReport(reviewId: string) {
    if (reportedIds.has(reviewId)) return;
    try {
      await reportReview({ reviewId }).unwrap();
      setReportedIds((prev) => new Set(prev).add(reviewId));
    } catch {
      // Reporting is a low-stakes secondary action — no dedicated error UI.
    }
  }

  async function handleDelete(reviewId: string) {
    await deleteReview({ reviewId, companyId });
  }

  return (
    <ul className="flex flex-col gap-4">
      {data.items.map((review) => {
        // Only reliable when not anonymous — an anonymous review always has
        // userId: null, even in the author's own view (server-enforced,
        // review.dto.ts on the backend). No way to reliably badge "yours"
        // for an anonymous review after a reload; not invented here.
        const isMine = currentUserId !== undefined && review.userId === currentUserId;
        const isReported = reportedIds.has(review.id);

        return (
          <li key={review.id} className="rounded-lg border border-border bg-surface p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1" aria-label={text.companies.reviews.ratingAriaLabel(review.rating)}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <StarIcon
                    key={value}
                    filled={value <= review.rating}
                    className={`size-4 ${value <= review.rating ? "text-marker-500" : "text-border"}`}
                  />
                ))}
              </div>
              <span className="text-xs text-text-muted">{formatDate(review.createdAt, lang)}</span>
            </div>

            {review.status !== "APPROVED" && (
              <span
                className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE_CLASS[review.status]}`}
              >
                {text.companies.reviews.status[review.status]}
              </span>
            )}

            <p className="mt-2 whitespace-pre-wrap text-sm text-text">{review.content}</p>

            {review.adminReply && (
              <div className="mt-3 rounded-md bg-wash-bg p-3 text-sm text-wash-text">
                <p className="font-semibold">{text.companies.reviews.adminReplyLabel}</p>
                <p className="mt-1">{review.adminReply}</p>
              </div>
            )}

            <div className="mt-3 flex items-center gap-3 text-sm">
              {isMine ? (
                <button
                  type="button"
                  onClick={() => handleDelete(review.id)}
                  className="font-medium text-flag-text hover:underline"
                >
                  {text.companies.reviews.deleteLabel}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleReport(review.id)}
                  disabled={isReported}
                  className="inline-flex items-center gap-1 font-medium text-text-muted hover:text-text disabled:opacity-60"
                >
                  <FlagIcon className="size-4" />
                  {isReported ? text.companies.reviews.reportedLabel : text.companies.reviews.reportLabel}
                </button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
