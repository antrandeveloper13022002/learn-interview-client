"use client";

import { useState } from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import {
  useGetAnswerCommentsQuery,
  useReportCommentMutation,
  useUpdateAnswerCommentMutation,
  useDeleteAnswerCommentMutation,
} from "@/lib/redux/answerCommentsApi";
import { useText } from "@/lib/text/useText";
import { useLocale } from "@/lib/routes/useLocale";
import { formatDate } from "@/lib/format";
import { Avatar } from "@/components/ui/Avatar";
import { FlagIcon } from "@/components/icons";
import { CommentForm } from "@/components/questions/CommentForm";
import type { Comment } from "@/lib/types";
import type { TextDictionary } from "@/lib/text";
import type { Locale } from "@/lib/routes/locale";

type CommentListProps = { answerId: string };

/**
 * Self-contained (own `content` state) so editing one comment doesn't
 * re-render every other row in the list on each keystroke — same reasoning
 * CommentForm.tsx already follows for its own textarea, not lifted up to
 * CommentList the way `editingId` itself needs to be (that one only
 * changes on toggle, not per keystroke).
 */
function CommentEditForm({
  initialContent,
  isSaving,
  onSave,
  onCancel,
  text,
}: {
  initialContent: string;
  isSaving: boolean;
  onSave: (content: string) => void;
  onCancel: () => void;
  text: TextDictionary;
}) {
  const [content, setContent] = useState(initialContent);
  const canSave = content.trim().length > 0 && !isSaving;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (canSave) onSave(content.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="mt-1.5 ml-9 flex flex-col gap-2">
      <textarea
        required
        rows={2}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="rounded-md border border-border bg-bg px-3 py-2 text-sm text-text"
      />
      <div className="flex items-center gap-2">
        <button type="button" onClick={onCancel} className="text-xs font-medium text-text-muted hover:text-text">
          {text.questions.comments.list.cancelEditLabel}
        </button>
        <button
          type="submit"
          disabled={!canSave}
          className="rounded-md bg-marker-500 px-3 py-1 text-xs font-semibold text-ink-950 hover:bg-marker-600 disabled:opacity-60"
        >
          {isSaving ? text.questions.comments.list.savingEditLabel : text.questions.comments.list.saveEditLabel}
        </button>
      </div>
    </form>
  );
}

// Module-level, not nested inside CommentList — a component defined inside
// another component's body gets a new function identity every render,
// which makes React treat it as a different component type and remount
// the whole subtree (losing e.g. a reply box's in-progress text) on any
// unrelated state change in the parent (a report click, a new comment
// arriving). All per-row state it needs comes in as props instead of
// closure capture over CommentList's locals.
function CommentRow({
  comment,
  isReply = false,
  answerId,
  accessToken,
  lang,
  text,
  isReported,
  onReport,
  isReplying,
  onToggleReply,
  isEditing,
  isSavingEdit,
  onToggleEdit,
  onSaveEdit,
  onDelete,
}: {
  comment: Comment;
  isReply?: boolean;
  answerId: string;
  accessToken: string | null;
  lang: Locale;
  text: TextDictionary;
  isReported: boolean;
  onReport: (commentId: string) => void;
  isReplying: boolean;
  onToggleReply: (commentId: string) => void;
  isEditing: boolean;
  isSavingEdit: boolean;
  onToggleEdit: (commentId: string) => void;
  onSaveEdit: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
}) {
  return (
    <div className={isReply ? "ml-10 border-l border-border pl-4" : ""}>
      <div className="flex items-center gap-2">
        <Avatar name={comment.authorDisplayName ?? undefined} anonymous={!comment.authorDisplayName} size="sm" />
        <span className="text-sm font-medium text-text">{comment.authorDisplayName ?? text.common.anonymousAuthorLabel}</span>
        <span className="text-xs text-text-muted">{formatDate(comment.createdAt, lang)}</span>
      </div>

      {isEditing ? (
        <CommentEditForm
          initialContent={comment.content}
          isSaving={isSavingEdit}
          onSave={(content) => onSaveEdit(comment.id, content)}
          onCancel={() => onToggleEdit(comment.id)}
          text={text}
        />
      ) : (
        <>
          <p className="mt-1.5 ml-9 whitespace-pre-wrap text-sm text-text">{comment.content}</p>
          <div className="mt-1.5 ml-9 flex items-center gap-3 text-xs">
            {!isReply && accessToken && (
              <button
                type="button"
                onClick={() => onToggleReply(comment.id)}
                className="font-medium text-text-muted hover:text-text"
              >
                {text.questions.comments.list.replyLabel}
              </button>
            )}
            {/* business-rule.md's Q&A Comments section (unlike Company
                Reviews) allows edit AND delete on one's own comment —
                comment.isMine (FU-34) is server-computed so this stays
                correct for an anonymous own-comment too. */}
            {comment.isMine && (
              <button
                type="button"
                onClick={() => onToggleEdit(comment.id)}
                className="font-medium text-text-muted hover:text-text"
              >
                {text.questions.comments.list.editLabel}
              </button>
            )}
            {comment.isMine && (
              <button
                type="button"
                onClick={() => onDelete(comment.id)}
                className="font-medium text-flag-text hover:underline"
              >
                {text.questions.comments.list.deleteLabel}
              </button>
            )}
            <button
              type="button"
              onClick={() => onReport(comment.id)}
              disabled={isReported}
              className="inline-flex items-center gap-1 font-medium text-text-muted hover:text-text disabled:opacity-60"
            >
              <FlagIcon className="size-3.5" />
              {isReported ? text.questions.comments.list.reportedLabel : text.questions.comments.list.reportLabel}
            </button>
          </div>
        </>
      )}

      {!isReply && isReplying && (
        <div className="mt-3 ml-9">
          <CommentForm
            answerId={answerId}
            parentCommentId={comment.id}
            onCancel={() => onToggleReply(comment.id)}
            onPosted={() => onToggleReply(comment.id)}
          />
        </div>
      )}
    </div>
  );
}

export function CommentList({ answerId }: CommentListProps) {
  const text = useText();
  const lang = useLocale();
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const { data, isLoading } = useGetAnswerCommentsQuery(answerId);
  const [reportComment] = useReportCommentMutation();
  const [updateComment, { isLoading: isSavingEdit }] = useUpdateAnswerCommentMutation();
  const [deleteComment] = useDeleteAnswerCommentMutation();
  // BE-49's report endpoint gives no signal distinguishing "first report"
  // from "already reported" — same session-only tracking as ReviewList.tsx.
  const [reportedIds, setReportedIds] = useState<Set<string>>(new Set());
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function handleReport(commentId: string) {
    if (reportedIds.has(commentId)) return;
    try {
      await reportComment({ commentId }).unwrap();
      setReportedIds((prev) => new Set(prev).add(commentId));
    } catch {
      // low-stakes secondary action — no dedicated error UI, same as ReviewList
    }
  }

  function toggleReply(commentId: string) {
    setReplyingToId((prev) => (prev === commentId ? null : commentId));
  }

  function toggleEdit(commentId: string) {
    setEditingId((prev) => (prev === commentId ? null : commentId));
  }

  async function handleSaveEdit(commentId: string, content: string) {
    try {
      await updateComment({ commentId, answerId, content }).unwrap();
      // Only close *this* comment's edit box, not whichever one happens to
      // be open when this save resolves — `editingId`/`isSavingEdit` are
      // both single component-wide values (one mutation trigger shared by
      // every row), so without this guard, saving comment A while the user
      // has since switched to editing comment B would silently close B's
      // box and discard their in-progress edit (real bug caught in code
      // review 2026-08-19).
      setEditingId((prev) => (prev === commentId ? null : prev));
    } catch {
      // Edit form stays open with the failed draft on error — no dedicated
      // error UI, same low-stakes-secondary-action reasoning as report.
    }
  }

  async function handleDelete(commentId: string) {
    try {
      await deleteComment({ commentId, answerId }).unwrap();
    } catch {
      // No dedicated error UI (e.g. a 404 from a double-delete in another
      // tab) — the list simply doesn't change, same low-stakes-secondary-
      // action reasoning as report/save-edit above, not a silent crash.
    }
  }

  if (isLoading) {
    return <p className="text-sm text-text-muted">{text.common.loading}</p>;
  }
  if (!data || data.length === 0) {
    return <p className="text-sm text-text-muted">{text.questions.comments.list.emptyBody}</p>;
  }

  return (
    <ul className="flex flex-col gap-5">
      {data.map((comment) => (
        <li key={comment.id} className="flex flex-col gap-3">
          <CommentRow
            comment={comment}
            answerId={answerId}
            accessToken={accessToken}
            lang={lang}
            text={text}
            isReported={reportedIds.has(comment.id)}
            onReport={handleReport}
            isReplying={replyingToId === comment.id}
            onToggleReply={toggleReply}
            isEditing={editingId === comment.id}
            isSavingEdit={isSavingEdit}
            onToggleEdit={toggleEdit}
            onSaveEdit={handleSaveEdit}
            onDelete={handleDelete}
          />
          {comment.replies.map((reply) => (
            <CommentRow
              key={reply.id}
              comment={reply}
              isReply
              answerId={answerId}
              accessToken={accessToken}
              lang={lang}
              text={text}
              isReported={reportedIds.has(reply.id)}
              onReport={handleReport}
              isReplying={false}
              onToggleReply={toggleReply}
              isEditing={editingId === reply.id}
              isSavingEdit={isSavingEdit}
              onToggleEdit={toggleEdit}
              onSaveEdit={handleSaveEdit}
              onDelete={handleDelete}
            />
          ))}
        </li>
      ))}
    </ul>
  );
}
