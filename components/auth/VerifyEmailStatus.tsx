"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/components/i18n/LocaleLink";
import { useSearchParams } from "next/navigation";
import { useVerifyEmailMutation } from "@/lib/redux/authApi";
import type { ApiErrorBody } from "@/lib/types";
import { useText } from "@/lib/text/useText";
import type { vi } from "@/lib/text/vi";
import { PAGE_ROUTES } from "@/lib/routes";

// Derived from the dictionary's own keys (not a hand-maintained parallel
// union) so the two can never list a different set of statuses. Type-only
// import — `vi` is never used as a value here (see lib/text/index.ts).
type Status = "verifying" | keyof (typeof vi)["auth"]["verifyEmail"]["status"];

function statusFromError(err: unknown): Status {
  if (err && typeof err === "object" && "data" in err) {
    const code = (err as { data?: ApiErrorBody }).data?.error.code;
    if (code === "TOKEN_EXPIRED") return "expired";
    if (code === "TOKEN_ALREADY_USED") return "used";
  }
  return "invalid";
}

export function VerifyEmailStatus() {
  const text = useText();
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
        <p className="text-text-muted">{text.auth.verifyEmail.verifyingBody}</p>
      </div>
    );
  }

  const { title, body } = text.auth.verifyEmail.status[status];
  return (
    <div role="status" className="text-center">
      <p className="font-semibold text-text">{title}</p>
      <p className="mt-2 text-sm text-text-muted">{body}</p>
      <Link href={PAGE_ROUTES.login} className="mt-4 inline-block text-sm font-medium text-marker-700">
        {text.common.goToLoginLink}
      </Link>
    </div>
  );
}
