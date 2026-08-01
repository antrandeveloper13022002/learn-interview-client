import type { Metadata } from "next";
import { getCategories, getQuestions } from "@/lib/api/questions";
import { buildQuestionListCanonical, parseDifficulty, parsePage, parsePremium } from "@/lib/questionSearchParams";
import { QuestionFilters } from "@/components/questions/QuestionFilters";
import { QuestionList } from "@/components/questions/QuestionList";
import { Pagination } from "@/components/questions/Pagination";
import { text } from "@/lib/text";
import { QUESTION_LIST_PAGE_SIZE } from "@/lib/constants";
import { PAGE_ROUTES } from "@/lib/routes";

type PageSearchParams = {
  category?: string;
  difficulty?: string;
  premium?: string;
  q?: string;
  page?: string;
};

type Props = {
  searchParams: Promise<PageSearchParams>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const page = parsePage(params.page);
  const difficulty = parseDifficulty(params.difficulty);
  const categories = await getCategories();
  const category = params.category ? categories.find((c) => c.slug === params.category) : undefined;

  const titleParts: string[] = [text.questions.list.pageHeading];
  if (category) titleParts.push(category.name);
  if (difficulty) titleParts.push(text.questions.difficultyLabel[difficulty]);
  const title =
    titleParts.join(" - ") + (page > 1 ? ` (${text.questions.list.meta.titlePagePrefix} ${page})` : "");

  const descriptionParts: string[] = [text.questions.list.meta.descriptionBase];
  if (category) descriptionParts.push(`${text.questions.list.meta.descriptionCategoryPrefix} ${category.name}`);
  if (difficulty) {
    descriptionParts.push(
      `${text.questions.list.meta.descriptionDifficultyPrefix} ${text.questions.difficultyLabel[difficulty].toLowerCase()}`,
    );
  }
  const description = `${descriptionParts.join(", ")}. ${text.questions.list.meta.descriptionSuffix}`;

  const premium = parsePremium(params.premium);
  const canonical = buildQuestionListCanonical(PAGE_ROUTES.questions, {
    category: params.category,
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

export default async function QuestionsPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = parsePage(params.page);
  const difficulty = parseDifficulty(params.difficulty);
  const premium = parsePremium(params.premium);

  const categories = await getCategories();
  const category = params.category ? categories.find((c) => c.slug === params.category) : undefined;

  const result = await getQuestions({
    categoryId: category?.id,
    difficulty,
    isPremium: premium,
    q: params.q,
    page,
    pageSize: QUESTION_LIST_PAGE_SIZE,
  });

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">{text.questions.list.pageHeading}</h1>
      <p className="mt-2 text-neutral-600">{text.questions.list.pageIntro}</p>

      <QuestionFilters
        basePath={PAGE_ROUTES.questions}
        categories={categories}
        showCategoryFilter
        current={{
          category: params.category,
          difficulty: params.difficulty,
          premium: params.premium,
          q: params.q,
        }}
      />

      <QuestionList questions={result.items} categories={categories} />

      <Pagination
        basePath={PAGE_ROUTES.questions}
        searchParams={params}
        page={result.page}
        pageSize={result.pageSize}
        total={result.total}
      />
    </main>
  );
}
