import { apiServerBaseUrl } from "@/lib/env";
import type { ApiErrorBody } from "@/lib/types";

/**
 * Server Component fetcher — guest-scoped only. It never forwards a session,
 * so every call renders as an unauthenticated visitor would see it. This is
 * a deliberate MVP scope decision, not an oversight — see
 * docs/architecture/sequence-diagram.md#0-session-strategy-for-frontend-user.
 * Authenticated/personalized data fetching goes through lib/redux/api.ts
 * (RTK Query) from Client Components instead.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${apiServerBaseUrl}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as ApiErrorBody | null;
    throw new ApiError(
      res.status,
      body?.error.code ?? "UNKNOWN_ERROR",
      body?.error.message ?? "An unexpected error occurred.",
      body?.error.details,
    );
  }

  return res.json() as Promise<T>;
}
