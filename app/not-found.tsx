import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { getText } from "@/lib/text";
import { PAGE_ROUTES } from "@/lib/routes";
import { DEFAULT_LOCALE } from "@/lib/routes/locale";

const text = getText(DEFAULT_LOCALE);

// Root-level fallback for URLs unmatched by *any* segment (proxy.ts's
// matcher excludes a few paths from the /[lang] redirect — see FU-19) —
// sits outside both root layouts ([lang] and (external)), so it must
// provide its own <html>/<body> via AppShell, same as global-error.tsx.
// Most 404s hit app/[lang]/not-found.tsx instead, which is localized.
export default function NotFound() {
  return (
    <AppShell lang={DEFAULT_LOCALE}>
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-bg p-8 text-center text-text">
        <p className="font-mono text-sm text-text-muted">404</p>
        <h1 className="font-display text-2xl font-semibold">{text.common.notFoundTitle}</h1>
        <p className="text-text-muted">{text.common.notFoundBody}</p>
        <Link
          href={PAGE_ROUTES.home}
          className="rounded-md bg-marker-500 px-4 py-2 font-semibold text-ink-950 hover:bg-marker-600"
        >
          {text.common.backToHomeLink}
        </Link>
      </div>
    </AppShell>
  );
}
