import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategories, getCategoryBySlug, getQuestions } from "@/lib/api/questions";
import { buildQuestionListCanonical, parseDifficulty, parsePage, parsePremium } from "@/lib/questionSearchParams";
import { QuestionFilters } from "@/components/questions/QuestionFilters";
import { QuestionList } from "@/components/questions/QuestionList";
import { Pagination } from "@/components/questions/Pagination";
import { text } from "@/lib/text";
import { QUESTION_LIST_PAGE_SIZE } from "@/lib/constants";
import { PAGE_ROUTES } from "@/lib/routes";

type PageSearchParams = {
  difficulty?: string;
  premium?: string;
  q?: string;
  page?: string;
};

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<PageSearchParams>;
};

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};

  const search = await searchParams;
  const page = parsePage(search.page);
  const difficulty = parseDifficulty(search.difficulty);

  const titleParts: string[] = [`${text.questions.list.categoryPageHeadingPrefix} ${category.name}`];
  if (difficulty) titleParts.push(text.questions.difficultyLabel[difficulty]);
  const title =
    titleParts.join(" - ") + (page > 1 ? ` (${text.questions.list.meta.titlePagePrefix} ${page})` : "");
  const description = text.questions.list.meta.categoryDescription(category.name);

  const premium = parsePremium(search.premium);
  const canonical = buildQuestionListCanonical(PAGE_ROUTES.category(category.slug), {
    difficulty,
    premium,
    page,
  });

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, type: "website" },
    twitter: { card: "summary", title, description },
  };
}

export default async function CategoryQuestionsPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const search = await searchParams;
  const page = parsePage(search.page);
  const difficulty = parseDifficulty(search.difficulty);
  const premium = parsePremium(search.premium);

  const [categories, result] = await Promise.all([
    getCategories(),
    getQuestions({
      categoryId: category.id,
      difficulty,
      isPremium: premium,
      q: search.q,
      page,
      pageSize: QUESTION_LIST_PAGE_SIZE,
    }),
  ]);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">
        {text.questions.list.categoryPageHeadingPrefix} {category.name}
      </h1>
      <p className="mt-2 text-neutral-600">
        {text.questions.list.categoryPageIntroPrefix} {category.name}.
      </p>

      <QuestionFilters
        basePath={PAGE_ROUTES.category(category.slug)}
        current={{ difficulty: search.difficulty, premium: search.premium, q: search.q }}
      />

      <QuestionList questions={result.items} categories={categories} />

      <Pagination
        basePath={PAGE_ROUTES.category(category.slug)}
        searchParams={search}
        page={result.page}
        pageSize={result.pageSize}
        total={result.total}
      />
    </main>
  );
}
