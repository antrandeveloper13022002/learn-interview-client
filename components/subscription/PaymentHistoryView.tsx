"use client";

import { Link } from "@/components/i18n/LocaleLink";
import { useAppSelector } from "@/lib/redux/hooks";
import { useGetMyPaymentsQuery } from "@/lib/redux/subscriptionApi";
import { SkeletonGroup, Skeleton } from "@/components/Skeleton";
import { useText } from "@/lib/text/useText";
import { useLocale } from "@/lib/routes/useLocale";
import { PAGE_ROUTES } from "@/lib/routes";
import { formatDate, formatUsd, formatVnd } from "@/lib/format";

const STATUS_BADGE_CLASS: Record<string, string> = {
  SUCCESS: "bg-correct-bg text-correct-text",
  FAILED: "bg-flag-bg text-flag-text",
  PENDING: "bg-wash-bg text-wash-text",
  REFUNDED: "bg-wash-bg text-wash-text",
};

/**
 * Same isBootstrapped-first gating as ProfileView.tsx/BookmarksView.tsx —
 * this route also has no Server Component data to match, so a real
 * logged-in visitor shouldn't flash the sign-in prompt while
 * SessionBootstrap's silent refresh is still resolving.
 */
export function PaymentHistoryView() {
  const text = useText();
  const lang = useLocale();
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const isBootstrapped = useAppSelector((s) => s.auth.isBootstrapped);
  const { data, isLoading, isError, refetch } = useGetMyPaymentsQuery(undefined, { skip: !accessToken });

  if (!isBootstrapped) {
    return (
      <SkeletonGroup label={text.paymentHistory.loadingSrOnly}>
        <div className="mt-8 flex flex-col gap-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </SkeletonGroup>
    );
  }

  if (!accessToken) {
    return (
      <div className="mt-8 rounded-lg border border-dashed border-border p-10 text-center">
        <p className="font-semibold text-text">{text.paymentHistory.signedOutTitle}</p>
        <p className="mt-2 text-sm text-text-muted">{text.paymentHistory.signedOutBody}</p>
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
      <SkeletonGroup label={text.paymentHistory.loadingSrOnly}>
        <div className="mt-8 flex flex-col gap-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </SkeletonGroup>
    );
  }

  if (isError) {
    return (
      <div role="alert" className="mt-8 rounded-lg border border-border bg-bg p-10 text-center">
        <p className="font-semibold text-text">{text.paymentHistory.errorTitle}</p>
        <p className="mt-2 text-sm text-text-muted">{text.paymentHistory.errorBody}</p>
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

  if (!data || data.length === 0) {
    return (
      <div className="mt-8 rounded-lg border border-dashed border-border p-10 text-center">
        <p className="font-semibold text-text">{text.paymentHistory.emptyTitle}</p>
        <p className="mt-2 text-sm text-text-muted">{text.paymentHistory.emptyBody}</p>
        <Link href={PAGE_ROUTES.subscribe} className="mt-4 inline-block text-sm font-medium text-marker-700">
          {text.paymentHistory.browseSubscribeLink}
        </Link>
      </div>
    );
  }

  return (
    <ul className="mt-8 flex flex-col gap-3">
      {data.map((entry) => {
        const planLabel = text.subscription.planName[entry.planCode] ?? entry.planName;
        return (
          <li
            key={entry.id}
            className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-4 shadow-(--shadow-border) sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium text-text">{planLabel}</p>
              <p className="text-sm text-text-muted">{formatDate(entry.createdAt, lang)}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              {/* Fixed width + tabular-nums + right-aligned: amounts vary
                  in digit count (20.000 vs 250.000). Both this and the
                  badge below need a fixed width for the row to actually
                  line up — fixing only one still let the other's varying
                  width shift the whole group, since justify-between
                  anchors this group's right edge, not its left. Converts
                  to the plan's current listed USD price on the English
                  site (business-rule.md#subscription) — not what was
                  actually charged in VND at the time, since it's a fixed
                  listed price, not a stored historical exchange rate. */}
              <span className="font-display w-24 text-right font-semibold tabular-nums text-text">
                {lang === "en" ? formatUsd(entry.priceUsdCents ?? 0) : formatVnd(entry.amount)}
              </span>
              {/* Fixed width too, same reason as the price span above: the
                  status labels vary in length ("Failed" vs "Succeeded" vs
                  "Đã hoàn tiền") — without a fixed width here, the *total*
                  width of this price+badge group still shifted per row
                  even with the price column fixed, since justify-between
                  anchors the group's right edge, not its left. */}
              <span
                className={`w-28 shrink-0 rounded-full px-3 py-1 text-center text-xs font-medium ${STATUS_BADGE_CLASS[entry.status] ?? "bg-wash-bg text-wash-text"}`}
              >
                {text.paymentHistory.statusLabel[entry.status] ?? entry.status}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
