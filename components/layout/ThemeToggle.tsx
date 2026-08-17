"use client";

import { useEffect, useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "@/components/icons";
import { useText } from "@/lib/text/useText";

const STORAGE_KEY = "theme-preference";

// data-theme is an external mutable source (set pre-hydration by the inline
// script in layout.tsx, and by this component's own toggle() below) —
// useSyncExternalStore reads it without the setState-in-effect pattern
// (avoids react-hooks' "avoid calling setState directly within an effect"
// rule) and without a hydration mismatch, since getServerSnapshot below
// matches what the server always renders.
function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function getSnapshot() {
  return document.documentElement.getAttribute("data-theme") === "dark";
}

function getServerSnapshot() {
  return false;
}

export function ThemeToggle() {
  const text = useText();
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Fallback for routes where layout.tsx's pre-hydration inline script
  // doesn't run (confirmed on the notFound() render path — Next/Turbopack
  // renders that boundary client-side, where a beforeInteractive Script
  // never executes). Without this, data-theme stays unset there and
  // globals.css's `[data-theme="dark"]` selector never matches, silently
  // ignoring a saved dark preference. No-ops on routes where the inline
  // script already ran.
  useEffect(() => {
    if (document.documentElement.hasAttribute("data-theme")) return;
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // Private browsing / storage disabled — fall back to system preference.
    }
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    document.documentElement.setAttribute("data-theme", stored || (prefersDark ? "dark" : "light"));
  }, []);

  function toggle() {
    const next = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private browsing / storage disabled — theme just won't persist across reloads.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDark}
      className="inline-grid min-h-11 min-w-11 place-items-center rounded-md text-text-muted transition-colors hover:bg-border hover:text-text"
    >
      {isDark ? <SunIcon className="size-5" /> : <MoonIcon className="size-5" />}
      <span className="sr-only">{isDark ? text.themeToggle.switchToLight : text.themeToggle.switchToDark}</span>
    </button>
  );
}
