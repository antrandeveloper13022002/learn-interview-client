"use client";

import { useId, useState } from "react";
import { Link } from "@/components/i18n/LocaleLink";
import { useAppSelector } from "@/lib/redux/hooks";
import { useCreateAnswerCommentMutation } from "@/lib/redux/answerCommentsApi";
import { useText } from "@/lib/text/useText";
import { PAGE_ROUTES } from "@/lib/routes";
import { LockIcon } from "@/components/icons";

type CommentFormProps = {
  answerId: string;
  /** Set only when this form posts a reply — omitted for the top-level post box. */
  parentCommentId?: string;
  /** Reply forms are opened via a button only shown to logged-in users (CommentList) — but the box can stay mounted after that becomes stale (session expiry, logout in another tab), so this is never used to skip the login gate below, only to swap its copy/layout. */
  onCancel?: () => void;
  onPosted?: () => void;
};

/**
 * Shared by the top-level "write a comment" box and each reply toggle —
 * same login-gated-write/public-read split as ReviewForm.tsx. Unlimited
 * comments per user per answer (business-rule.md's Q&A Comments section),
 * so this stays mounted and reusable after a successful post, same as
 * ReviewForm never swapping to a one-time success screen.
 */
export function CommentForm({ answerId, parentCommentId, onCancel, onPosted }: CommentFormProps) {
  const text = useText();
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [createComment, { isLoading, error }] = useCreateAnswerCommentMutation();
  const contentId = useId();

  // Applies to a reply box too, not just the root form — CommentList only
  // renders "Reply" for a logged-in caller, but the box it opens can
  // outlive that (token expiry, logout in another tab) while still
  // mounted; without this it kept accepting input and 401ing silently on
  // submit instead of prompting to log back in.
  if (!accessToken) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-surface p-4 sm:flex-row">
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-marker-100 text-marker-700">
          <LockIcon className="size-4.5" />
        </span>
        <p className="flex-1 text-center text-sm text-text-muted sm:text-left">{text.questions.comments.form.loginPromptBody}</p>
        <Link
          href={PAGE_ROUTES.login}
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-md bg-marker-500 px-5 text-sm font-semibold text-ink-950 hover:bg-marker-600"
        >
          {text.questions.comments.form.loginPromptCta}
        </Link>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="shrink-0 text-sm font-medium text-text-muted hover:text-text"
          >
            {text.questions.comments.form.cancelReplyLabel}
          </button>
        )}
      </div>
    );
  }

  const canSubmit = content.trim().length > 0 && !isLoading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    try {
      await createComment({ answerId, content: content.trim(), isAnonymous, parentCommentId }).unwrap();
      setContent("");
      setIsAnonymous(false);
      onPosted?.();
    } catch {
      // error state below reads the mutation's own `error`
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2" aria-busy={isLoading}>
      {error && (
        <p role="alert" className="rounded-md bg-flag-bg px-3 py-2 text-sm text-flag-text">
          {text.common.genericErrorBody}
        </p>
      )}

      <label htmlFor={contentId} className="sr-only">
        {parentCommentId ? text.questions.comments.form.replyPlaceholder : text.questions.comments.form.contentPlaceholder}
      </label>
      <textarea
        id={contentId}
        required
        rows={parentCommentId ? 2 : 3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={parentCommentId ? text.questions.comments.form.replyPlaceholder : text.questions.comments.form.contentPlaceholder}
        className="rounded-md border border-border bg-bg px-3 py-2 text-sm text-text"
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm text-text">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="size-4 cursor-pointer accent-marker-600 outline-none ring-marker-300 ring-offset-1 ring-offset-bg transition-shadow hover:ring-2 focus-visible:ring-2 focus-visible:ring-marker-600"
          />
          {text.questions.comments.form.anonymousLabel}
        </label>

        <div className="flex items-center gap-2">
          {onCancel && (
            <button type="button" onClick={onCancel} className="min-h-9 rounded-md px-3 text-sm font-medium text-text-muted hover:text-text">
              {text.questions.comments.form.cancelReplyLabel}
            </button>
          )}
          <button
            type="submit"
            disabled={!canSubmit}
            className="min-h-9 rounded-md bg-marker-500 px-4 text-sm font-semibold text-ink-950 hover:bg-marker-600 disabled:opacity-60"
          >
            {isLoading ? text.common.loading : parentCommentId ? text.questions.comments.form.submitReplyLabel : text.questions.comments.form.submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
