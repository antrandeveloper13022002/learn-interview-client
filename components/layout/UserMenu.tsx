"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/components/i18n/LocaleLink";
import { PAGE_ROUTES } from "@/lib/routes";
import { useLogoutMutation } from "@/lib/redux/authApi";
import { useText } from "@/lib/text/useText";
import { Avatar } from "@/components/ui/Avatar";
import { BookmarkIcon, PencilIcon, UserIcon, LogoutIcon, ChevronDownIcon } from "@/components/icons";
import type { SessionUser } from "@/lib/types";

type UserMenuProps = { user: SessionUser };

/**
 * Replaces the 4 separate desktop nav links (bookmarks/submissions/profile/
 * logout) with a single collapsed avatar+name trigger — click-toggle +
 * click-outside pattern, same as NotificationBell.tsx. Deliberately not
 * hover-only: a hover-only menu has no equivalent on touch and can't be
 * opened via keyboard — the engineer's own accessibility call, not a
 * documented business rule (there is none on this topic in
 * business-rule.md, don't cite one). Declaring `role="menu"` means this
 * also needs real keyboard support to match that ARIA contract, not just a
 * click target: ArrowDown/ArrowUp rove focus between items, Home/End jump
 * to the first/last, Escape closes and returns focus to the trigger, and
 * opening moves focus into the panel instead of leaving it stranded on the
 * trigger. `name` falls back to `email` when no `displayName` is set, same
 * fallback ProfileView.tsx uses.
 */
export function UserMenu({ user }: UserMenuProps) {
  const text = useText();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [logout] = useLogoutMutation();

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  // Move real focus into the panel on open — role="menu" implies the menu
  // itself (or its first item) receives focus, not just a visual popup
  // next to a still-focused trigger.
  useEffect(() => {
    if (!open) return;
    const items = panelRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]');
    items?.[0]?.focus();
  }, [open]);

  function menuItems(): HTMLElement[] {
    return Array.from(panelRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);
  }

  function focusItemAt(index: number) {
    const items = menuItems();
    if (items.length === 0) return;
    items[((index % items.length) + items.length) % items.length]?.focus();
  }

  function closeAndRefocusTrigger() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function handleTriggerKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      setOpen(true);
    }
  }

  function handlePanelKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const items = menuItems();
    const currentIndex = items.indexOf(document.activeElement as HTMLElement);
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        focusItemAt(currentIndex + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        focusItemAt(currentIndex - 1);
        break;
      case "Home":
        e.preventDefault();
        focusItemAt(0);
        break;
      case "End":
        e.preventDefault();
        focusItemAt(items.length - 1);
        break;
      case "Escape":
        e.preventDefault();
        closeAndRefocusTrigger();
        break;
      case "Tab":
        // Deliberately not `setOpen(false)` synchronously here (nor
        // `preventDefault`) — that would unmount the panel, including the
        // currently-focused menuitem, before the browser has computed
        // Tab's own default "move focus to the next element" action for
        // this same keydown. With the focused node already removed from
        // the DOM at that point, browsers commonly fall back to focusing
        // `<body>` instead of continuing tab order naturally past
        // UserMenu (real bug caught in code review 2026-08-19). Deferring
        // one tick lets native Tab handling move focus first; closing the
        // menu afterward no longer interferes with that.
        setTimeout(() => setOpen(false), 0);
        break;
    }
  }

  const name = user.displayName ?? user.email;

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={text.header.accountMenuLabel}
        className="flex h-11 shrink-0 items-center gap-2 rounded-md py-0 pr-2 pl-1.5 hover:bg-border"
      >
        <Avatar name={name} avatarUrl={user.avatarUrl} size="md" />
        <span className="max-w-32 truncate text-[0.9375rem] font-medium text-text">{name}</span>
        <ChevronDownIcon className={`size-4 shrink-0 text-text-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          ref={panelRef}
          role="menu"
          aria-label={text.header.accountMenuLabel}
          onKeyDown={handlePanelKeyDown}
          className="absolute right-0 top-[calc(100%+4px)] z-40 w-56 rounded-md border border-border bg-surface p-1 shadow-(--shadow-border)"
        >
          <Link
            href={PAGE_ROUTES.bookmarks}
            role="menuitem"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="flex min-h-10 items-center gap-2.5 rounded-sm px-2.5 text-sm font-medium text-text hover:bg-wash-bg focus-visible:bg-wash-bg focus-visible:outline-none"
          >
            <BookmarkIcon className="size-4.5 shrink-0" />
            {text.header.bookmarksLink}
          </Link>
          <Link
            href={PAGE_ROUTES.mySubmissions}
            role="menuitem"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="flex min-h-10 items-center gap-2.5 rounded-sm px-2.5 text-sm font-medium text-text hover:bg-wash-bg focus-visible:bg-wash-bg focus-visible:outline-none"
          >
            <PencilIcon className="size-4.5 shrink-0" />
            {text.header.mySubmissionsLink}
          </Link>
          <Link
            href={PAGE_ROUTES.profile}
            role="menuitem"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="flex min-h-10 items-center gap-2.5 rounded-sm px-2.5 text-sm font-medium text-text hover:bg-wash-bg focus-visible:bg-wash-bg focus-visible:outline-none"
          >
            <UserIcon className="size-4.5 shrink-0" />
            {text.header.profileLink}
          </Link>

          <div className="my-1 h-px bg-border" />

          <button
            type="button"
            role="menuitem"
            tabIndex={-1}
            onClick={() => {
              setOpen(false);
              logout();
            }}
            className="flex min-h-10 w-full items-center gap-2.5 rounded-sm px-2.5 text-left text-sm font-medium text-flag-text hover:bg-flag-bg focus-visible:bg-flag-bg focus-visible:outline-none"
          >
            <LogoutIcon className="size-4.5 shrink-0" />
            {text.header.logoutLabel}
          </button>
        </div>
      )}
    </div>
  );
}
