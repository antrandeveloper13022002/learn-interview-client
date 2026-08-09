"use client";

import { getText } from "@/lib/text";
import { DEFAULT_LOCALE } from "@/lib/routes/locale";

// A root-level error boundary can fire before any [lang] context is
// reliably available, so this always renders the VN-first default —
// same reasoning as app/not-found.tsx's hardcoded fallback.
const text = getText(DEFAULT_LOCALE);

export default function GlobalError({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="vi">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg p-8 text-center text-text">
          <h1 className="font-display text-2xl font-semibold">{text.common.genericErrorTitle}</h1>
          <p className="text-text-muted">{text.common.genericErrorBody}</p>
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="rounded-md bg-marker-500 px-4 py-2 font-semibold text-ink-950 hover:bg-marker-600"
          >
            {text.common.retryLabel}
          </button>
        </div>
      </body>
    </html>
  );
}
