import type { Metadata } from "next";
import { ProfileView } from "@/components/profile/ProfileView";
import { getText } from "@/lib/text";
import { resolveLocale } from "@/lib/routes/locale";

type Props = {
  params: Promise<{ lang: string }>;
};

// Same reasoning as bookmarks/page.tsx — authenticated-only content, no
// server-side session to check, noindex as the second seo-guideline.md layer.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const text = getText(resolveLocale(rawLang));
  return {
    title: text.profile.pageTitle,
    robots: { index: false, follow: false },
  };
}

export default async function ProfilePage({ params }: Props) {
  const { lang: rawLang } = await params;
  const text = getText(resolveLocale(rawLang));

  return (
    // `min-h-[80vh]` (not just `min-h-full`, which does nothing without a
    // determinate ancestor height) — this page's content (email + one
    // field) is short enough on its own to leave a gap of `<main>`'s
    // theme-invariant background showing through below it in dark mode
    // otherwise, same class of bug FU-16 already documented for the
    // homepage. Matches login/page.tsx's own fix for the identical
    // "short authenticated-page content" case.
    <div className="min-h-[80vh] bg-bg pb-12 text-text">
      <div className="mx-auto w-full max-w-lg px-4 py-10">
        <h1 className="font-display text-2xl font-semibold tracking-tight">{text.profile.pageHeading}</h1>
        <ProfileView />
      </div>
    </div>
  );
}
