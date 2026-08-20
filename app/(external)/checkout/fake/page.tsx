import type { Metadata } from "next";
import { Suspense } from "react";
import { FakeCheckoutStatus } from "@/components/subscription/FakeCheckoutStatus";
import { getText } from "@/lib/text";
import { DEFAULT_LOCALE } from "@/lib/routes/locale";

const text = getText(DEFAULT_LOCALE);

// Transient, auth-required, never-real-money page — never indexed, same
// reasoning as /checkout/return's own metadata.
export const metadata: Metadata = {
  title: text.subscription.fakeCheckout.pageTitle,
  robots: { index: false, follow: false },
};

export default function FakeCheckoutPage() {
  return (
    <div className="min-h-full bg-bg text-text">
      <div className="mx-auto flex min-h-[80vh] w-full max-w-sm flex-col justify-center gap-6 px-4 py-16">
        {/* FakeCheckoutStatus reads txnRef/amount via useSearchParams —
            needs a Suspense boundary, same as GoogleCallbackStatus's page. */}
        <Suspense fallback={<p className="text-center text-text-muted">{text.common.loading}</p>}>
          <FakeCheckoutStatus />
        </Suspense>
      </div>
    </div>
  );
}
