"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/lib/routes/useLocale";
import { localizedPath } from "@/lib/routes/locale";

export type SearchSuggestion = {
  key: string;
  /** PAGE_ROUTES-style relative href (e.g. "/questions/foo") — localized on navigate. */
  href: string;
  primary: string;
  secondary?: string;
};

type SearchAutocompleteProps = {
  id: string;
  ariaLabel: string;
  value: string;
  onChange: (value: string) => void;
  /** Small on-demand lookup (RTK Query `useLazy*Query` trigger, typically) — debounced internally, only called for queries of 2+ chars. */
  fetchSuggestions: (query: string) => Promise<SearchSuggestion[]>;
  placeholder?: string;
  className?: string;
};

/**
 * Editable-combobox typeahead: DOM focus stays on the `<input>` the whole
 * time (same "focus never leaves the trigger" reasoning as ui/Dropdown.tsx),
 * arrow keys drive `aria-activedescendant` over a listbox popup. Selecting a
 * suggestion navigates straight to that item's page; Enter with nothing
 * selected falls through to the wrapping `<form>`'s normal submit (full
 * search), so existing search-and-navigate-to-results behavior is
 * unchanged.
 */
export function SearchAutocomplete({
  id,
  ariaLabel,
  value,
  onChange,
  fetchSuggestions,
  placeholder,
  className,
}: SearchAutocompleteProps) {
  const router = useRouter();
  const lang = useLocale();
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const requestIdRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const trimmedValue = value.trim();
  // Derived, not stored: whether the popup should actually render. Avoids
  // needing a synchronous setState at the top of the effect below just to
  // hide stale suggestions the moment the query drops under 2 chars —
  // `isOpen` only ever needs setting from the async fetch callback or a
  // real event handler (focus/click/key), never synchronously in an effect.
  const canShowSuggestions = isOpen && trimmedValue.length >= 2;

  useEffect(() => {
    const trimmed = value.trim();
    if (trimmed.length < 2) {
      requestIdRef.current++; // invalidate any in-flight fetch; nothing to render regardless (canShowSuggestions above)
      return;
    }

    const requestId = ++requestIdRef.current;
    const timer = setTimeout(() => {
      fetchSuggestions(trimmed)
        .then((results) => {
          if (requestIdRef.current !== requestId) return; // superseded by a newer keystroke
          setSuggestions(results);
          setIsOpen(results.length > 0);
          setActiveIndex(-1);
        })
        .catch(() => {
          if (requestIdRef.current !== requestId) return;
          setSuggestions([]);
          setIsOpen(false);
        });
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fetchSuggestions is a RTK Query lazy-trigger, stable per mount; re-running this on its identity would defeat the debounce.
  }, [value]);

  useEffect(() => {
    if (!isOpen) return;
    function handlePointerDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isOpen]);

  function selectSuggestion(item: SearchSuggestion) {
    setIsOpen(false);
    router.push(localizedPath(lang, item.href));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!canShowSuggestions || suggestions.length === 0) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % suggestions.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
        break;
      case "Enter":
        // Only intercept when a suggestion is actually highlighted —
        // otherwise let the event through so the wrapping <form>'s own
        // onSubmit (full search) still fires, same as before this
        // component existed.
        if (activeIndex >= 0) {
          e.preventDefault();
          selectSuggestion(suggestions[activeIndex]!);
        } else {
          setIsOpen(false);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  }

  return (
    <div ref={containerRef} className={`relative ${className ?? ""}`}>
      <input
        id={id}
        type="search"
        role="combobox"
        aria-expanded={canShowSuggestions}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-activedescendant={canShowSuggestions && activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined}
        autoComplete="off"
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setIsOpen(true)}
        placeholder={placeholder}
        className="min-h-11 w-full rounded-md border border-border bg-surface px-3 text-text"
      />

      {canShowSuggestions && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-10 mt-1 w-full overflow-hidden rounded-md border border-border bg-surface shadow-(--shadow-border-hover)"
        >
          {suggestions.map((item, index) => (
            <li key={item.key} id={`${listboxId}-${index}`} role="option" aria-selected={index === activeIndex}>
              <button
                type="button"
                // Prevents the input from blurring (which would close the
                // popup via handlePointerDown) before the click registers.
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectSuggestion(item)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left ${
                  // bg-wash-bg, not bg-marker-100: marker-100 is a fixed,
                  // theme-invariant light tint (see globals.css), so pairing
                  // it with theme-adaptive text-text is unreadable in dark
                  // mode (light text on a background that never darkens).
                  // wash-bg IS re-themed per mode, so text-text stays
                  // readable against it either way.
                  index === activeIndex ? "bg-wash-bg" : ""
                }`}
              >
                <span className="text-sm text-text">{item.primary}</span>
                {item.secondary && <span className="text-xs text-text-muted">{item.secondary}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
