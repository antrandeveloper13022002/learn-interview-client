"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ChevronDownIcon } from "@/components/icons";

export type DropdownOption = {
  value: string;
  label: string;
  /** Small color-coded dot rendered before the label (e.g. difficulty). */
  dotClassName?: string;
};

type DropdownProps = {
  id?: string;
  value: string;
  options: DropdownOption[];
  /** Label for the empty/"all" choice, prepended as the first option (value=""). Omit when every option is a real, always-selected value (e.g. a language switcher). */
  placeholder?: string;
  onChange: (value: string) => void;
  /** Which side of the trigger the popup opens on. Default "bottom"; use "top" near the bottom of the viewport (e.g. a footer) so the popup doesn't get clipped. */
  menuPlacement?: "top" | "bottom";
};

/**
 * Custom listbox replacing a native `<select>` — visual/interaction
 * reference: the Figma Make prototype's Version 3 pass (see
 * tasks/frontend-user.md FU-18). Keeps DOM focus on the trigger button and
 * drives the active option via `aria-activedescendant`, the same pattern
 * a native `<select>` itself uses — simpler to get right than moving real
 * focus into the popup, and avoids a focus round-trip on every keypress.
 */
export function Dropdown({ id, value, options, placeholder, onChange, menuPlacement = "bottom" }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxId = useId();
  const generatedId = useId();
  const triggerId = id ?? generatedId;

  const allOptions = useMemo(
    () => (placeholder === undefined ? options : [{ value: "", label: placeholder }, ...options]),
    [options, placeholder],
  );
  const selectedIndex = Math.max(
    0,
    allOptions.findIndex((o) => o.value === value),
  );
  const selected = allOptions[selectedIndex]!;

  function openDropdown() {
    setActiveIndex(selectedIndex);
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  function selectAt(index: number) {
    const option = allOptions[index];
    if (!option) return;
    onChange(option.value);
    setOpen(false);
    triggerRef.current?.focus();
  }

  // Focus never leaves the trigger button (see the component doc comment
  // above), so this single handler covers both "closed, about to open" and
  // "open, navigating options" — there is no separate focused listbox
  // element to attach a second keydown handler to.
  function handleTriggerKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openDropdown();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, allOptions.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(allOptions.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        selectAt(activeIndex);
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
        if (e.key.length === 1) {
          const match = allOptions.findIndex((o) => o.label.toLowerCase().startsWith(e.key.toLowerCase()));
          if (match !== -1) setActiveIndex(match);
        }
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        id={triggerId}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => (open ? setOpen(false) : openDropdown())}
        onKeyDown={handleTriggerKeyDown}
        className="flex min-h-11 w-full min-w-40 items-center justify-between gap-2 rounded-md border border-border bg-surface px-3 text-left text-text focus-visible:ring-2 focus-visible:ring-marker-500 focus-visible:outline-none"
      >
        <span className={`inline-flex items-center gap-2 ${selected.value ? "" : "text-text-muted"}`}>
          {selected.dotClassName && <span className={`size-2 shrink-0 rounded-full ${selected.dotClassName}`} />}
          {selected.label}
        </span>
        <ChevronDownIcon className={`size-4 shrink-0 text-text-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          className={`absolute z-10 w-full min-w-max overflow-hidden rounded-md border border-border bg-surface shadow-(--shadow-border) ${
            menuPlacement === "top" ? "bottom-full mb-1" : "mt-1"
          }`}
        >
          <ul
            id={listboxId}
            role="listbox"
            tabIndex={-1}
            aria-activedescendant={`${listboxId}-${activeIndex}`}
            className="max-h-64 overflow-auto p-1 focus:outline-none"
          >
            {allOptions.map((option, index) => (
              <li
                key={option.value || "__all__"}
                id={`${listboxId}-${index}`}
                role="option"
                aria-selected={index === selectedIndex}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => selectAt(index)}
                className={`flex cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-sm text-text ${
                  // bg-wash-bg, not bg-marker-100: marker-100 is a fixed,
                  // theme-invariant light tint (see globals.css), so paired
                  // with theme-adaptive text-text it's unreadable in dark
                  // mode. wash-bg re-themes per mode instead.
                  index === activeIndex ? "bg-wash-bg" : ""
                }`}
              >
                {option.dotClassName && <span className={`size-2 shrink-0 rounded-full ${option.dotClassName}`} />}
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
