"use client";

import { useId, useState } from "react";
import { Link } from "@/components/i18n/LocaleLink";
import { useAppSelector } from "@/lib/redux/hooks";
import { useGetNotificationPreferencesQuery, useUpdateNotificationPreferencesMutation } from "@/lib/redux/notificationsApi";
import { SkeletonGroup, Skeleton } from "@/components/Skeleton";
import { useText } from "@/lib/text/useText";
import { PAGE_ROUTES } from "@/lib/routes";

/**
 * Same isBootstrapped-first gating as ProfileView.tsx/BookmarksView.tsx —
 * this route also has no Server Component data to match.
 */
export function NotificationPreferencesView() {
  const text = useText();
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const isBootstrapped = useAppSelector((s) => s.auth.isBootstrapped);
  const { data, isLoading, isError, refetch } = useGetNotificationPreferencesQuery(undefined, { skip: !accessToken });

  if (!isBootstrapped) {
    return (
      <SkeletonGroup label={text.notifications.preferences.loadingSrOnly}>
        <div className="mt-8 flex flex-col gap-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </SkeletonGroup>
    );
  }

  if (!accessToken) {
    return (
      <div className="mt-8 rounded-lg border border-dashed border-border p-10 text-center">
        <p className="font-semibold text-text">{text.notifications.preferences.signedOutTitle}</p>
        <p className="mt-2 text-sm text-text-muted">{text.notifications.preferences.signedOutBody}</p>
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
      <SkeletonGroup label={text.notifications.preferences.loadingSrOnly}>
        <div className="mt-8 flex flex-col gap-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </SkeletonGroup>
    );
  }

  if (isError || !data) {
    return (
      <div role="alert" className="mt-8 rounded-lg border border-border bg-bg p-10 text-center">
        <p className="font-semibold text-text">{text.notifications.preferences.errorTitle}</p>
        <p className="mt-2 text-sm text-text-muted">{text.notifications.preferences.errorBody}</p>
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

  return <PreferencesForm renewalRemindersEnabled={data.renewalRemindersEnabled} />;
}

function PreferencesForm({ renewalRemindersEnabled }: { renewalRemindersEnabled: boolean }) {
  const text = useText();
  const t = text.notifications.preferences;
  const toggleId = useId();
  const [updatePreferences, { isLoading: isSaving, isSuccess, isError }] = useUpdateNotificationPreferencesMutation();
  const [justToggled, setJustToggled] = useState(false);

  function handleToggle(e: React.ChangeEvent<HTMLInputElement>) {
    setJustToggled(true);
    updatePreferences({ renewalRemindersEnabled: e.target.checked });
  }

  return (
    <div className="mt-8 flex flex-col gap-4">
      <div className="rounded-lg border border-dashed border-border bg-surface p-4">
        <p className="font-display text-sm font-semibold text-text">{t.transactionalGroupTitle}</p>
        <p className="mt-1 text-sm text-text-muted">{t.transactionalGroupBody}</p>
        <p className="mt-2 text-xs text-text-muted">{t.transactionalGroupNote}</p>
      </div>

      <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-surface p-4">
        <div>
          <p className="font-display text-sm font-semibold text-text">{t.remindersGroupTitle}</p>
          <p className="mt-1 text-sm text-text-muted">{t.remindersGroupBody}</p>
        </div>

        <label htmlFor={toggleId} className="relative inline-flex shrink-0 cursor-pointer items-center">
          <span className="sr-only">{t.remindersToggleLabel}</span>
          <input
            id={toggleId}
            type="checkbox"
            role="switch"
            checked={renewalRemindersEnabled}
            onChange={handleToggle}
            className="peer sr-only"
          />
          <span className="h-6 w-11 rounded-full bg-border transition-colors peer-checked:bg-marker-500 peer-focus-visible:ring-2 peer-focus-visible:ring-marker-500 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-bg" />
          <span className="absolute left-0.5 size-5 rounded-full bg-surface shadow-(--shadow-border) transition-transform peer-checked:translate-x-5" />
        </label>
      </div>

      <div aria-live="polite" className="min-h-5 text-sm">
        {isSaving && <span className="text-text-muted">{t.savingLabel}</span>}
        {!isSaving && isSuccess && justToggled && <span className="text-correct-text">{t.savedLabel}</span>}
        {!isSaving && isError && <span role="alert" className="text-flag-text">{t.saveError}</span>}
      </div>
    </div>
  );
}
