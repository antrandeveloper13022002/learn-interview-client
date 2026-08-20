"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Link } from "@/components/i18n/LocaleLink";
import { useLocale } from "@/lib/routes/useLocale";
import { useText } from "@/lib/text/useText";
import { useAppSelector } from "@/lib/redux/hooks";
import { useLogoutMutation } from "@/lib/redux/authApi";
import { PAGE_ROUTES } from "@/lib/routes";
import { localizedPath } from "@/lib/routes/locale";
import { APP_NAME, PAYMENTS_ENABLED } from "@/lib/constants";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { UserMenu } from "@/components/layout/UserMenu";
import { MenuIcon, CloseIcon } from "@/components/icons";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const lang = useLocale();
  const text = useText();
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const isBootstrapped = useAppSelector((s) => s.auth.isBootstrapped);
  const user = useAppSelector((s) => s.auth.user);
  const [logout] = useLogoutMutation();

  const navLinks = [
    { href: PAGE_ROUTES.home, label: text.header.homeLink },
    { href: PAGE_ROUTES.questions, label: text.header.questionsLink },
    { href: PAGE_ROUTES.companies, label: text.header.companiesLink },
    ...(PAYMENTS_ENABLED ? [{ href: PAGE_ROUTES.subscribe, label: text.header.subscribeLink }] : []),
    { href: PAGE_ROUTES.contribute, label: text.header.contributeLink },
  ];

  return (
    <header className="site-header sticky top-0 z-40 border-b border-border">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link
          href={PAGE_ROUTES.home}
          className="shrink-0 font-display text-lg font-bold tracking-tight text-text hover:text-marker-700"
        >
          {APP_NAME}
        </Link>

        <nav aria-label={text.header.navAriaLabel} className="hidden items-center gap-5 lg:gap-6 xl:flex">
          {navLinks.map((link) => {
            const isCurrent = pathname === localizedPath(lang, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isCurrent ? "page" : undefined}
                className={`whitespace-nowrap text-[0.9375rem] font-medium ${isCurrent ? "text-text" : "text-text-muted hover:text-text"}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2 lg:gap-3">
          <ThemeToggle />
          <NotificationBell />

          {isBootstrapped && accessToken && user ? (
            <div className="hidden xl:block">
              <UserMenu user={user} />
            </div>
          ) : (
            <Link
              href={PAGE_ROUTES.login}
              className="hidden min-h-11 shrink-0 items-center whitespace-nowrap rounded-md border border-border px-4 text-sm font-semibold text-text shadow-(--shadow-border) hover:shadow-(--shadow-border-hover) xl:inline-flex"
            >
              {text.header.loginLink}
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="inline-grid min-h-11 min-w-11 shrink-0 place-items-center rounded-md text-text-muted hover:bg-border hover:text-text xl:hidden"
          >
            {menuOpen ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
            <span className="sr-only">{menuOpen ? text.header.closeMenuLabel : text.header.openMenuLabel}</span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div id="mobile-menu" className="border-t border-border px-4 py-4 xl:hidden">
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-md px-2 py-3 font-medium text-text hover:bg-border"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              {isBootstrapped && accessToken && user ? (
                <>
                  <Link
                    href={PAGE_ROUTES.bookmarks}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-md px-2 py-3 font-medium text-text hover:bg-border"
                  >
                    {text.header.bookmarksLink}
                  </Link>
                  <Link
                    href={PAGE_ROUTES.mySubmissions}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-md px-2 py-3 font-medium text-text hover:bg-border"
                  >
                    {text.header.mySubmissionsLink}
                  </Link>
                  <Link
                    href={PAGE_ROUTES.profile}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-md px-2 py-3 font-medium text-text hover:bg-border"
                  >
                    {text.header.profileLink}
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                    className="block w-full rounded-md px-2 py-3 text-left font-medium text-text hover:bg-border"
                  >
                    {text.header.logoutLabel}
                  </button>
                </>
              ) : (
                <Link
                  href={PAGE_ROUTES.login}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-md px-2 py-3 font-medium text-text hover:bg-border"
                >
                  {text.header.loginRegisterLink}
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
