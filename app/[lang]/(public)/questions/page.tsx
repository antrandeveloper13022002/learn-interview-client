import type { Metadata } from "next";
import { getCategories, getQuestions, getQuestionTags } from "@/lib/api/questions";
import {
  buildQuestionListCanonical,
  parseDifficulty,
  parsePage,
  parsePremium,
  parseTags,
} from "@/lib/questionSearchParams";
import { QuestionFilters } from "@/components/questions/QuestionFilters";
import { QuestionList } from "@/components/questions/QuestionList";
import { TopicSidebar } from "@/components/questions/TopicSidebar";
import { MobileTopicChips } from "@/components/questions/MobileTopicChips";
import { Pagination } from "@/components/questions/Pagination";
import { getText } from "@/lib/text";
import { QUESTION_LIST_PAGE_SIZE } from "@/lib/constants";
import { PAGE_ROUTES } from "@/lib/routes";
import { SUPPORTED_LOCALES, localizedPath, resolveLocale } from "@/lib/routes/locale";

type PageSearchParams = {
  // Query-param category filtering predates the topic sidebar (FU-22) and
  // still works if hit directly (an old link, a stale search-index entry)
  // — the sidebar itself now always links to /categories/[slug] instead.
  category?: string;
  difficulty?: string;
  premium?: string;
  tag?: string | string[];
  q?: string;
  page?: string;
};

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<PageSearchParams>;
};

export async function generateMetadata({ params: paramsPromise, searchParams }: Props): Promise<Metadata> {
  const { lang: rawLang } = await paramsPromise;
  const lang = resolveLocale(rawLang);
  const text = getText(lang);
  const params = await searchParams;
  const page = parsePage(params.page);
  const difficulty = parseDifficulty(params.difficulty);
  const tags = parseTags(params.tag);
  const categories = await getCategories(lang);
  const category = params.category ? categories.find((c) => c.slug === params.category) : undefined;

  const titleParts: string[] = [text.questions.list.pageHeading];
  if (category) titleParts.push(category.name);
  if (difficulty) titleParts.push(text.questions.difficultyLabel[difficulty]);
  if (tags.length > 0) titleParts.push(tags.join(", "));
  const title =
    titleParts.join(" - ") + (page > 1 ? ` (${text.questions.list.meta.titlePagePrefix} ${page})` : "");

  const descriptionParts: string[] = [text.questions.list.meta.descriptionBase];
  if (category) descriptionParts.push(`${text.questions.list.meta.descriptionCategoryPrefix} ${category.name}`);
  if (difficulty) {
    descriptionParts.push(
      `${text.questions.list.meta.descriptionDifficultyPrefix} ${text.questions.difficultyLabel[difficulty].toLowerCase()}`,
    );
  }
  if (tags.length > 0) descriptionParts.push(`${text.questions.list.meta.descriptionTagPrefix} ${tags.join(", ")}`);
  const description = `${descriptionParts.join(", ")}. ${text.questions.list.meta.descriptionSuffix}`;

  const premium = parsePremium(params.premium);
  const listFilters = { category: params.category, difficulty, premium, tag: tags, page };
  const canonical = buildQuestionListCanonical(localizedPath(lang, PAGE_ROUTES.questions), listFilters);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((l) => [l, buildQuestionListCanonical(localizedPath(l, PAGE_ROUTES.questions), listFilters)]),
      ),
    },
    openGraph: { title, description, url: canonical, type: "website" },
    twitter: { card: "summary", title, description },
  };
}

export default async function QuestionsPage({ params: paramsPromise, searchParams }: Props) {
  const { lang: rawLang } = await paramsPromise;
  const lang = resolveLocale(rawLang);
  const text = getText(lang);
  const params = await searchParams;
  const page = parsePage(params.page);
  const difficulty = parseDifficulty(params.difficulty);
  const premium = parsePremium(params.premium);
  const tags = parseTags(params.tag);

  const [categories, tagOptions] = await Promise.all([getCategories(lang), getQuestionTags()]);
  const category = params.category ? categories.find((c) => c.slug === params.category) : undefined;

  const [result, questionTotals] = await Promise.all([
    getQuestions(
      {
        categoryId: category?.id,
        difficulty,
        isPremium: premium,
        tag: tags,
        q: params.q,
        page,
        pageSize: QUESTION_LIST_PAGE_SIZE,
      },
      lang,
    ),
    getQuestions({ pageSize: 1 }, lang),
  ]);

  const startIndex = (result.page - 1) * result.pageSize;
  const basePath = localizedPath(lang, PAGE_ROUTES.questions);
  const currentFilters = { difficulty: params.difficulty, premium: params.premium, tag: tags, q: params.q };

  return (
    <div className="min-h-full bg-bg text-text">
      <div className="mx-auto flex w-full max-w-7xl">
        <TopicSidebar
          categories={categories}
          totalQuestionCount={questionTotals.total}
          selectedSlug={undefined}
          otherFilters={currentFilters}
          lang={lang}
        />
        <div className="min-w-0 flex-1 px-4 py-10 lg:px-8">
          <p className="font-mono text-[0.8125rem] text-text-muted">
            $ QUESTIONS --COUNT={questionTotals.total} --FILTERED={result.total}
          </p>
          <h1 className="font-display mt-2 text-2xl font-semibold tracking-tight">{text.questions.list.pageHeading}</h1>
          <p className="mt-2 text-text-muted">{text.questions.list.pageIntro}</p>

          <div className="mt-6">
            <MobileTopicChips categories={categories} selectedSlug={undefined} otherFilters={currentFilters} lang={lang} />
          </div>

          <QuestionFilters basePath={basePath} tagOptions={tagOptions} current={currentFilters} />

          <QuestionList
            questions={result.items}
            categories={categories}
            startIndex={startIndex}
            lang={lang}
            basePath={PAGE_ROUTES.questions}
            currentFilters={currentFilters}
          />

          <Pagination
            basePath={basePath}
            searchParams={params}
            page={result.page}
            pageSize={result.pageSize}
            total={result.total}
            lang={lang}
          />
        </div>
      </div>
    </div>
  );
}
