"use client";

import { useAppSelector } from "@/lib/redux/hooks";
import { useGetMyStudiedCategoriesQuery, useUnmarkCategoryStudyingMutation } from "@/lib/redux/studyMarksApi";
import { useText } from "@/lib/text/useText";
import { Link } from "@/components/i18n/LocaleLink";
import { PAGE_ROUTES } from "@/lib/routes";
import { StarIcon } from "@/components/icons";
import type { Category } from "@/lib/types";

/**
 * Homepage "Chủ đề đang ôn" section — the first real consumer of FU-22's
 * study-mark data outside StudyMarkButton.tsx itself (confirmed with the
 * user 2026-08-18: the mark was previously write-only, nothing ever read it
 * back). Guest-gated the same way StudyMarkButton is (renders nothing
 * without a session) since the underlying data is per-user.
 *
 * `categories` is the homepage's own already-fetched, guest-scoped list
 * (server component, full Category rows incl. questionCount) — this
 * component only needs the client-side, auth-scoped *ordering* on top of
 * it, not a second fetch of the same catalog.
 */
export function StudyingTopicsSection({ categories }: { categories: Category[] }) {
  const text = useText();
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const { data: studiedIds, isLoading } = useGetMyStudiedCategoriesQuery(undefined, { skip: !accessToken });
  const [unmarkStudying] = useUnmarkCategoryStudyingMutation();

  if (!accessToken || isLoading) return null;

  // Preserves studiedIds' own order (backend: most-recently-marked first —
  // interview.repository.ts's findStudiedCategoryIds), not `categories`'.
  const studiedCategories = (studiedIds ?? [])
    .map((id) => categories.find((c) => c.id === id))
    .filter((c): c is Category => c !== undefined);

  return (
    <section className="mt-16">
      <h2 className="font-display text-lg font-semibold">{text.home.studyingHeading}</h2>

      {studiedCategories.length === 0 ? (
        <div className="mt-4 rounded-[18px] border border-dashed border-border bg-surface p-6 text-center">
          <p className="font-semibold text-text">{text.home.studyingEmptyTitle}</p>
          <p className="mt-1 text-sm text-text-muted">{text.home.studyingEmptyBody}</p>
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          {studiedCategories.map((category) => (
            <div
              key={category.id}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface pr-2 pl-4 py-2 text-sm font-medium text-text shadow-(--shadow-border)"
            >
              <Link href={PAGE_ROUTES.category(category.slug)} className="inline-flex items-center gap-2 hover:underline">
                <span className="font-mono text-text-muted">{category.questionCount}</span>
                {category.name}
              </Link>
              <button
                type="button"
                onClick={() => unmarkStudying(category.id)}
                aria-label={text.questions.filters.unmarkStudyingLabel}
                className="inline-flex size-6 shrink-0 items-center justify-center rounded-full text-marker-600 hover:text-text-muted"
              >
                <StarIcon filled className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
