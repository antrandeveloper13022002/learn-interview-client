"use client";

import { useState } from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import { useGetAnswerRatingQuery, useUpsertAnswerRatingMutation } from "@/lib/redux/answerCommentsApi";
import { useText } from "@/lib/text/useText";
import { StarIcon } from "@/components/icons";

type RatingWidgetProps = { answerId: string };

/**
 * Read (summary) is public; the interactive star row that upserts the
 * caller's own score only renders when logged in — same "read is public,
 * write needs auth" split as ReviewForm/ReviewList, just without a
 * separate login-prompt block since rating isn't the primary CTA on this
 * page the way writing a review is on the company page.
 *
 * `GET .../rating` only returns the aggregate (averageScore/ratingCount),
 * never the caller's own prior score, so there's nothing to pre-fill the
 * stars with on load — `myScore` only reflects a rating just submitted in
 * this session, not a returning visitor's earlier one.
 */
export function RatingWidget({ answerId }: RatingWidgetProps) {
  const text = useText();
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const { data } = useGetAnswerRatingQuery(answerId);
  const [upsertRating, { isLoading }] = useUpsertAnswerRatingMutation();
  const [myScore, setMyScore] = useState<number | null>(null);

  async function rate(score: number) {
    try {
      await upsertRating({ answerId, score }).unwrap();
      setMyScore(score);
    } catch {
      // no dedicated error UI — a failed rating just doesn't visually update
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface p-4">
      <div>
        <p className="text-sm font-medium text-text">{text.questions.comments.rating.heading}</p>
        <p className="text-sm text-text-muted">
          {data && data.ratingCount > 0
            ? text.questions.comments.rating.summary(data.averageScore ?? 0, data.ratingCount)
            : text.questions.comments.rating.emptySummary}
        </p>
      </div>

      {accessToken && (
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              aria-label={text.questions.comments.rating.starAriaLabel(value)}
              disabled={isLoading}
              onClick={() => rate(value)}
              className="p-1 disabled:opacity-60"
            >
              <StarIcon
                filled={myScore !== null && value <= myScore}
                className={`size-5 ${myScore !== null && value <= myScore ? "text-marker-500" : "text-border hover:text-marker-300"}`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
