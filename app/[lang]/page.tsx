import type { Metadata } from "next";
import { Link } from "@/components/i18n/LocaleLink";
import { getText } from "@/lib/text";
import { PAGE_ROUTES } from "@/lib/routes";
import { SUPPORTED_LOCALES, localizedPath, resolveLocale } from "@/lib/routes/locale";
import { APP_NAME, PAYMENTS_ENABLED } from "@/lib/constants";
import { getCategories, getQuestions } from "@/lib/api/questions";
import { TargetIcon, ChatIcon, BookmarkIcon, SearchIcon, CheckIcon, ArrowRightIcon } from "@/components/icons";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = resolveLocale(rawLang);
  const text = getText(lang);
  const canonical = localizedPath(lang, PAGE_ROUTES.home);
  return {
    alternates: {
      canonical,
      languages: Object.fromEntries(SUPPORTED_LOCALES.map((l) => [l, localizedPath(l, PAGE_ROUTES.home)])),
    },
    openGraph: {
      title: APP_NAME,
      description: text.home.siteDescription,
      url: canonical,
      type: "website",
    },
    twitter: { card: "summary", title: APP_NAME, description: text.home.siteDescription },
  };
}

const BENEFIT_ICONS = [TargetIcon, ChatIcon, BookmarkIcon];

export default async function Home({ params }: Props) {
  const { lang: rawLang } = await params;
  const lang = resolveLocale(rawLang);
  const text = getText(lang);
  // Real data, not illustrative counts — guest-scoped server fetch, same
  // path /questions itself uses (lib/api/client.ts never forwards a
  // session here, so this is safe to cache/revalidate across visitors).
  const [categories, questionTotals] = await Promise.all([getCategories(lang), getQuestions({ pageSize: 1 }, lang)]);
  const categoryCounts = await Promise.all(
    categories.map((c) => getQuestions({ categoryId: c.id, pageSize: 1 }, lang).then((r) => r.total)),
  );

  return (
    <div className="min-h-full bg-bg pb-12 text-text">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      {/* ======================= Hero ======================= */}
      <section className="grid grid-cols-1 items-center gap-8 md:grid-cols-[1.15fr_0.85fr] md:gap-12">
        <div>
          <p className="font-mono inline-flex items-center gap-2 rounded-full bg-wash-bg px-3 py-1 text-[0.8125rem] font-medium text-wash-text">
            {text.home.eyebrow}
          </p>
          <h1 className="font-display mt-4 max-w-[20ch] text-4xl leading-[1.05] font-semibold tracking-tight text-balance md:text-[2.5rem]">
            {text.home.heroHeadingBeforeMark}
            <span className="mark">{text.home.heroHeadingMark}</span>
          </h1>
          <p className="mt-4 max-w-[52ch] text-[1.0625rem] text-text-muted text-pretty">{text.home.heroSub}</p>

          <form action={localizedPath(lang, PAGE_ROUTES.questions)} className="mt-6 flex max-w-[480px] gap-2">
            <div className="relative flex-1">
              <label htmlFor="hero-search" className="sr-only">
                {text.home.searchAriaLabel}
              </label>
              <SearchIcon className="pointer-events-none absolute inset-y-0 left-3 my-auto size-5 text-text-muted" />
              <input
                id="hero-search"
                name="q"
                type="search"
                placeholder={text.home.searchPlaceholder}
                className="min-h-11 w-full rounded-md border border-border bg-surface py-2 pr-3 pl-10 text-base text-text shadow-(--shadow-border) focus-visible:outline-2 focus-visible:outline-focus-ring"
              />
            </div>
            <button
              type="submit"
              className="min-h-11 rounded-md bg-marker-500 px-4 font-semibold text-ink-950 shadow-(--shadow-border) hover:bg-marker-600"
            >
              {text.home.searchSubmit}
            </button>
          </form>
        </div>

        <div aria-hidden="true" className="flex items-center justify-center">
          <div className="relative w-full max-w-[320px]">
            <div className="absolute inset-0 rotate-6 translate-y-1 rounded-[18px] bg-paper-200 shadow-(--shadow-border)" />
            <div className="relative -rotate-3 rounded-[18px] bg-surface p-6 shadow-(--shadow-border-hover)">
              <span className="absolute -top-3.5 -right-2.5 grid size-10 place-items-center rounded-full bg-marker-500 text-ink-950 shadow-(--shadow-border-hover) rotate-[10deg]">
                <CheckIcon className="size-4" />
              </span>
              <div className="mb-4 flex items-center justify-between gap-2 border-b border-dashed border-border pb-3">
                <span className="font-mono text-[0.8125rem] text-text-muted">{text.home.flashcard.tagLabel}</span>
                <span className="font-mono rounded-md bg-wash-bg px-2 py-0.5 text-[0.8125rem] font-semibold text-wash-text">
                  {text.home.flashcard.category}
                </span>
              </div>
              <p className="text-lg leading-snug font-semibold">
                {text.home.flashcard.questionBeforeMark}
                <span className="mark">{text.home.flashcard.questionMark}</span>
                {text.home.flashcard.questionAfterMark}
              </p>
              <div className="font-mono mt-4 flex items-center gap-2 text-[0.8125rem] font-semibold text-correct-text">
                <CheckIcon className="size-4 text-correct-500" />
                {text.home.flashcard.reviewedLabel}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================= Topics ======================= */}
      {categories.length > 0 && (
        <section className="mt-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-semibold">{text.home.categoriesHeading}</h2>
              <p className="mt-1 text-[0.8125rem] text-text-muted">
                {text.home.categoriesCaption} {text.home.categoriesQuestionCount(questionTotals.total)}
              </p>
            </div>
            <Link href={PAGE_ROUTES.questions} className="shrink-0 text-sm font-semibold text-marker-700 hover:underline">
              {text.home.categoriesViewAll}
            </Link>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((category, i) => (
              <Link
                key={category.id}
                href={PAGE_ROUTES.category(category.slug)}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-text shadow-(--shadow-border) hover:shadow-(--shadow-border-hover)"
              >
                <span className="font-mono text-text-muted">{categoryCounts[i]}</span>
                {category.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ======================= Benefits ======================= */}
      <section className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
        {text.home.benefits.map((benefit, i) => {
          const Icon = BENEFIT_ICONS[i];
          return (
            <div key={benefit.title}>
              <span className="mb-3 grid size-11 place-items-center rounded-md bg-wash-bg text-wash-text">
                <Icon className="size-5" />
              </span>
              <h3 className="font-display font-semibold">{benefit.title}</h3>
              <p className="mt-1 text-text-muted">{benefit.body}</p>
            </div>
          );
        })}
      </section>

      {/* ======================= How it works ======================= */}
      <section className="mt-16 rounded-[18px] bg-surface p-6 shadow-(--shadow-border)">
        <h2 className="font-display text-lg font-semibold">{text.home.howItWorksHeading}</h2>
        <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-3">
          {text.home.steps.map((step, i) => (
            <div key={step.title} className="flex gap-4 border-s border-border ps-6">
              <span className="font-mono shrink-0 text-[1.75rem] leading-none font-semibold text-marker-500">
                0{i + 1}
              </span>
              <div>
                <h3 className="font-display font-semibold">{step.title}</h3>
                <p className="mt-1 text-text-muted">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======================= CTA ======================= */}
      {/* This band's copy ("Unlock every suggested answer with Premium" /
          "See pricing") only makes sense with payment live — hidden
          alongside PAYMENTS_ENABLED (lib/constants/app.ts), since Premium
          content is unlocked for everyone in the meantime. */}
      {PAYMENTS_ENABLED && (
        <section className="cta-band mt-16 rounded-[18px] px-6 py-8 text-center text-paper-0">
          <h2 className="font-display text-lg font-semibold">{text.home.ctaHeading}</h2>
          <p className="mt-2" style={{ color: "color-mix(in oklch, var(--color-paper-0) 70%, transparent)" }}>
            {text.home.ctaBody}
          </p>
          <Link
            href={PAGE_ROUTES.subscribe}
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-md bg-paper-0 px-4 font-semibold text-ink-950 hover:bg-marker-100"
          >
            {text.home.ctaLink} <ArrowRightIcon className="size-4" />
          </Link>
        </section>
      )}

      {/* ======================= FAQ ======================= */}
      <section className="mt-16 rounded-[18px] bg-surface p-6 shadow-(--shadow-border)">
        <h2 className="font-display text-lg font-semibold">{text.home.faqHeading}</h2>
        <div className="mt-2">
          {text.home.faq.map((item) => (
            <details key={item.question} className="border-b border-border py-4 last:border-none">
              <summary className="cursor-pointer list-none font-semibold">{item.question}</summary>
              <p className="mt-3 max-w-[68ch] text-text-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
      </div>
    </div>
  );
}
