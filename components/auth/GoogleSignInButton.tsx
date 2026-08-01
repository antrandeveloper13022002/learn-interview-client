import { env } from "@/lib/env";
import { API_ROUTES } from "@/lib/routes";

/**
 * A real top-level navigation, not a fetch — the OAuth consent screen
 * requires leaving the SPA context. Same destination from both login and
 * register (backend decides create-vs-link, business-rule.md#google-oauth).
 */
export function GoogleSignInButton({ label }: { label: string }) {
  return (
    <a
      href={`${env.NEXT_PUBLIC_API_URL}${API_ROUTES.auth.google}`}
      className="flex min-h-11 items-center justify-center gap-2 rounded-md border border-neutral-300 font-medium"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
        <path d="M22 12.2c0-.7-.06-1.4-.18-2.1H12v4h5.6a4.8 4.8 0 0 1-2.1 3.1v2.6h3.4c2-1.8 3.1-4.5 3.1-7.6Z" fill="#4285F4" />
        <path d="M12 22c2.8 0 5.2-.9 6.9-2.5l-3.4-2.6c-.9.6-2.1 1-3.5 1-2.7 0-5-1.8-5.8-4.3H2.7v2.7A10 10 0 0 0 12 22Z" fill="#34A853" />
        <path d="M6.2 13.6a6 6 0 0 1 0-3.8V7.1H2.7a10 10 0 0 0 0 9l3.5-2.5Z" fill="#FBBC05" />
        <path d="M12 6.4c1.5 0 2.9.5 4 1.5l3-3A10 10 0 0 0 2.7 7.1l3.5 2.7c.8-2.5 3.1-4.3 5.8-4.3Z" fill="#EA4335" />
      </svg>
      {label}
    </a>
  );
}
