import { Link } from "@/components/i18n/LocaleLink";
import { PAGE_ROUTES } from "@/lib/routes";
import { getText } from "@/lib/text";
import type { Locale } from "@/lib/routes/locale";

type AuthTabsProps = {
  active: "login" | "register";
  lang: Locale;
};

/** Segmented tab bar atop the login/register card — switches route, not local state. */
export function AuthTabs({ active, lang }: AuthTabsProps) {
  const text = getText(lang);
  return (
    <div className="flex border-b border-border">
      <Link
        href={PAGE_ROUTES.login}
        aria-current={active === "login" ? "page" : undefined}
        className={`flex-1 border-b-2 py-3 text-center text-sm font-semibold ${
          active === "login" ? "border-marker-600 text-text" : "border-transparent text-text-muted hover:text-text"
        }`}
      >
        {text.auth.login.heading}
      </Link>
      <Link
        href={PAGE_ROUTES.register}
        aria-current={active === "register" ? "page" : undefined}
        className={`flex-1 border-b-2 py-3 text-center text-sm font-semibold ${
          active === "register" ? "border-marker-600 text-text" : "border-transparent text-text-muted hover:text-text"
        }`}
      >
        {text.auth.register.heading}
      </Link>
    </div>
  );
}
