import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { getCategoryById, getQuestionDetail } from "@/lib/api/questions";
import { serializeJsonLd } from "@/lib/jsonLd";
import { AnswerSection } from "@/components/questions/AnswerSection";
import { text } from "@/lib/text";
import { PAGE_ROUTES } from "@/lib/routes";

type Props = {
  params: Promise<{ slug: string }>;
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
  const { slug } = await params;
  const question = await loadQuestion(slug);
  const category = await getCategoryById(question.categoryId);

  const { meta } = text.questions.detail;
  const title = question.title;
  const description = `${meta.descriptionPrefix}${category ? ` ${meta.descriptionCategoryInfix} ${category.name}` : ""}: ${question.title}. ${
    question.isPremium ? meta.descriptionPremium : meta.descriptionFree
  }`;
  const canonical = PAGE_ROUTES.questionDetail(question.slug);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, type: "article" },
    twitter: { card: "summary", title, description },
  };
}

export default async function QuestionDetailPage({ params }: Props) {
  const { slug } = await params;
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
      { "@type": "ListItem", position: 1, name: text.questions.list.pageHeading, item: PAGE_ROUTES.questions },
      ...(category
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: category.name,
              item: PAGE_ROUTES.category(category.slug),
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: category ? 3 : 2,
        name: question.title,
        item: PAGE_ROUTES.questionDetail(question.slug),
      },
    ],
  };

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbLd) }}
      />

      <nav aria-label={text.questions.detail.breadcrumbAriaLabel} className="text-sm text-neutral-500">
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

      <h1 className="mt-3 text-2xl font-semibold tracking-tight">{question.title}</h1>

      <div className="mt-3 flex gap-2">
        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
          {text.questions.difficultyLabel[question.difficulty]}
        </span>
        {question.isPremium && (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
            {text.common.premiumBadge}
          </span>
        )}
      </div>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          {text.questions.detail.answerHeading}
        </h2>
        <div className="mt-3">
          <AnswerSection question={question} />
        </div>
      </section>
    </main>
  );
}
