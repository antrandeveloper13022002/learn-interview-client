"use client";

import { text } from "@/lib/text";

export default function GlobalError({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="vi">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
          <h1 className="text-2xl font-semibold">{text.common.genericErrorTitle}</h1>
          <p className="text-neutral-600">{text.common.genericErrorBody}</p>
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="rounded-md bg-neutral-900 px-4 py-2 text-white"
          >
            {text.common.retryLabel}
          </button>
        </div>
      </body>
    </html>
  );
}
