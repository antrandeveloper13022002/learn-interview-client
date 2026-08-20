import type { Metadata } from "next";
import { PaymentHistoryView } from "@/components/subscription/PaymentHistoryView";
import { getText } from "@/lib/text";
import { resolveLocale } from "@/lib/routes/locale";

type Props = {
  params: Promise<{ lang: string }>;
};

// Authenticated-only content with no server-side session to check (FU-03:
// Server Components are guest-scoped) — `robots: { index: false }` is the
// second layer seo-guideline.md asks for on top of robots.txt's disallow,
// same as bookmarks/notification-preferences.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const text = getText(resolveLocale(rawLang));
  return {
    title: text.paymentHistory.pageTitle,
    robots: { index: false, follow: false },
  };
}

export default async function PaymentHistoryPage({ params }: Props) {
  const { lang: rawLang } = await params;
  const text = getText(resolveLocale(rawLang));

  return (
    <div className="min-h-full bg-bg pb-12 text-text">
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <h1 className="font-display text-2xl font-semibold tracking-tight">{text.paymentHistory.pageHeading}</h1>
        <p className="mt-2 text-text-muted">{text.paymentHistory.pageIntro}</p>
        <PaymentHistoryView />
      </div>
    </div>
  );
}
