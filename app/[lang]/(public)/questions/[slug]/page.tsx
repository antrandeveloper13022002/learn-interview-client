import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/components/i18n/LocaleLink";
import { ApiError } from "@/lib/api/client";
import { getCategoryById, getQuestionDetail } from "@/lib/api/questions";
import { serializeJsonLd } from "@/lib/jsonLd";
import { AnswerSection } from "@/components/questions/AnswerSection";
import { BookmarkToggle } from "@/components/questions/BookmarkToggle";
import { DIFFICULTY_BADGE_CLASS } from "@/components/questions/QuestionList";
import { getText } from "@/lib/text";
import { PAGE_ROUTES } from "@/lib/routes";
import { SUPPORTED_LOCALES, localizedPath, resolveLocale } from "@/lib/routes/locale";

type Props = {
  params: Promise<{ lang: string; slug: string }>;
};

async function loadQuestion(slug: string) {
  try {
    return await getQuestionDetail(slug);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      notFound();
    }
    throw err;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: rawLang, slug } = await params;
  const lang = resolveLocale(rawLang);
  const text = getText(lang);
  const question = await loadQuestion(slug);
  const category = await getCategoryById(question.categoryId);

  const { meta } = text.questions.detail;
  const title = question.title;
  const description = `${meta.descriptionPrefix}${category ? ` ${meta.descriptionCategoryInfix} ${category.name}` : ""}: ${question.title}. ${
    question.isPremium ? meta.descriptionPremium : meta.descriptionFree
  }`;
  const canonical = localizedPath(lang, PAGE_ROUTES.questionDetail(question.slug));

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((l) => [l, localizedPath(l, PAGE_ROUTES.questionDetail(question.slug))]),
      ),
    },
    openGraph: { title, description, url: canonical, type: "article" },
    twitter: { card: "summary", title, description },
  };
}

export default async function QuestionDetailPage({ params }: Props) {
  const { lang: rawLang, slug } = await params;
  const lang = resolveLocale(rawLang);
  const text = getText(lang);
  const question = await loadQuestion(slug);
  const category = await getCategoryById(question.categoryId);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Question",
    name: question.title,
    ...(!question.isPremium && question.answer
      ? { acceptedAnswer: { "@type": "Answer", text: question.answer } }
      : {}),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: text.questions.list.pageHeading,
        item: localizedPath(lang, PAGE_ROUTES.questions),
      },
      ...(category
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: category.name,
              item: localizedPath(lang, PAGE_ROUTES.category(category.slug)),
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: category ? 3 : 2,
        name: question.title,
        item: localizedPath(lang, PAGE_ROUTES.questionDetail(question.slug)),
      },
    ],
  };

  return (
    <div className="min-h-full bg-bg pb-12 text-text">
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbLd) }}
      />

      <nav aria-label={text.questions.detail.breadcrumbAriaLabel} className="text-sm text-text-muted">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href={PAGE_ROUTES.questions} className="hover:underline">
              {text.questions.list.pageHeading}
            </Link>
          </li>
          {category && (
            <li className="flex items-center gap-1">
              <span aria-hidden="true">/</span>
              <Link href={PAGE_ROUTES.category(category.slug)} className="hover:underline">
                {category.name}
              </Link>
            </li>
          )}
          <li className="flex items-center gap-1">
            <span aria-hidden="true">/</span>
            <span aria-current="page">{question.title}</span>
          </li>
        </ol>
      </nav>

      <div className="mt-3 flex items-start justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold tracking-tight">{question.title}</h1>
        <BookmarkToggle question={question} />
      </div>

      <div className="mt-3 flex gap-2">
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${DIFFICULTY_BADGE_CLASS[question.difficulty]}`}>
          {text.questions.difficultyLabel[question.difficulty]}
        </span>
        {question.isPremium && (
          <span className="rounded-full bg-premium-bg px-3 py-1 text-xs font-medium text-premium-text">
            {text.common.premiumBadge}
          </span>
        )}
      </div>

      {question.tags.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {question.tags.map((tag) => (
            <li key={tag}>
              <Link
                href={`${PAGE_ROUTES.questions}?tag=${encodeURIComponent(tag)}`}
                className="rounded-full bg-wash-bg px-2.5 py-1 text-xs font-medium text-wash-text hover:bg-wash-bg/80"
              >
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide">
          {text.questions.detail.answerHeading}
        </h2>
        <div className="mt-3">
          <AnswerSection question={question} lang={lang} />
        </div>
      </section>
      </div>
    </div>
  );
}
