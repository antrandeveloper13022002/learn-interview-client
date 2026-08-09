"use client";

import { useAppSelector } from "@/lib/redux/hooks";
import {
  useGetMyStudiedCategoriesQuery,
  useMarkCategoryStudyingMutation,
  useUnmarkCategoryStudyingMutation,
} from "@/lib/redux/studyMarksApi";
import { useText } from "@/lib/text/useText";
import { StarIcon } from "@/components/icons";

type StudyMarkButtonProps = {
  categoryId: string;
  className?: string;
};

/**
 * "Currently studying this topic" toggle (FU-22) — same
 * guest-sees-nothing/optimistic-mutation shape as BookmarkToggle.tsx, one
 * level up (Category instead of Question). Rendered as a sibling of
 * TopicSidebar's row `<Link>`, never nested inside it — same nested-
 * interactive-control problem QuestionList's tag chips had.
 */
export function StudyMarkButton({ categoryId, className = "" }: StudyMarkButtonProps) {
  const text = useText();
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const { data: studiedIds, isLoading: isLoadingStudied } = useGetMyStudiedCategoriesQuery(undefined, {
    skip: !accessToken,
  });
  const [markStudying, { isLoading: isMarking }] = useMarkCategoryStudyingMutation();
  const [unmarkStudying, { isLoading: isUnmarking }] = useUnmarkCategoryStudyingMutation();

  if (!accessToken) return null;

  const isStudying = studiedIds?.includes(categoryId) ?? false;
  const isDisabled = isLoadingStudied || isMarking || isUnmarking;

  function handleClick() {
    if (isDisabled) return;
    if (isStudying) unmarkStudying(categoryId);
    else markStudying(categoryId);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      aria-pressed={isStudying}
      aria-label={isStudying ? text.questions.filters.unmarkStudyingLabel : text.questions.filters.markStudyingLabel}
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors disabled:opacity-60 ${
        isStudying ? "text-marker-600" : "text-text-muted hover:text-text"
      } ${className}`}
    >
      <StarIcon filled={isStudying} className="size-4" />
    </button>
  );
}
