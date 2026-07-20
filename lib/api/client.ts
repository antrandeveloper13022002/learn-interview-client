import { env } from "@/lib/env";

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

type ApiErrorEnvelope = {
  error: { code: string; message: string; details?: unknown };
};

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as ApiErrorEnvelope | null;
    throw new ApiError(
      res.status,
      body?.error.code ?? "UNKNOWN_ERROR",
      body?.error.message ?? "An unexpected error occurred.",
      body?.error.details,
    );
  }

  return res.json() as Promise<T>;
}
