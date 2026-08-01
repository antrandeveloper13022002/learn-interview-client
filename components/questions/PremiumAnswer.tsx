"use client";

import Link from "next/link";
import { useAppSelector } from "@/lib/redux/hooks";
import { useGetQuestionDetailQuery } from "@/lib/redux/questionsApi";
import { text } from "@/lib/text";
import { PAGE_ROUTES } from "@/lib/routes";

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
export function PremiumAnswer({ slug }: { slug: string }) {
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const { data, isFetching, isError, refetch } = useGetQuestionDetailQuery(slug, {
    skip: !accessToken,
  });

  if (accessToken && isFetching) {
    return (
      <div
        role="status"
        aria-busy="true"
        className="min-h-40 rounded-lg border border-neutral-200 bg-neutral-50 p-6"
      >
        <span className="sr-only">{text.questions.detail.premiumAnswer.checkingAccessSrOnly}</span>
      </div>
    );
  }

  if (data?.answer) {
    return <div className="whitespace-pre-wrap leading-relaxed">{data.answer}</div>;
  }

  // A logged-in visitor whose entitlement check failed to *load* is not the
  // same as one who checked out and isn't entitled — don't tell a possibly
  // already-paying subscriber to "upgrade" when we simply don't know yet.
  if (accessToken && isError) {
    return (
      <div
        role="alert"
        className="min-h-40 rounded-lg border border-neutral-200 bg-neutral-50 p-6 text-center"
      >
        <p className="font-semibold">{text.questions.detail.premiumAnswer.checkFailedTitle}</p>
        <p className="mt-2 text-sm text-neutral-600">{text.questions.detail.premiumAnswer.checkFailedBody}</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 min-h-11 rounded-md border border-neutral-300 px-5 py-2 font-medium"
        >
          {text.common.retryLabel}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-40 rounded-lg border border-dashed border-amber-300 bg-amber-50 p-6 text-center">
      <p className="font-semibold text-amber-900">{text.questions.detail.premiumAnswer.gatedTitle}</p>
      <p className="mt-2 text-sm text-amber-800">
        {accessToken
          ? text.questions.detail.premiumAnswer.gatedBodyLoggedIn
          : text.questions.detail.premiumAnswer.gatedBodyLoggedOut}
      </p>
      <Link
        href={accessToken ? PAGE_ROUTES.subscribe : PAGE_ROUTES.login}
        className="mt-4 inline-block min-h-11 rounded-md bg-blue-700 px-5 py-2 font-medium text-white"
      >
        {accessToken ? text.questions.detail.premiumAnswer.upgradeCta : text.questions.detail.premiumAnswer.loginCta}
      </Link>
    </div>
  );
}
