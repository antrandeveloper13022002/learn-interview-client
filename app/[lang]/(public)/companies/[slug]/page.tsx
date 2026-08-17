import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/components/i18n/LocaleLink";
import { CompanyReviewsSection } from "@/components/company/CompanyReviewsSection";
import { BuildingIcon, GlobeIcon, MapPinIcon, UsersIcon } from "@/components/icons";
import { ApiError } from "@/lib/api/client";
import { getCompanyDetail } from "@/lib/api/companies";
import { serializeJsonLd } from "@/lib/jsonLd";
import { getText } from "@/lib/text";
import { PAGE_ROUTES } from "@/lib/routes";
import { SUPPORTED_LOCALES, localizedPath, resolveLocale } from "@/lib/routes/locale";

type Props = {
  params: Promise<{ lang: string; slug: string }>;
};

function websiteHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

async function loadCompany(slug: string, lang: string) {
  try {
    return await getCompanyDetail(slug, lang);
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
  const company = await loadCompany(slug, lang);

  const title = company.name;
  const description = `${text.companies.detail.meta.descriptionPrefix}: ${company.name}. ${company.description}`.slice(
    0,
    300,
  );
  const canonical = localizedPath(lang, PAGE_ROUTES.companyDetail(company.slug));

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((l) => [l, localizedPath(l, PAGE_ROUTES.companyDetail(company.slug))]),
      ),
    },
    openGraph: { title, description, url: canonical, type: "article" },
    twitter: { card: "summary", title, description },
  };
}

export default async function CompanyDetailPage({ params }: Props) {
  const { lang: rawLang, slug } = await params;
  const lang = resolveLocale(rawLang);
  const text = getText(lang);
  const company = await loadCompany(slug, lang);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    description: company.description,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: text.companies.list.pageHeading,
        item: localizedPath(lang, PAGE_ROUTES.companies),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: company.name,
        item: localizedPath(lang, PAGE_ROUTES.companyDetail(company.slug)),
      },
    ],
  };

  return (
    <div className="min-h-full bg-bg pb-12 text-text">
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbLd) }}
        />

        <nav aria-label={text.companies.detail.breadcrumbAriaLabel} className="text-sm text-text-muted">
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link href={PAGE_ROUTES.companies} className="hover:underline">
                {text.companies.list.pageHeading}
              </Link>
            </li>
            <li className="flex items-center gap-1">
              <span aria-hidden="true">/</span>
              <span aria-current="page">{company.name}</span>
            </li>
          </ol>
        </nav>

        <div className="mt-3 rounded-[18px] border border-border bg-surface p-6 shadow-(--shadow-border)">
          <div className="flex items-start gap-5">
            {company.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- external, admin-supplied URL, not a project asset next/image can optimize without a remotePatterns allowlist decision (out of scope here).
              <img
                src={company.logoUrl}
                alt=""
                className="size-16 shrink-0 rounded-lg border border-border bg-bg object-contain"
              />
            ) : (
              <span className="grid size-16 shrink-0 place-items-center rounded-lg border border-border bg-marker-100 text-marker-700">
                <BuildingIcon className="size-7" />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-2xl font-bold tracking-tight">{company.name}</h1>

              {(company.province || company.employeeSizeRange || company.website) && (
                <div className="mt-1 mb-3 flex flex-wrap gap-3">
                  {company.province && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-text-muted">
                      <MapPinIcon className="size-3" />
                      {company.province.name}
                    </span>
                  )}
                  {company.employeeSizeRange && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-text-muted">
                      <UsersIcon className="size-3" />
                      {text.companies.detail.employeeSizeRangeLabel[company.employeeSizeRange]}
                    </span>
                  )}
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-marker-700 hover:underline"
                    >
                      <GlobeIcon className="size-3" />
                      {websiteHostname(company.website)}
                    </a>
                  )}
                </div>
              )}

              {company.industries.length > 0 && (
                <ul aria-label={text.companies.detail.industriesAriaLabel} className="flex flex-wrap gap-2">
                  {company.industries.map((industry) => (
                    <li
                      key={industry}
                      className="font-mono rounded-full border border-border px-2.5 py-0.5 text-[11px] text-text-muted"
                    >
                      {industry}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="my-5 h-px bg-border" />

          <p className="whitespace-pre-line text-[14.5px] leading-relaxed text-text">{company.description}</p>
        </div>

        <CompanyReviewsSection companyId={company.id} />
      </div>
    </div>
  );
}
