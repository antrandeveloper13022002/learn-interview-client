"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRefreshMutation } from "@/lib/redux/authApi";
import { text } from "@/lib/text";
import { PAGE_ROUTES } from "@/lib/routes";

export function GoogleCallbackStatus() {
  const params = useSearchParams();
  const router = useRouter();
  const [refresh] = useRefreshMutation();
  const attempted = useRef(false);
  const [failed, setFailed] = useState(params.get("error") === "1");

  useEffect(() => {
    if (attempted.current || failed) return;
    attempted.current = true;
    refresh()
      .unwrap()
      .then(() => router.replace(PAGE_ROUTES.home))
      .catch(() => setFailed(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [failed]);

  if (failed) {
    return (
      <div role="alert" className="rounded-lg border border-neutral-200 bg-white p-6 text-center">
        <p className="font-semibold">{text.auth.googleCallback.failedTitle}</p>
        <p className="mt-2 text-sm text-neutral-600">{text.auth.googleCallback.failedBody}</p>
        <Link href={PAGE_ROUTES.login} className="mt-4 inline-block text-sm font-medium text-blue-700">
          {text.auth.googleCallback.backToLoginLink}
        </Link>
      </div>
    );
  }

  return (
    <div role="status" aria-busy="true" className="text-center">
      <span className="sr-only">{text.auth.googleCallback.completingSrOnly}</span>
      <p className="text-neutral-600">{text.auth.googleCallback.completingBody}</p>
    </div>
  );
}
