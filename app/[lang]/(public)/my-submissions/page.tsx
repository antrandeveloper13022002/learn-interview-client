import type { Metadata } from "next";
import { Link } from "@/components/i18n/LocaleLink";
import { MySubmissionsList } from "@/components/contribute/MySubmissionsList";
import { getText } from "@/lib/text";
import { resolveLocale } from "@/lib/routes/locale";
import { PAGE_ROUTES } from "@/lib/routes";

type Props = {
  params: Promise<{ lang: string }>;
};

// Authenticated-only content with no server-side session to check (FU-03:
// Server Components are guest-scoped) — same robots treatment as
// bookmarks/page.tsx and profile/page.tsx.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const text = getText(resolveLocale(rawLang));
  return {
    title: text.mySubmissions.pageTitle,
    robots: { index: false, follow: false },
  };
}

export default async function MySubmissionsPage({ params }: Props) {
  const { lang: rawLang } = await params;
  const text = getText(resolveLocale(rawLang));

  return (
    <div className="min-h-full bg-bg pb-12 text-text">
      <div className="mx-auto w-full max-w-2xl px-4 py-10">
        <nav aria-label={text.questions.detail.breadcrumbAriaLabel} className="text-sm text-text-muted">
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link href={PAGE_ROUTES.home} className="hover:underline">
                {text.header.homeLink}
              </Link>
            </li>
            <li className="flex items-center gap-1">
              <span aria-hidden="true">/</span>
              <span aria-current="page">{text.mySubmissions.breadcrumbLabel}</span>
            </li>
          </ol>
        </nav>

        <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight">{text.mySubmissions.heading}</h1>

        <MySubmissionsList />
      </div>
    </div>
  );
}
