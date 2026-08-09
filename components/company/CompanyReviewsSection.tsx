"use client";

import { ReviewForm } from "@/components/company/ReviewForm";
import { ReviewList } from "@/components/company/ReviewList";
import { useText } from "@/lib/text/useText";

export function CompanyReviewsSection({ companyId }: { companyId: string }) {
  const text = useText();

  return (
    <section className="mt-10">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">{text.companies.reviews.heading}</h2>
      <div className="mt-4">
        <ReviewForm companyId={companyId} />
      </div>
      <div className="mt-6">
        <ReviewList companyId={companyId} />
      </div>
    </section>
  );
}
