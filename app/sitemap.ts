import type { MetadataRoute } from "next";
import { getCategories, getQuestions } from "@/lib/api/questions";
import { getCompanies } from "@/lib/api/companies";
import { env } from "@/lib/env";
import { PAGE_ROUTES } from "@/lib/routes";
import { SUPPORTED_LOCALES, localizedPath } from "@/lib/routes/locale";

// Backend caps pageSize at 100 (list-questions.dto.ts / list-companies.dto.ts)
// — this loops pages instead of requesting a larger batch.
const SITEMAP_QUESTION_BATCH_SIZE = 100;
const SITEMAP_COMPANY_BATCH_SIZE = 100;

// Loops until a page comes back short of a full batch — works regardless
// of how many questions Admin has added, not just whatever happens to fit
// in one page. Premium questions are included same as free ones: the
// question text itself is guest-visible/SEO-indexable per
// business-rule.md#premium-gating, only the answer is gated.
async function getAllQuestionSlugs(): Promise<string[]> {
  const slugs: string[] = [];
  let page = 1;
  let hasMore = true;
  while (hasMore) {
    const result = await getQuestions({ page, pageSize: SITEMAP_QUESTION_BATCH_SIZE });
    slugs.push(...result.items.map((q) => q.slug));
    hasMore = result.items.length === SITEMAP_QUESTION_BATCH_SIZE;
    page += 1;
  }
  return slugs;
}

// Same loop-until-short-page approach as getAllQuestionSlugs above.
async function getAllCompanySlugs(): Promise<string[]> {
  const slugs: string[] = [];
  let page = 1;
  let hasMore = true;
  while (hasMore) {
    const result = await getCompanies({ page, pageSize: SITEMAP_COMPANY_BATCH_SIZE });
    slugs.push(...result.items.map((c) => c.slug));
    hasMore = result.items.length === SITEMAP_COMPANY_BATCH_SIZE;
    page += 1;
  }
  return slugs;
}

// i18n opened 2026-08-06 (tasks/frontend-user.md FU-19) — every entry now
// exists once per locale, each carrying `alternates.languages` pointing at
// its sibling so crawlers can discover the hreflang relationship straight
// from the sitemap, not just from each page's own <head> tags.
function localizedEntries(
  path: string,
  opts: Pick<MetadataRoute.Sitemap[number], "changeFrequency" | "priority">,
): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    SUPPORTED_LOCALES.map((l) => [l, `${env.NEXT_PUBLIC_SITE_URL}${localizedPath(l, path)}`]),
  );
  return SUPPORTED_LOCALES.map((lang) => ({
    url: languages[lang]!,
    alternates: { languages },
    ...opts,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, questionSlugs, companySlugs] = await Promise.all([
    getCategories(),
    getAllQuestionSlugs(),
    getAllCompanySlugs(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = [
    ...localizedEntries(PAGE_ROUTES.home, { changeFrequency: "weekly", priority: 1 }),
    ...localizedEntries(PAGE_ROUTES.questions, { changeFrequency: "daily", priority: 0.9 }),
    ...localizedEntries(PAGE_ROUTES.companies, { changeFrequency: "daily", priority: 0.7 }),
    ...localizedEntries(PAGE_ROUTES.subscribe, { changeFrequency: "monthly", priority: 0.5 }),
  ];

  const categoryEntries: MetadataRoute.Sitemap = categories.flatMap((category) =>
    localizedEntries(PAGE_ROUTES.category(category.slug), { changeFrequency: "weekly", priority: 0.7 }),
  );

  const questionEntries: MetadataRoute.Sitemap = questionSlugs.flatMap((slug) =>
    localizedEntries(PAGE_ROUTES.questionDetail(slug), { changeFrequency: "weekly", priority: 0.6 }),
  );

  const companyEntries: MetadataRoute.Sitemap = companySlugs.flatMap((slug) =>
    localizedEntries(PAGE_ROUTES.companyDetail(slug), { changeFrequency: "weekly", priority: 0.5 }),
  );

  return [...staticEntries, ...categoryEntries, ...questionEntries, ...companyEntries];
}
