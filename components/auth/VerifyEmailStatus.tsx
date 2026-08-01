"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useVerifyEmailMutation } from "@/lib/redux/authApi";
import type { ApiErrorBody } from "@/lib/types";
import { text } from "@/lib/text";
import { PAGE_ROUTES } from "@/lib/routes";

const COPY = text.auth.verifyEmail.status;

// Derived from COPY's own keys (not a hand-maintained parallel union) so the
// two can never list a different set of statuses.
type Status = "verifying" | keyof typeof COPY;

function statusFromError(err: unknown): Status {
  if (err && typeof err === "object" && "data" in err) {
    const code = (err as { data?: ApiErrorBody }).data?.error.code;
    if (code === "TOKEN_EXPIRED") return "expired";
    if (code === "TOKEN_ALREADY_USED") return "used";
  }
  return "invalid";
}

export function VerifyEmailStatus() {
  const token = useSearchParams().get("token");
  const [verifyEmail] = useVerifyEmailMutation();
  const [status, setStatus] = useState<Status>(token ? "verifying" : "missing");
  const attempted = useRef(false);

  useEffect(() => {
    if (!token || attempted.current) return;
    attempted.current = true;
    verifyEmail({ token })
      .unwrap()
      .then(() => setStatus("success"))
      .catch((err) => setStatus(statusFromError(err)));
  }, [token, verifyEmail]);

  if (status === "verifying") {
    return (
      <div role="status" aria-busy="true" className="text-center">
        <span className="sr-only">{text.auth.verifyEmail.verifyingSrOnly}</span>
        <p className="text-neutral-600">{text.auth.verifyEmail.verifyingBody}</p>
      </div>
    );
  }

  const { title, body } = COPY[status];
  return (
    <div role="status" className="rounded-lg border border-neutral-200 bg-white p-6 text-center">
      <p className="font-semibold">{title}</p>
      <p className="mt-2 text-sm text-neutral-600">{body}</p>
      <Link href={PAGE_ROUTES.login} className="mt-4 inline-block text-sm font-medium text-blue-700">
        {text.common.goToLoginLink}
      </Link>
    </div>
  );
}
