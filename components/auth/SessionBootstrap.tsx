"use client";

import { useEffect } from "react";
import { useRefreshMutation } from "@/lib/redux/authApi";

/**
 * Fires once per app load to silently restore a session from the backend's
 * httpOnly refresh-token cookie (see docs/architecture/sequence-diagram.md#0).
 * Renders nothing — mounted once inside ReduxProvider, above the page tree.
 */
export function SessionBootstrap() {
  const [refresh] = useRefreshMutation();

  useEffect(() => {
    refresh();
    // Intentionally runs once per mount (once per full page load) — this
    // is not a polling refresh, just the initial silent-login attempt.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
