"use client";

import { useId, useState } from "react";
import { Link } from "@/components/i18n/LocaleLink";
import { useAppSelector } from "@/lib/redux/hooks";
import { useCreateQuestionSubmissionMutation } from "@/lib/redux/questionSubmissionsApi";
import { useGetCategoriesQuery, useGetQuestionTagsQuery } from "@/lib/redux/questionsApi";
import { useLocale } from "@/lib/routes/useLocale";
import { Skeleton, SkeletonGroup } from "@/components/Skeleton";
import { Dropdown, type DropdownOption } from "@/components/ui/Dropdown";
import { TagMultiSelect } from "@/components/questions/TagMultiSelect";
import { useText } from "@/lib/text/useText";
import { PAGE_ROUTES } from "@/lib/routes";
import type { ApiErrorBody } from "@/lib/types";
import { AlertCircleIcon, SendIcon, CheckCircleIcon, UserIcon } from "@/components/icons";

function errorCode(err: unknown): string | null {
  if (err && typeof err === "object" && "data" in err) {
    const data = (err as { data?: ApiErrorBody }).data;
    return data?.error?.code ?? null;
  }
  return null;
}

/**
 * Same isBootstrapped-first gating as BookmarksView.tsx/ProfileView.tsx —
 * this route also has no Server Component data to match, so a real
 * logged-in visitor shouldn't flash the sign-in prompt while
 * SessionBootstrap's silent refresh is still resolving.
 */
export function ContributeForm() {
  const text = useText();
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const isBootstrapped = useAppSelector((s) => s.auth.isBootstrapped);

  if (!isBootstrapped) {
    return (
      <SkeletonGroup label={text.common.loading}>
        <div className="mt-8 flex flex-col gap-3">
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-36 w-full" />
        </div>
      </SkeletonGroup>
    );
  }

  if (!accessToken) {
    return (
      <div className="mt-8 flex flex-col items-center gap-5 rounded-lg border border-border bg-surface p-6 text-center shadow-(--shadow-border) sm:flex-row sm:text-left">
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-marker-100 text-marker-700">
          <UserIcon className="size-4.5" />
        </span>
        <div className="flex-1">
          <p className="font-display text-[15px] font-semibold text-text">{text.contribute.loginPromptHeading}</p>
          <p className="text-[13.5px] text-text-muted">{text.contribute.loginPromptBody}</p>
        </div>
        <Link
          href={PAGE_ROUTES.login}
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-md bg-marker-500 px-5 text-sm font-semibold text-ink-950 hover:bg-marker-600"
        >
          {text.contribute.loginPromptCta}
        </Link>
      </div>
    );
  }

  return <ContributeFormBody />;
}

function ContributeFormBody() {
  const text = useText();
  const lang = useLocale();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [suggestedAnswer, setSuggestedAnswer] = useState("");
  const [categoryId, setCategoryId] = useState("");
  // Selected by tag NAME (matching TagMultiSelect's existing contract,
  // shared with the /questions filter — FU-22), mapped to ids only at
  // submit time via `tagOptions`, which already carries both.
  const [selectedTagNames, setSelectedTagNames] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [createSubmission, { isLoading, error, reset }] = useCreateQuestionSubmissionMutation();
  const { data: categories } = useGetCategoriesQuery({ lang });
  const { data: tagOptions } = useGetQuestionTagsQuery();

  const titleId = useId();
  const contentId = useId();
  const answerId = useId();

  const canSubmit = title.trim().length > 0 && content.trim().length > 0 && suggestedAnswer.trim().length > 0 && !isLoading;
  const code = error ? errorCode(error) : null;
  const isDisplayNameRequired = code === "DISPLAY_NAME_REQUIRED";

  function resetForm() {
    setTitle("");
    setContent("");
    setSuggestedAnswer("");
    setCategoryId("");
    setSelectedTagNames([]);
    setSubmitted(false);
    reset();
  }

  function toggleTag(tagName: string) {
    setSelectedTagNames((prev) => (prev.includes(tagName) ? prev.filter((t) => t !== tagName) : [...prev, tagName]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    const tagIds = (tagOptions ?? []).filter((t) => selectedTagNames.includes(t.name)).map((t) => t.id);
    try {
      await createSubmission({
        title: title.trim(),
        content: content.trim(),
        suggestedAnswer: suggestedAnswer.trim(),
        categoryId: categoryId || undefined,
        tagIds: tagIds.length > 0 ? tagIds : undefined,
      }).unwrap();
      setSubmitted(true);
    } catch {
      // error state below reads the mutation's own `error`
    }
  }

  if (submitted) {
    return (
      <div className="mt-10 flex flex-col items-center gap-6 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-marker-100 text-marker-700">
          <CheckCircleIcon className="size-7.5" />
        </span>
        <div>
          <p role="status" className="font-display text-2xl font-semibold text-text">
            {text.contribute.success.heading}
          </p>
          <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-text-muted">{text.contribute.success.body}</p>
        </div>
        <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
          <Link
            href={PAGE_ROUTES.mySubmissions}
            className="flex-1 whitespace-nowrap rounded-md bg-marker-500 px-5 py-2.5 text-center text-sm font-semibold text-ink-950 hover:bg-marker-600"
          >
            {text.contribute.success.viewSubmissionsCta}
          </Link>
          <button
            type="button"
            onClick={resetForm}
            className="flex-1 whitespace-nowrap rounded-md border border-border px-5 py-2.5 text-sm font-semibold text-text hover:bg-border"
          >
            {text.contribute.success.submitAnotherCta}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6" aria-busy={isLoading}>
      {isDisplayNameRequired && (
        <div className="flex flex-col items-start gap-4 rounded-lg border border-flag-600/30 bg-flag-bg p-5 sm:flex-row">
          <AlertCircleIcon className="mt-0.5 size-5 shrink-0 text-flag-text" />
          <div className="min-w-0 flex-1">
            <p className="font-display text-[14.5px] font-semibold text-flag-text">{text.contribute.displayNameRequired.title}</p>
            <p className="mt-1 text-[13.5px] leading-relaxed text-flag-text">{text.contribute.displayNameRequired.body}</p>
          </div>
          <Link
            href={PAGE_ROUTES.profile}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-marker-500 px-4 py-2 text-sm font-semibold text-ink-950 hover:bg-marker-600"
          >
            <UserIcon className="size-3.5" />
            {text.contribute.displayNameRequired.cta}
          </Link>
        </div>
      )}
      {error && !isDisplayNameRequired && (
        <p role="alert" className="rounded-md bg-flag-bg px-4 py-3 text-sm text-flag-text">
          {text.contribute.genericError}
        </p>
      )}

      <div className="flex flex-col gap-6 rounded-xl border border-border bg-surface p-6 shadow-(--shadow-border)">
        <div className="flex flex-col gap-2">
          <label htmlFor={titleId} className="text-sm font-semibold text-text">
            {text.contribute.form.titleLabel}
          </label>
          <input
            id={titleId}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={text.contribute.form.titlePlaceholder}
            className="min-h-11 rounded-md border border-border bg-bg px-3 text-text"
          />
          <span className="text-xs text-text-muted">{text.contribute.form.titleHint}</span>
        </div>

        <div className="h-px bg-border" />

        <div className="flex flex-col gap-2">
          <label htmlFor={contentId} className="text-sm font-semibold text-text">
            {text.contribute.form.contentLabel}
          </label>
          <textarea
            id={contentId}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            placeholder={text.contribute.form.contentPlaceholder}
            className="resize-none rounded-md border border-border bg-bg px-3 py-2 text-text"
          />
          <span className="text-xs text-text-muted">{text.contribute.form.contentHint}</span>
        </div>

        <div className="h-px bg-border" />

        <div className="flex flex-col gap-2">
          <label htmlFor={answerId} className="text-sm font-semibold text-text">
            {text.contribute.form.answerLabel}
          </label>
          <textarea
            id={answerId}
            value={suggestedAnswer}
            onChange={(e) => setSuggestedAnswer(e.target.value)}
            rows={6}
            placeholder={text.contribute.form.answerPlaceholder}
            className="resize-none rounded-md border border-border bg-bg px-3 py-2 text-text"
          />
          <span className="text-xs text-text-muted">{text.contribute.form.answerHint}</span>
        </div>

        <div className="h-px bg-border" />

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-text">{text.contribute.form.categoryLabel}</span>
            <Dropdown
              value={categoryId}
              placeholder={text.contribute.form.categoryPlaceholder}
              onChange={setCategoryId}
              options={(categories ?? []).map((c): DropdownOption => ({ value: c.id, label: c.name }))}
            />
            <span className="text-xs text-text-muted">{text.contribute.form.categoryHint}</span>
          </div>

          {tagOptions && tagOptions.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-text">{text.contribute.form.tagLabel}</span>
              <TagMultiSelect
                options={tagOptions}
                selected={selectedTagNames}
                onToggle={toggleTag}
                onClear={() => setSelectedTagNames([])}
              />
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-text-muted">{text.contribute.form.consentNote}</p>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={resetForm}
          className="rounded-md border border-border px-5 py-2.5 text-sm font-medium text-text-muted hover:bg-border"
        >
          {text.contribute.form.resetLabel}
        </button>
        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex min-h-11 items-center gap-2 rounded-md bg-marker-500 px-6 text-sm font-semibold text-ink-950 hover:bg-marker-600 disabled:opacity-60"
        >
          <SendIcon className="size-3.5" />
          {isLoading ? text.contribute.form.submittingLabel : text.contribute.form.submitLabel}
        </button>
      </div>
    </form>
  );
}
