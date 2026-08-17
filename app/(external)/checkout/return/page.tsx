import type { Metadata } from "next";
import { CheckoutCallbackStatus } from "@/components/subscription/CheckoutCallbackStatus";
import { getText } from "@/lib/text";
import { DEFAULT_LOCALE } from "@/lib/routes/locale";

const text = getText(DEFAULT_LOCALE);

// Transient, auth-required, no unique content to index — same "second
// layer beyond robots.txt" reasoning as /bookmarks (seo-guideline.md).
export const metadata: Metadata = {
  title: text.subscription.callback.pageTitle,
  robots: { index: false, follow: false },
};

export default function SubscribeCallbackPage() {
  return (
    <div className="min-h-full bg-bg text-text">
      <div className="mx-auto flex min-h-[80vh] w-full max-w-sm flex-col justify-center gap-6 px-4 py-16">
        <CheckoutCallbackStatus />
      </div>
    </div>
  );
}
