"use client";

import { useText } from "@/lib/text/useText";
import { APP_NAME } from "@/lib/constants";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";

export function Footer() {
  const text = useText();
  return (
    <footer className="border-t border-border bg-bg py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 text-center md:px-6">
        <p className="font-display text-lg font-bold text-text">{APP_NAME}</p>
        <p className="text-sm text-text-muted">
          © {new Date().getFullYear()} {APP_NAME}. {text.footer.tagline}
        </p>
        <LanguageSwitcher />
      </div>
    </footer>
  );
}
