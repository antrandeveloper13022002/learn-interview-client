"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Link } from "@/components/i18n/LocaleLink";
import { useLocalizedRouter } from "@/lib/routes/useLocale";
import { useRefreshMutation } from "@/lib/redux/authApi";
import { useText } from "@/lib/text/useText";
import { PAGE_ROUTES } from "@/lib/routes";

// This component is only rendered from app/auth/google/callback/page.tsx,
// deliberately unprefixed (fixed Google OAuth redirect URI — see
// tasks/frontend-user.md FU-19). useLocalizedRouter/LocaleLink fall back to
// the VN-first default here since there's no [lang] segment to read; the
// user always lands back on /vi after Google sign-in regardless of which
// locale they started from — a known limitation, not a bug, since Google's
// redirect carries no locale state.
export function GoogleCallbackStatus() {
  const text = useText();
  const params = useSearchParams();
  const router = useLocalizedRouter();
  const [refresh] = useRefreshMutation();
  const attempted = useRef(false);
  const [failed, setFailed] = useState(params.get("error") === "1");

  useEffect(() => {
    if (attempted.current || failed) return;
    attempted.current = true;
    refresh()
      .unwrap()
      .then(() => router.replace(PAGE_ROUTES.home))
      .catch(() => setFailed(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [failed]);

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
