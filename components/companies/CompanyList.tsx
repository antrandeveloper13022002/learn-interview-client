import { Link } from "@/components/i18n/LocaleLink";
import type { Company } from "@/lib/types";
import { getText } from "@/lib/text";
import type { Locale } from "@/lib/routes/locale";
import { PAGE_ROUTES } from "@/lib/routes";

type CompanyListProps = {
  companies: Company[];
  lang: Locale;
};

export function CompanyList({ companies, lang }: CompanyListProps) {
  const text = getText(lang);
  if (companies.length === 0) {
    return (
      <div role="status" className="mt-8 rounded-lg border border-dashed border-border p-10 text-center">
        <p className="font-semibold text-text">{text.companies.list.emptyTitle}</p>
        <p className="mt-2 text-sm text-text-muted">{text.companies.list.emptyBody}</p>
      </div>
    );
  }

  return (
    <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {companies.map((company) => (
        <li key={company.id}>
          <Link
            href={PAGE_ROUTES.companyDetail(company.slug)}
            className="flex h-full flex-col gap-2 rounded-lg border border-border bg-surface p-4 shadow-(--shadow-border) hover:shadow-(--shadow-border-hover)"
          >
            <p className="font-medium text-text">{company.name}</p>
            <p className="line-clamp-2 text-sm text-text-muted">{company.description}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
