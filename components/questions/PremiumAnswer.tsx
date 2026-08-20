"use client";

import { Link } from "@/components/i18n/LocaleLink";
import { useAppSelector } from "@/lib/redux/hooks";
import { useGetQuestionDetailQuery } from "@/lib/redux/questionsApi";
import { useText } from "@/lib/text/useText";
import { useLocale } from "@/lib/routes/useLocale";
import { PAGE_ROUTES } from "@/lib/routes";
import { LockIcon } from "@/components/icons";
import { AnswerCard } from "@/components/questions/AnswerCard";
import { RevealAnswer } from "@/components/questions/RevealAnswer";
import { CodeDemoBlock } from "@/components/questions/CodeDemoBlock";
import { NoteCallout } from "@/components/questions/NoteCallout";
import { FormattedAnswerText } from "@/components/questions/FormattedAnswerText";
import { CommentsSection } from "@/components/questions/CommentsSection";

/**
 * Only rendered when the server-scoped fetch (always guest) came back
 * locked. Re-checks entitlement client-side with the real access token —
 * skipped entirely for anonymous visitors (no token, no point calling).
 * Never trust anything here as the security boundary: the backend is the
 * one deciding whether `answer` is present at all (business-rule.md#premium-gating).
 *
 * Deliberately does NOT gate on `auth.isBootstrapped`: the server always
 * renders with `accessToken === null` (Server Components are guest-scoped,
 * FU-03), so gating on "has the client's session bootstrap finished yet"
 * would make the server-rendered HTML show a perpetual "checking access"
 * spinner instead of the real locked-content copy — invisible to a
 * no-JS crawler and wrong for seo-guideline.md's "verify the actual HTML
 * response" check. `accessToken` alone is enough: null means render locked
 * (matches SSR exactly, no hydration flash), non-null means a real
 * logged-in visitor whose entitlement is worth re-checking client-side.
 */
export function PremiumAnswer({ slug, title }: { slug: string; title: string }) {
  const text = useText();
  const lang = useLocale();
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const { data, isFetching, isError, refetch } = useGetQuestionDetailQuery(
    { slug, lang },
    { skip: !accessToken },
  );

  if (accessToken && isFetching) {
    return (
      <AnswerCard title={title}>
        <div role="status" aria-busy="true" className="min-h-40">
          <span className="sr-only">{text.questions.detail.premiumAnswer.checkingAccessSrOnly}</span>
        </div>
      </AnswerCard>
    );
  }

  if (data?.answer) {
    return (
      <>
        <AnswerCard title={title} status={text.questions.detail.premiumAnswer.unlockedBadge}>
          <RevealAnswer>
            <div className="flex flex-col gap-5">
              <FormattedAnswerText text={data.answer} />
              {data.codeDemo && <CodeDemoBlock language={data.codeDemo.language} code={data.codeDemo.code} />}
              {data.note && <NoteCallout title={data.note.title} items={data.note.items} />}
            </div>
          </RevealAnswer>
        </AnswerCard>
        {/* Same mount condition as AnswerSection.tsx's SSR-entitled branch —
            this is the client-refetch equivalent for a premium question
            unlocked after the initial guest-scoped SSR pass. */}
        {data.answerId && <CommentsSection answerId={data.answerId} lang={lang} />}
      </>
    );
  }

  // A logged-in visitor whose entitlement check failed to *load* is not the
  // same as one who checked out and isn't entitled — don't tell a possibly
  // already-paying subscriber to "upgrade" when we simply don't know yet.
  if (accessToken && isError) {
    return (
      <AnswerCard title={title}>
        <div role="alert" className="text-center">
          <p className="font-semibold text-text">{text.questions.detail.premiumAnswer.checkFailedTitle}</p>
          <p className="mt-2 text-sm text-text-muted">{text.questions.detail.premiumAnswer.checkFailedBody}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 min-h-11 rounded-md border border-border px-5 py-2 font-medium text-text hover:bg-border"
          >
            {text.common.retryLabel}
          </button>
        </div>
      </AnswerCard>
    );
  }

  return (
    <AnswerCard title={title} status={text.questions.detail.premiumAnswer.lockedBadge}>
      <div className="relative min-h-40 text-center">
        {/* Decorative only — fake lines, never the real answer. The real
            answer is withheld server-side for unentitled requests
            (business-rule.md#premium-gating rejected blurring real text as
            bypassable); this just teases that content exists here. */}
        <div aria-hidden="true" className="mx-auto mb-5 max-w-xs space-y-2.5 blur-[3px]">
          <div className="h-3 rounded-full bg-text/25" />
          <div className="h-3 w-11/12 rounded-full bg-text/25" />
          <div className="h-3 w-4/5 rounded-full bg-text/25" />
          <div className="h-3 w-3/5 rounded-full bg-text/25" />
        </div>
        <span className="relative mx-auto mb-3 grid size-12 place-items-center rounded-full bg-premium-bg text-premium-icon">
          <LockIcon className="size-5" />
        </span>
        <p className="font-semibold text-text">{text.questions.detail.premiumAnswer.gatedTitle}</p>
        <p className="mt-2 text-sm text-text-muted">
          {accessToken
            ? text.questions.detail.premiumAnswer.gatedBodyLoggedIn
            : text.questions.detail.premiumAnswer.gatedBodyLoggedOut}
        </p>
        <Link
          href={accessToken ? PAGE_ROUTES.subscribe : PAGE_ROUTES.login}
          className="mt-4 inline-block min-h-11 rounded-md bg-marker-500 px-5 py-2 font-semibold text-ink-950 hover:bg-marker-600"
        >
          {accessToken ? text.questions.detail.premiumAnswer.upgradeCta : text.questions.detail.premiumAnswer.loginCta}
        </Link>
      </div>
    </AnswerCard>
  );
}
