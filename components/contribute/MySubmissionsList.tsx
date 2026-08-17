"use client";

import { useId, useState } from "react";
import { Link } from "@/components/i18n/LocaleLink";
import { useAppSelector } from "@/lib/redux/hooks";
import {
  useGetMyQuestionSubmissionsQuery,
  useUpdateQuestionSubmissionMutation,
  useDeleteQuestionSubmissionMutation,
} from "@/lib/redux/questionSubmissionsApi";
import { SkeletonGroup, Skeleton } from "@/components/Skeleton";
import { useText } from "@/lib/text/useText";
import { useLocale } from "@/lib/routes/useLocale";
import { formatDate } from "@/lib/format";
import { PAGE_ROUTES } from "@/lib/routes";
import type { QuestionSubmission } from "@/lib/types";
import { AlertCircleIcon, ClockIcon, CheckCircleIcon, XCircleIcon, PencilIcon, TrashIcon, LockIcon, SendIcon } from "@/components/icons";

const STATUS_BADGE_CLASS = {
  PENDING: "bg-wash-bg text-wash-text",
  APPROVED: "bg-correct-bg text-correct-text",
  REJECTED: "bg-flag-bg text-flag-text",
} as const;

const STATUS_ICON = {
  PENDING: ClockIcon,
  APPROVED: CheckCircleIcon,
  REJECTED: XCircleIcon,
} as const;

/**
 * Same isBootstrapped-first gating as BookmarksView.tsx — this route also
 * has no Server Component data to match, so a real logged-in visitor
 * shouldn't flash the sign-in prompt while SessionBootstrap's silent
 * refresh is still resolving.
 */
export function MySubmissionsList() {
  const text = useText();
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const isBootstrapped = useAppSelector((s) => s.auth.isBootstrapped);
  const { data, isLoading, isError, refetch } = useGetMyQuestionSubmissionsQuery(undefined, { skip: !accessToken });

  if (!isBootstrapped) {
    return (
      <SkeletonGroup label={text.mySubmissions.loadingSrOnly}>
        <div className="mt-8 flex flex-col gap-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </SkeletonGroup>
    );
  }

  if (!accessToken) {
    return (
      <div className="mt-8 rounded-lg border border-dashed border-border p-10 text-center">
        <p className="font-semibold text-text">{text.mySubmissions.signedOutTitle}</p>
        <p className="mt-2 text-sm text-text-muted">{text.mySubmissions.signedOutBody}</p>
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
      <SkeletonGroup label={text.mySubmissions.loadingSrOnly}>
        <div className="mt-8 flex flex-col gap-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </SkeletonGroup>
    );
  }

  if (isError) {
    return (
      <div role="alert" className="mt-8 rounded-lg border border-border bg-bg p-10 text-center">
        <p className="font-semibold text-text">{text.mySubmissions.errorTitle}</p>
        <p className="mt-2 text-sm text-text-muted">{text.mySubmissions.errorBody}</p>
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

  if (!data || data.items.length === 0) {
    return (
      <div className="mt-8 rounded-xl border border-dashed border-border bg-surface p-10 text-center">
        <p className="font-display font-semibold text-text">{text.mySubmissions.emptyTitle}</p>
        <p className="mx-auto mt-2 max-w-xs text-sm text-text-muted">{text.mySubmissions.emptyBody}</p>
        <Link
          href={PAGE_ROUTES.contribute}
          className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-md bg-marker-500 px-5 text-sm font-semibold text-ink-950 hover:bg-marker-600"
        >
          <SendIcon className="size-3.5" />
          {text.mySubmissions.emptyCta}
        </Link>
      </div>
    );
  }

  const approved = data.items.filter((s) => s.status === "APPROVED").length;
  const pending = data.items.filter((s) => s.status === "PENDING").length;
  const rejected = data.items.filter((s) => s.status === "REJECTED").length;

  return (
    <>
      <ul className="mt-8 flex flex-col gap-4">
        {data.items.map((submission) => (
          <SubmissionCard key={submission.id} submission={submission} />
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
        <p className="text-sm text-text-muted">{text.mySubmissions.summary(approved, pending, rejected)}</p>
        <Link
          href={PAGE_ROUTES.contribute}
          className="inline-flex min-h-11 items-center gap-2 rounded-md bg-marker-500 px-5 text-sm font-semibold text-ink-950 hover:bg-marker-600"
        >
          <SendIcon className="size-3.5" />
          {text.mySubmissions.contributeMoreCta}
        </Link>
      </div>
    </>
  );
}

function SubmissionCard({ submission }: { submission: QuestionSubmission }) {
  const text = useText();
  const lang = useLocale();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(submission.title);
  const [content, setContent] = useState(submission.content);
  const [suggestedAnswer, setSuggestedAnswer] = useState(submission.suggestedAnswer);
  const [updateSubmission, { isLoading: isSaving }] = useUpdateQuestionSubmissionMutation();
  const [deleteSubmission] = useDeleteQuestionSubmissionMutation();
  const [actionError, setActionError] = useState(false);
  const titleId = useId();
  const contentId = useId();
  const answerId = useId();

  const isPending = submission.status === "PENDING";
  const StatusIcon = STATUS_ICON[submission.status];

  function startEdit() {
    setTitle(submission.title);
    setContent(submission.content);
    setSuggestedAnswer(submission.suggestedAnswer);
    setActionError(false);
    setIsEditing(true);
  }

  async function saveEdit() {
    setActionError(false);
    try {
      await updateSubmission({
        id: submission.id,
        title: title.trim(),
        content: content.trim(),
        suggestedAnswer: suggestedAnswer.trim(),
      }).unwrap();
      setIsEditing(false);
    } catch {
      // Keep the edit form open on failure so the caller doesn't lose their
      // draft — most likely cause is an admin having just approved/rejected
      // this exact submission (SUBMISSION_NOT_PENDING), a real race given
      // this is a live moderation queue, not just a network blip.
      setActionError(true);
    }
  }

  async function withdraw() {
    setActionError(false);
    try {
      await deleteSubmission(submission.id).unwrap();
    } catch {
      // Same race as saveEdit above — the optimistic-update patch already
      // reverts the row on failure (questionSubmissionsApi.ts), this just
      // adds a visible reason instead of a silent revert.
      setActionError(true);
    }
  }

  return (
    <li className="rounded-xl border border-border bg-surface p-5 shadow-(--shadow-border)">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_BADGE_CLASS[submission.status]}`}
        >
          <StatusIcon className="size-3" />
          {text.mySubmissions.status[submission.status]}
        </span>
        <span className="text-xs text-text-muted">{formatDate(submission.createdAt, lang)}</span>
      </div>

      {isEditing ? (
        <div className="mt-4 flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor={titleId} className="text-xs font-medium text-text-muted">
              {text.contribute.form.titleLabel}
            </label>
            <input
              id={titleId}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="min-h-11 rounded-md border border-border bg-bg px-3 text-text"
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor={contentId} className="text-xs font-medium text-text-muted">
              {text.contribute.form.contentLabel}
            </label>
            <textarea
              id={contentId}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              className="resize-none rounded-md border border-border bg-bg px-3 py-2 text-text"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor={answerId} className="text-xs font-medium text-text-muted">
              {text.contribute.form.answerLabel}
            </label>
            <textarea
              id={answerId}
              value={suggestedAnswer}
              onChange={(e) => setSuggestedAnswer(e.target.value)}
              rows={4}
              className="resize-none rounded-md border border-border bg-bg px-3 py-2 text-text"
            />
          </div>
          {actionError && (
            <p role="alert" className="text-xs text-flag-text">
              {text.mySubmissions.actionError}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-text-muted hover:bg-border"
            >
              {text.mySubmissions.cancelLabel}
            </button>
            <button
              type="button"
              onClick={saveEdit}
              disabled={isSaving || title.trim().length === 0 || content.trim().length === 0 || suggestedAnswer.trim().length === 0}
              className="rounded-md bg-marker-500 px-3 py-1.5 text-xs font-semibold text-ink-950 hover:bg-marker-600 disabled:opacity-60"
            >
              {isSaving ? text.mySubmissions.savingLabel : text.mySubmissions.saveLabel}
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="mt-3 font-medium leading-snug text-text">{submission.title}</p>
          {actionError && (
            <p role="alert" className="mt-2 text-xs text-flag-text">
              {text.mySubmissions.actionError}
            </p>
          )}
        </>
      )}

      {submission.status === "REJECTED" && submission.rejectionReason && (
        <div className="mt-4 flex gap-3 rounded-md bg-flag-bg p-4">
          <AlertCircleIcon className="mt-0.5 size-4 shrink-0 text-flag-text" />
          <div>
            <p className="text-xs font-semibold text-flag-text">{text.mySubmissions.rejectionReasonLabel}</p>
            <p className="mt-1 text-sm leading-relaxed text-flag-text">{submission.rejectionReason}</p>
          </div>
        </div>
      )}

      {!isEditing && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {isPending && (
            <>
              <button
                type="button"
                onClick={startEdit}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-text hover:bg-border"
              >
                <PencilIcon className="size-3" />
                {text.mySubmissions.editLabel}
              </button>
              <button
                type="button"
                onClick={withdraw}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-flag-text hover:bg-flag-bg"
              >
                <TrashIcon className="size-3" />
                {text.mySubmissions.withdrawLabel}
              </button>
            </>
          )}
          {!isPending && (
            <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-text-muted">
              <LockIcon className="size-3" />
              {text.mySubmissions.lockedLabel}
            </span>
          )}
        </div>
      )}
    </li>
  );
}
