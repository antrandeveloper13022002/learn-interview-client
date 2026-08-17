import { ExternalLinkIcon } from "@/components/icons";
import type { Locale } from "@/lib/routes/locale";
import { getText } from "@/lib/text";

/**
 * Admin-curated "further reading" links to official docs. Deliberately not
 * gated by premium (business-rule.md's Internationalization section /
 * schema.prisma's Question.referenceLinks comment) — always rendered when
 * present, regardless of the answer's own entitlement state.
 */
export function ReferenceLinksSection({
  links,
  lang,
}: {
  links: { title: string; url: string }[];
  lang: Locale;
}) {
  if (links.length === 0) return null;
  const text = getText(lang);

  return (
    <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
      <h2 className="font-display font-semibold text-text">{text.questions.detail.referenceLinksHeading}</h2>
      <ul className="mt-3 flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.url}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex items-center gap-1.5 text-sm text-marker-700 hover:underline"
            >
              <ExternalLinkIcon className="size-3.5 shrink-0" />
              {link.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
