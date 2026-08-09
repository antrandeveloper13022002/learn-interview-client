"use client";

import { useState } from "react";
import { Link } from "@/components/i18n/LocaleLink";
import { useAppSelector } from "@/lib/redux/hooks";
import { useUpdateProfileMutation } from "@/lib/redux/authApi";
import { Skeleton, SkeletonGroup } from "@/components/Skeleton";
import { useText } from "@/lib/text/useText";
import { PAGE_ROUTES } from "@/lib/routes";
import type { SessionUser } from "@/lib/types";

/**
 * Same isBootstrapped-first gating as BookmarksView.tsx — this route also
 * has no Server Component data to match, so a real logged-in visitor
 * shouldn't flash the sign-in prompt while SessionBootstrap's silent
 * refresh is still resolving.
 */
export function ProfileView() {
  const text = useText();
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const isBootstrapped = useAppSelector((s) => s.auth.isBootstrapped);
  const user = useAppSelector((s) => s.auth.user);

  if (!isBootstrapped) {
    return (
      <SkeletonGroup label={text.common.loading}>
        <div className="mt-8 flex flex-col gap-3">
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
        </div>
      </SkeletonGroup>
    );
  }

  if (!accessToken || !user) {
    return (
      <div className="mt-8 rounded-lg border border-dashed border-border p-10 text-center">
        <p className="font-semibold text-text">{text.profile.signedOutTitle}</p>
        <p className="mt-2 text-sm text-text-muted">{text.profile.signedOutBody}</p>
        <Link
          href={PAGE_ROUTES.login}
          className="mt-4 inline-block min-h-11 rounded-md bg-marker-500 px-5 py-2 font-semibold text-ink-950 hover:bg-marker-600"
        >
          {text.auth.login.submitLabel}
        </Link>
      </div>
    );
  }

  // Split out so this only ever mounts once `user` is actually resolved —
  // `key={user.id}` guarantees a fresh mount (and thus a correctly-seeded
  // `useState` initializer) if the signed-in user ever changes without a
  // full page reload. Same "mount only when ready" reasoning as
  // QuestionFormDialog.tsx's own form-dialog components.
  return <ProfileForm key={user.id} user={user} />;
}

function ProfileForm({ user }: { user: SessionUser }) {
  const text = useText();
  const [updateProfile, { isLoading, isSuccess, error }] = useUpdateProfileMutation();
  const [displayName, setDisplayName] = useState(user.displayName ?? "");
  const [touched, setTouched] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isLoading) return;
    setTouched(false);
    const trimmed = displayName.trim();
    // `null` clears it — matches the `PATCH /me/profile` contract
    // (dto's `.nullable()`, not `.optional()`: this endpoint always sets
    // exactly the field it's given, an empty box means "clear it").
    updateProfile({ displayName: trimmed === "" ? null : trimmed });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4" aria-busy={isLoading}>
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-text">{text.profile.emailLabel}</span>
        <p className="text-text-muted">{user.email}</p>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="profile-display-name" className="text-sm font-medium text-text">
          {text.profile.displayNameLabel}
        </label>
        <input
          id="profile-display-name"
          value={displayName}
          onChange={(e) => {
            setDisplayName(e.target.value);
            setTouched(true);
          }}
          placeholder={text.profile.displayNamePlaceholder}
          maxLength={100}
          className="min-h-11 rounded-md border border-border bg-surface px-3 text-text"
        />
        <span className="text-xs text-text-muted">{text.profile.displayNameHint}</span>
      </div>

      {error && (
        <p role="alert" className="text-sm text-flag-text">
          {text.profile.saveError}
        </p>
      )}
      {isSuccess && !touched && (
        <p role="status" className="text-sm text-correct-text">
          {text.profile.saveSuccess}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="min-h-11 self-start rounded-md bg-marker-500 px-5 font-semibold text-ink-950 hover:bg-marker-600 disabled:opacity-60"
      >
        {isLoading ? text.profile.savingLabel : text.profile.saveLabel}
      </button>
    </form>
  );
}
