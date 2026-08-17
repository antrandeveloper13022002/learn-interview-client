import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategories, getCategoryBySlug, getQuestions, getQuestionTags } from "@/lib/api/questions";
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
  difficulty?: string;
  premium?: string;
  tag?: string | string[];
  q?: string;
  page?: string;
};

type Props = {
  params: Promise<{ lang: string; slug: string }>;
  searchParams: Promise<PageSearchParams>;
};

export async function generateStaticParams() {
  // Slugs are locale-independent — "vi" here doesn't affect which pages
  // get generated, only the (unused) `name` field on the returned rows.
  const categories = await getCategories("vi");
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { lang: rawLang, slug } = await params;
  const lang = resolveLocale(rawLang);
  const text = getText(lang);
  const category = await getCategoryBySlug(slug, lang);
  if (!category) return {};

  const search = await searchParams;
  const page = parsePage(search.page);
  const difficulty = parseDifficulty(search.difficulty);
  const tags = parseTags(search.tag);

  const titleParts: string[] = [`${text.questions.list.categoryPageHeadingPrefix} ${category.name}`];
  if (difficulty) titleParts.push(text.questions.difficultyLabel[difficulty]);
  if (tags.length > 0) titleParts.push(tags.join(", "));
  const title =
    titleParts.join(" - ") + (page > 1 ? ` (${text.questions.list.meta.titlePagePrefix} ${page})` : "");
  const description = text.questions.list.meta.categoryDescription(category.name);

  const premium = parsePremium(search.premium);
  const listFilters = { difficulty, premium, tag: tags, page };
  const canonical = buildQuestionListCanonical(localizedPath(lang, PAGE_ROUTES.category(category.slug)), listFilters);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((l) => [
          l,
          buildQuestionListCanonical(localizedPath(l, PAGE_ROUTES.category(category.slug)), listFilters),
        ]),
      ),
    },
    openGraph: { title, description, url: canonical, type: "website" },
    twitter: { card: "summary", title, description },
  };
}

export default async function CategoryQuestionsPage({ params, searchParams }: Props) {
  const { lang: rawLang, slug } = await params;
  const lang = resolveLocale(rawLang);
  const text = getText(lang);
  const category = await getCategoryBySlug(slug, lang);
  if (!category) notFound();

  const search = await searchParams;
  const page = parsePage(search.page);
  const difficulty = parseDifficulty(search.difficulty);
  const premium = parsePremium(search.premium);
  const tags = parseTags(search.tag);

  const [categories, tagOptions, result, questionTotals] = await Promise.all([
    getCategories(lang),
    getQuestionTags(),
    getQuestions(
      {
        categoryId: category.id,
        difficulty,
        isPremium: premium,
        tag: tags,
        q: search.q,
        page,
        pageSize: QUESTION_LIST_PAGE_SIZE,
      },
      lang,
    ),
    getQuestions({ pageSize: 1 }, lang),
  ]);

  const startIndex = (result.page - 1) * result.pageSize;
  const basePath = localizedPath(lang, PAGE_ROUTES.category(category.slug));
  const currentFilters = { difficulty: search.difficulty, premium: search.premium, tag: tags, q: search.q };

  return (
    <div className="min-h-full bg-bg text-text">
      <div className="mx-auto flex w-full max-w-7xl">
        <TopicSidebar
          categories={categories}
          totalQuestionCount={questionTotals.total}
          selectedSlug={category.slug}
          otherFilters={currentFilters}
          lang={lang}
        />
        <div className="min-w-0 flex-1 px-4 py-10 lg:px-8">
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            {text.questions.list.categoryPageHeadingPrefix} {category.name}
          </h1>
          <p className="mt-2 text-text-muted">
            {text.questions.list.categoryPageIntroPrefix} {category.name}.
          </p>

          <div className="mt-6">
            <MobileTopicChips categories={categories} selectedSlug={category.slug} otherFilters={currentFilters} lang={lang} />
          </div>

          <QuestionFilters basePath={basePath} tagOptions={tagOptions} current={currentFilters} />

          <QuestionList
            questions={result.items}
            categories={categories}
            startIndex={startIndex}
            lang={lang}
            basePath={PAGE_ROUTES.category(category.slug)}
            currentFilters={currentFilters}
          />

          <Pagination
            basePath={basePath}
            searchParams={search}
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
