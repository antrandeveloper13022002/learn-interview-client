"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Link } from "@/components/i18n/LocaleLink";
import { useLocalizedRouter } from "@/lib/routes/useLocale";
import { useAppSelector } from "@/lib/redux/hooks";
import { useText } from "@/lib/text/useText";
import { PAGE_ROUTES } from "@/lib/routes";

// This component is only rendered from app/auth/google/callback/page.tsx,
// deliberately unprefixed (fixed Google OAuth redirect URI — see
// tasks/frontend-user.md FU-19). useLocalizedRouter/LocaleLink fall back to
// the VN-first default here since there's no [lang] segment to read; the
// user always lands back on /vi after Google sign-in regardless of which
// locale they started from — a known limitation, not a bug, since Google's
// redirect carries no locale state.
//
// Deliberately does NOT call useRefreshMutation itself (2026-08-18 fix) —
// SessionBootstrap already fires exactly one refresh() on every page load,
// this one included (a full browser navigation from Google's redirect
// remounts the whole app). A second, independent refresh() call here raced
// it: the refresh token is single-use/rotating, so whichever call the
// backend processed second always got 401'd, and authApi.ts's refresh
// mutation unconditionally dispatches sessionCleared() on failure —
// wiping out the session the *other* call had just established a moment
// earlier. Watching SessionBootstrap's own result instead means there is
// only ever one refresh call on this page, so there is nothing left to
// race.
export function GoogleCallbackStatus() {
  const text = useText();
  const params = useSearchParams();
  const router = useLocalizedRouter();
  const isBootstrapped = useAppSelector((s) => s.auth.isBootstrapped);
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const backendFailed = params.get("error") === "1";
  const failed = backendFailed || (isBootstrapped && !accessToken);

  useEffect(() => {
    if (!backendFailed && isBootstrapped && accessToken) {
      router.replace(PAGE_ROUTES.home);
    }
  }, [backendFailed, isBootstrapped, accessToken, router]);

  if (failed) {
    return (
      <div role="alert" className="rounded-lg border border-border bg-surface p-6 text-center shadow-(--shadow-border)">
        <p className="font-semibold text-text">{text.auth.googleCallback.failedTitle}</p>
        <p className="mt-2 text-sm text-text-muted">{text.auth.googleCallback.failedBody}</p>
        <Link href={PAGE_ROUTES.login} className="mt-4 inline-block text-sm font-medium text-marker-700">
          {text.auth.googleCallback.backToLoginLink}
        </Link>
      </div>
    );
  }

  return (
    <div role="status" aria-busy="true" className="text-center">
      <span className="sr-only">{text.auth.googleCallback.completingSrOnly}</span>
      <p className="text-text-muted">{text.auth.googleCallback.completingBody}</p>
    </div>
  );
}
