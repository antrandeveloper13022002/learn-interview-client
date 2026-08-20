import type { Metadata } from "next";
import { Link } from "@/components/i18n/LocaleLink";
import { getQuestions } from "@/lib/api/questions";
import { getSubscriptionPlans } from "@/lib/api/subscription";
import { PlanSelector } from "@/components/subscription/PlanSelector";
import { getText } from "@/lib/text";
import { PAGE_ROUTES } from "@/lib/routes";
import { SUPPORTED_LOCALES, localizedPath, resolveLocale } from "@/lib/routes/locale";
import { PAYMENTS_ENABLED } from "@/lib/constants";

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
  const title = PAYMENTS_ENABLED ? text.subscription.subscribe.pageTitle : text.subscription.subscribe.comingSoonTitle;
  const description = PAYMENTS_ENABLED ? text.subscription.subscribe.pageIntro : text.subscription.subscribe.comingSoonBody;
  return {
    title,
    description,
    // Nothing unique or actionable here yet while payment is hidden — see
    // this page's own "Deliberately indexable" comment above for why it's
    // normally indexed; that reasoning only holds once there's a real plan
    // list/checkout to index.
    ...(PAYMENTS_ENABLED ? {} : { robots: { index: false, follow: true } }),
    alternates: {
      canonical,
      languages: Object.fromEntries(SUPPORTED_LOCALES.map((l) => [l, localizedPath(l, PAGE_ROUTES.subscribe)])),
    },
    openGraph: { title, description, url: canonical, type: "website" },
    twitter: { card: "summary", title, description },
  };
}

export default async function SubscribePage({ params }: Props) {
  const { lang: rawLang } = await params;
  const lang = resolveLocale(rawLang);
  const text = getText(lang);

  if (!PAYMENTS_ENABLED) {
    return (
      <div className="min-h-full bg-bg pb-12 text-text">
        <div className="mx-auto w-full max-w-2xl px-4 py-16 text-center">
          <h1 className="font-display text-2xl font-semibold tracking-tight">{text.subscription.subscribe.comingSoonTitle}</h1>
          <p className="mt-3 text-text-muted">{text.subscription.subscribe.comingSoonBody}</p>
          <Link
            href={PAGE_ROUTES.questions}
            className="mt-6 inline-flex min-h-11 items-center rounded-md bg-marker-500 px-5 font-semibold text-ink-950 hover:bg-marker-600"
          >
            {text.subscription.subscribe.comingSoonCta}
          </Link>
        </div>
      </div>
    );
  }

  // business-rule.md#subscription: only 2 plans exist (MONTHLY/LIFETIME),
  // each carrying both a real priceVnd and a display-only priceUsdCents at
  // once — no currency-based filtering needed, PlanSelector.tsx picks
  // which price field to render based on the site's language instead.
  const [plans, freeQuestions] = await Promise.all([
    getSubscriptionPlans(),
    // pageSize: 1 — only `total` is used, the Free card's "access every
    // free question" benefit; fetching the full list would be wasted work.
    getQuestions({ isPremium: false, pageSize: 1 }, lang),
  ]);

  return (
    <div className="min-h-full bg-bg pb-12 text-text">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 text-center">
        <h1 className="font-display text-2xl font-semibold tracking-tight">{text.subscription.subscribe.pageHeading}</h1>
        <p className="mt-2 text-text-muted">{text.subscription.subscribe.pageIntro}</p>
        <PlanSelector plans={plans} freeQuestionCount={freeQuestions.total} />
      </div>
    </div>
  );
}
