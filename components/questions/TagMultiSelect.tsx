"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon, CheckIcon } from "@/components/icons";
import { useText } from "@/lib/text/useText";
import type { QuestionTagOption } from "@/lib/types";

type TagMultiSelectProps = {
  options: QuestionTagOption[];
  selected: string[];
  onToggle: (tagName: string) => void;
  onClear: () => void;
};

/**
 * Checkbox multi-select, visually matching `Dropdown` (same trigger/popup
 * shell) but never closes on selection — every option stays a real,
 * independently focusable checkbox button rather than Dropdown's
 * roving-tabindex listbox, since a screen reader needs each option's
 * checked state announced as the user tabs through (FU-22).
 */
export function TagMultiSelect({ options, selected, onToggle, onClear }: TagMultiSelectProps) {
  const text = useText();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const hasActive = selected.length > 0;
  const label = hasActive ? text.questions.filters.tagsSelectedLabel(selected.length) : text.questions.filters.allTags;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`flex min-h-11 w-full min-w-40 items-center justify-between gap-2 rounded-md border px-3 text-left focus-visible:ring-2 focus-visible:ring-marker-500 focus-visible:outline-none ${
          hasActive ? "border-marker-500 bg-marker-100 text-text" : "border-border bg-surface text-text-muted"
        }`}
      >
        <span className={hasActive ? "font-medium text-text" : ""}>{label}</span>
        <ChevronDownIcon className={`size-4 shrink-0 text-text-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-10 mt-1 w-full min-w-56 overflow-hidden rounded-md border border-border bg-surface shadow-(--shadow-border)">
          <ul role="listbox" aria-multiselectable="true" className="max-h-64 overflow-auto p-1">
            {options.map((opt) => {
              const checked = selected.includes(opt.name);
              return (
                <li key={opt.id}>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={checked}
                    onClick={() => onToggle(opt.name)}
                    className="flex w-full items-center gap-2.5 rounded-sm px-3 py-2 text-left text-sm text-text hover:bg-marker-100"
                  >
                    <span
                      className={`flex size-4 shrink-0 items-center justify-center rounded border-2 ${
                        checked ? "border-marker-500 bg-marker-500" : "border-border"
                      }`}
                    >
                      {checked && <CheckIcon className="size-3 text-ink-950" />}
                    </span>
                    <span className="flex-1">{opt.name}</span>
                    <span className="font-mono text-xs text-text-muted">{opt.questionCount}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          {hasActive && (
            <div className="border-t border-border px-3 py-2">
              <button
                type="button"
                onClick={() => {
                  onClear();
                  setOpen(false);
                }}
                className="text-xs font-medium text-text-muted hover:text-text"
              >
                {text.questions.filters.clearTagsLabel}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
