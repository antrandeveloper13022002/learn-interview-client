import { Space_Grotesk, Be_Vietnam_Pro, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { ReduxProvider } from "@/lib/redux/provider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "../../app/globals.css";

// Space Grotesk (display) + Be Vietnam Pro (body — chosen specifically for
// full Vietnamese diacritic support, not just "not the default") +
// JetBrains Mono (question numbers/tags/eyebrows) — see globals.css's token
// comment and project memory `project_design_redesign_20260804.md` for why.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700"],
});

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600"],
});

// Runs before hydration so the page never flashes the wrong theme — reads
// the same localStorage key ThemeToggle writes to. Kept minimal and inline
// deliberately (no external script fetch) since this must block first paint.
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("theme-preference");
    var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.setAttribute("data-theme", stored || (prefersDark ? "dark" : "light"));
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "light");
  }
})();
`;

type Props = {
  lang: string;
  children: React.ReactNode;
};

/**
 * Shared `<html>/<body>` shell, extracted so it can back **two** Next.js
 * root layouts (app/[lang]/layout.tsx and app/(external)/layout.tsx) — the
 * "multiple root layouts" pattern Next.js documents for exactly this case:
 * a couple of routes (MoMo return, Google OAuth callback) must keep fixed,
 * unprefixed URLs outside `[lang]` (see tasks/frontend-user.md FU-19), so
 * they can't share `[lang]`'s own layout tree, but still need the same
 * ReduxProvider/Header/Footer/fonts/theme-script every other page gets.
 *
 * The `<Script beforeInteractive>` below must render directly here, not be
 * passed through as a prop from the calling `layout.tsx` — that was tried
 * first (to satisfy `no-before-interactive-script-outside-document`, which
 * only recognizes the strategy inside a file path containing `/app/`) and
 * broke Next's actual `beforeInteractive` handling at runtime ("Encountered
 * a script tag while rendering React component" + a forced Fast Refresh
 * full reload). Correct runtime behavior wins over a clean lint run; the
 * rule's warning here is a false positive for this shared-component
 * pattern.
 */
export function AppShell({ lang, children }: Props) {
  return (
    <html
      lang={lang}
      className={`${spaceGrotesk.variable} ${beVietnamPro.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document -- false positive: the rule only recognizes files whose path contains "/app/", but this IS App Router usage, just via a shared components/ file. See doc comment above. */}
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        <ReduxProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
