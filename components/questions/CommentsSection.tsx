import { getText } from "@/lib/text";
import type { Locale } from "@/lib/routes/locale";
import { RatingWidget } from "@/components/questions/RatingWidget";
import { CommentForm } from "@/components/questions/CommentForm";
import { CommentList } from "@/components/questions/CommentList";

/**
 * Mounted only when the answer itself is visible (see AnswerSection.tsx) —
 * `answerId` is gated identically to `answer` on GET /questions/:slug
 * (BE-63/FU-29), so there is nothing to show here for an ungated/absent
 * answer. The comment/rating endpoints re-check entitlement server-side
 * regardless; this mount condition just avoids rendering a comments UI for
 * content the visitor can't see yet. Server Component (getText(lang), like
 * AnswerSection.tsx) that composes client children, not a client component
 * itself — no reason to widen the client boundary just to read copy.
 */
export function CommentsSection({ answerId, lang }: { answerId: string; lang: Locale }) {
  const text = getText(lang);

  return (
    <section className="mt-8 flex flex-col gap-5">
      <h2 className="font-display text-xl font-semibold text-text">{text.questions.comments.heading}</h2>
      <RatingWidget answerId={answerId} />
      <CommentForm answerId={answerId} />
      <CommentList answerId={answerId} />
    </section>
  );
}
