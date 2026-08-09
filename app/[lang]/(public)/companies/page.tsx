import type { Metadata } from "next";
import { getCompanies } from "@/lib/api/companies";
import { parsePage } from "@/lib/questionSearchParams";
import { CompanySearch } from "@/components/companies/CompanySearch";
import { CompanyList } from "@/components/companies/CompanyList";
import { Pagination } from "@/components/questions/Pagination";
import { getText } from "@/lib/text";
import { COMPANY_LIST_PAGE_SIZE } from "@/lib/constants";
import { PAGE_ROUTES } from "@/lib/routes";
import { SUPPORTED_LOCALES, localizedPath, resolveLocale, type Locale } from "@/lib/routes/locale";

type PageSearchParams = {
  q?: string;
  page?: string;
};

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<PageSearchParams>;
};

// Canonical drops `q` (free-text search isn't a distinct indexable page,
// same reasoning as buildQuestionListCanonical in questionSearchParams.ts),
// keeps `page` when beyond the first.
function buildCompanyListCanonical(lang: Locale, page: number): string {
  const basePath = localizedPath(lang, PAGE_ROUTES.companies);
  return page > 1 ? `${basePath}?page=${page}` : basePath;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = resolveLocale(rawLang);
  const text = getText(lang);
  const search = await searchParams;
  const page = parsePage(search.page);

  const title =
    text.companies.list.pageHeading +
    (page > 1 ? ` (${text.companies.list.meta.titlePagePrefix} ${page})` : "");
  const description = text.companies.list.meta.description;
  const canonical = buildCompanyListCanonical(lang, page);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: Object.fromEntries(SUPPORTED_LOCALES.map((l) => [l, buildCompanyListCanonical(l, page)])),
    },
    openGraph: { title, description, url: canonical, type: "website" },
    twitter: { card: "summary", title, description },
  };
}

export default async function CompaniesPage({ params, searchParams }: Props) {
  const { lang: rawLang } = await params;
  const lang = resolveLocale(rawLang);
  const text = getText(lang);
  const search = await searchParams;
  const page = parsePage(search.page);

  const result = await getCompanies({ q: search.q, page, pageSize: COMPANY_LIST_PAGE_SIZE });

  return (
    <div className="min-h-full bg-bg pb-12 text-text">
      <div className="mx-auto w-full max-w-5xl px-4 py-10">
        <p className="font-mono text-[0.8125rem] text-text-muted">$ COMPANIES --COUNT={result.total}</p>
        <h1 className="font-display mt-2 text-2xl font-semibold tracking-tight">{text.companies.list.pageHeading}</h1>
        <p className="mt-2 text-text-muted">{text.companies.list.pageIntro}</p>

        <CompanySearch basePath={localizedPath(lang, PAGE_ROUTES.companies)} q={search.q} />

        <CompanyList companies={result.items} lang={lang} />

        <Pagination
          basePath={localizedPath(lang, PAGE_ROUTES.companies)}
          searchParams={search}
          page={result.page}
          pageSize={result.pageSize}
          total={result.total}
          lang={lang}
        />
      </div>
    </div>
  );
}
