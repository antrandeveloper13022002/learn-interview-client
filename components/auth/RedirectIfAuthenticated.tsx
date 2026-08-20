"use client";

import { useEffect } from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import { useLocalizedRouter } from "@/lib/routes/useLocale";
import { PAGE_ROUTES } from "@/lib/routes";

/**
 * Mounted on /login and /register — sends an already-authenticated visitor
 * (back button, a stale tab, a bookmarked link) to the home page instead of
 * showing them the auth form again. Gated on `isBootstrapped`, same as
 * BookmarksView.tsx's reverse case: before the initial silent-refresh
 * resolves, `accessToken` is still null even for a real returning session,
 * so this briefly renders nothing extra rather than falsely redirecting a
 * guest — same one-flash tradeoff already accepted elsewhere in this app.
 */
export function RedirectIfAuthenticated() {
  const router = useLocalizedRouter();
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const isBootstrapped = useAppSelector((s) => s.auth.isBootstrapped);

  useEffect(() => {
    if (isBootstrapped && accessToken) {
      router.replace(PAGE_ROUTES.home);
    }
  }, [isBootstrapped, accessToken, router]);

  return null;
}
