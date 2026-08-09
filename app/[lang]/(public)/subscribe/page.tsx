import type { Metadata } from "next";
import { getSubscriptionPlans } from "@/lib/api/subscription";
import { PlanSelector } from "@/components/subscription/PlanSelector";
import { getText } from "@/lib/text";
import { PAGE_ROUTES } from "@/lib/routes";
import { SUPPORTED_LOCALES, localizedPath, resolveLocale } from "@/lib/routes/locale";

type Props = {
  params: Promise<{ lang: string }>;
};

// Deliberately indexable, unlike /bookmarks and /checkout/return: the
// plan list itself is public, non-personalized content (a pricing page is
// legitimate SEO surface, same reasoning many SaaS sites index their own
// pricing pages), and nothing on this page requires a session to view —
// only the "select a plan" action does. seo-guideline.md's "consider
// disallowing /checkout*-type paths" is a judgment call, not a blanket
// rule; the actual auth-required, no-unique-content page is the callback
// route, noindexed separately.
//
// Static `metadata` became `generateMetadata` (needs `params.lang` for the
// canonical/hreflang prefix — see tasks/frontend-user.md FU-19).
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = resolveLocale(rawLang);
  const text = getText(lang);
  const canonical = localizedPath(lang, PAGE_ROUTES.subscribe);
  return {
    title: text.subscription.subscribe.pageTitle,
    description: text.subscription.subscribe.pageIntro,
    alternates: {
      canonical,
      languages: Object.fromEntries(SUPPORTED_LOCALES.map((l) => [l, localizedPath(l, PAGE_ROUTES.subscribe)])),
    },
    openGraph: {
      title: text.subscription.subscribe.pageTitle,
      description: text.subscription.subscribe.pageIntro,
      url: canonical,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: text.subscription.subscribe.pageTitle,
      description: text.subscription.subscribe.pageIntro,
    },
  };
}

export default async function SubscribePage({ params }: Props) {
  const { lang: rawLang } = await params;
  const lang = resolveLocale(rawLang);
  const text = getText(lang);
  const plans = await getSubscriptionPlans();

  return (
    <div className="min-h-full bg-bg pb-12 text-text">
      <div className="mx-auto w-full max-w-4xl px-4 py-10 text-center">
        <h1 className="font-display text-2xl font-semibold tracking-tight">{text.subscription.subscribe.pageHeading}</h1>
        <p className="mt-2 text-text-muted">{text.subscription.subscribe.pageIntro}</p>
        <PlanSelector plans={plans} />
      </div>
    </div>
  );
}
