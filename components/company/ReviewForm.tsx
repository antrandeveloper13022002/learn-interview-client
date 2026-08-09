"use client";

import { useId, useState } from "react";
import { Link } from "@/components/i18n/LocaleLink";
import { useAppSelector } from "@/lib/redux/hooks";
import { useCreateCompanyReviewMutation } from "@/lib/redux/companyReviewApi";
import { useText } from "@/lib/text/useText";
import { PAGE_ROUTES } from "@/lib/routes";
import { StarIcon } from "@/components/icons";

type ReviewFormProps = { companyId: string };

/** Unlimited reviews per user per company (business-rule.md#company-reviews)
 * — this stays mounted and usable after a successful submit, unlike a
 * one-time form (e.g. RegisterForm), which permanently swaps to a success
 * screen instead. */
export function ReviewForm({ companyId }: ReviewFormProps) {
  const text = useText();
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const [createReview, { isLoading, error }] = useCreateCompanyReviewMutation();

  const contentId = useId();

  if (!accessToken) {
    return (
      <p className="rounded-lg border border-dashed border-border bg-bg p-4 text-sm text-text-muted">
        {text.companies.reviews.form.loginPromptBefore}
        <Link href={PAGE_ROUTES.login} className="font-medium text-marker-700 underline">
          {text.companies.reviews.form.loginPromptLink}
        </Link>
        {text.companies.reviews.form.loginPromptAfter}
      </p>
    );
  }

  const canSubmit = rating > 0 && content.trim().length > 0 && !isLoading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    try {
      await createReview({ companyId, rating, content: content.trim(), isAnonymous }).unwrap();
      setContent("");
      setRating(0);
      setIsAnonymous(false);
      setJustSubmitted(true);
    } catch {
      // error state below reads the mutation's own `error`
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-surface p-4" aria-busy={isLoading}>
      <h3 className="font-semibold text-text">{text.companies.reviews.form.heading}</h3>

      {justSubmitted && (
        <p role="status" className="mt-3 rounded-md bg-correct-bg px-3 py-2 text-sm text-correct-text">
          {text.companies.reviews.form.submittedNotice}
        </p>
      )}
      {error && (
        <p role="alert" className="mt-3 rounded-md bg-flag-bg px-3 py-2 text-sm text-flag-text">
          {text.common.genericErrorBody}
        </p>
      )}

      <fieldset className="mt-4">
        <legend className="text-sm font-medium text-text">{text.companies.reviews.form.ratingLabel}</legend>
        <div className="mt-2 flex gap-1" role="radiogroup" aria-label={text.companies.reviews.form.ratingLabel}>
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={rating === value}
              aria-label={text.companies.reviews.form.ratingStarAriaLabel(value)}
              onClick={() => {
                setRating(value);
                setJustSubmitted(false);
              }}
              className="p-1"
            >
              <StarIcon filled={value <= rating} className={`size-6 ${value <= rating ? "text-marker-500" : "text-border"}`} />
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-4 flex flex-col gap-2">
        <label htmlFor={contentId} className="text-sm font-medium text-text">
          {text.companies.reviews.form.contentLabel}
        </label>
        <textarea
          id={contentId}
          required
          rows={4}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setJustSubmitted(false);
          }}
          placeholder={text.companies.reviews.form.contentPlaceholder}
          className="rounded-md border border-border bg-bg px-3 py-2 text-text"
        />
      </div>

      <label className="mt-3 flex items-center gap-2 text-sm text-text">
        <input
          type="checkbox"
          checked={isAnonymous}
          onChange={(e) => setIsAnonymous(e.target.checked)}
          className="size-4"
        />
        {text.companies.reviews.form.anonymousLabel}
      </label>

      <button
        type="submit"
        disabled={!canSubmit}
        className="mt-4 min-h-11 rounded-md bg-marker-500 px-5 font-semibold text-ink-950 hover:bg-marker-600 disabled:opacity-60"
      >
        {isLoading ? text.common.loading : text.companies.reviews.form.submitLabel}
      </button>
    </form>
  );
}
