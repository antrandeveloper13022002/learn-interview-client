"use client";

import { useEffect, useRef } from "react";
import { useRefreshMutation } from "@/lib/redux/authApi";

/**
 * Fires once per app load to silently restore a session from the backend's
 * httpOnly refresh-token cookie (see docs/architecture/sequence-diagram.md#0).
 * Renders nothing — mounted once inside ReduxProvider, above the page tree.
 *
 * The `hasFiredRef` guard matters here specifically because of dev-mode
 * double-invoked effects: the refresh token is single-use/rotating — a
 * second concurrent call always loses that race (401), and if its rejection
 * is processed after the first call's success, Redux settles on "logged
 * out" even though the session was, and still is, valid. Same bug already
 * found and fixed in frontend-admin's SessionBootstrap.tsx (2026-08-07) —
 * reproduced live there as "a fresh login followed by a normal page
 * navigation bounced back to /login despite the underlying session being
 * fine" — ported the same guard here since frontend-user never got it.
 */
export function SessionBootstrap() {
  const [refresh] = useRefreshMutation();
  const hasFiredRef = useRef(false);

  useEffect(() => {
    if (hasFiredRef.current) return;
    hasFiredRef.current = true;
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
