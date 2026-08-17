import type { Metadata } from "next";
import { NotificationPreferencesView } from "@/components/notifications/NotificationPreferencesView";
import { getText } from "@/lib/text";
import { resolveLocale } from "@/lib/routes/locale";

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
    title: text.notifications.preferences.pageTitle,
    robots: { index: false, follow: false },
  };
}

export default async function NotificationPreferencesPage({ params }: Props) {
  const { lang: rawLang } = await params;
  const text = getText(resolveLocale(rawLang));

  return (
    <div className="min-h-full bg-bg pb-12 text-text">
      <div className="mx-auto w-full max-w-2xl px-4 py-10">
        <h1 className="font-display text-2xl font-semibold tracking-tight">{text.notifications.preferences.pageHeading}</h1>
        <p className="mt-2 text-text-muted">{text.notifications.preferences.pageIntro}</p>
        <NotificationPreferencesView />
      </div>
    </div>
  );
}
