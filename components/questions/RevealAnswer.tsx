"use client";

import { useState } from "react";
import { useText } from "@/lib/text/useText";

/**
 * Flashcard-style reveal: the real answer is already in the DOM (SEO-safe —
 * crawlers see the text), just visually blurred until the visitor clicks
 * through, encouraging them to try answering themselves first. Unrelated to
 * Premium gating (business-rule.md#premium-gating) — that boundary withholds
 * the answer server-side entirely; this only ever wraps answer text the
 * client already legitimately has.
 */
export function RevealAnswer({ children }: { children: React.ReactNode }) {
  const [revealed, setRevealed] = useState(false);
  const text = useText();

  if (revealed) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div aria-hidden="true" className="pointer-events-none select-none blur-sm">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <button
          type="button"
          onClick={() => setRevealed(true)}
          className="min-h-11 rounded-md bg-marker-500 px-5 py-2 font-semibold text-ink-950 hover:bg-marker-600"
        >
          {text.questions.detail.revealAnswerCta}
        </button>
      </div>
    </div>
  );
}
