"use client";

import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import { useGetMyNotificationsQuery } from "@/lib/redux/notificationsApi";
import { useText } from "@/lib/text/useText";
import { NotificationList } from "@/components/notifications/NotificationList";
import { BellIcon } from "@/components/icons";

/**
 * Guests never see the bell at all (mirrors BookmarkToggle.tsx — no
 * accessToken, no render), not just a disabled/empty state — matches
 * FU-13's own DoD wording exactly.
 */
export function NotificationBell() {
  const text = useText();
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Same click-outside pattern as components/ui/Dropdown.tsx.
  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  const { data } = useGetMyNotificationsQuery(undefined, { skip: !accessToken });

  if (!accessToken) return null;

  const unreadCount = data?.unreadCount ?? 0;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={text.header.notificationsLabel}
        className="relative grid size-11 shrink-0 place-items-center rounded-md text-text-muted hover:bg-border hover:text-text"
      >
        <BellIcon className="size-5" />
        {unreadCount > 0 && (
          <span
            aria-label={text.notifications.unreadBadgeAriaLabel(unreadCount)}
            className="absolute right-1.5 top-1.5 grid size-4 min-w-4 place-items-center rounded-full bg-flag-600 px-1 text-[10px] font-semibold text-paper-0"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-[calc(100%+4px)] z-40 w-80 max-w-[90vw] overflow-hidden rounded-md border border-border bg-surface shadow-(--shadow-border)"
          role="dialog"
          aria-label={text.notifications.heading}
        >
          <NotificationList />
        </div>
      )}
    </div>
  );
}
