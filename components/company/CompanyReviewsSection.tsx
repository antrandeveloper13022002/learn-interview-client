"use client";

import { ReviewForm } from "@/components/company/ReviewForm";
import { ReviewList } from "@/components/company/ReviewList";
import { useGetCompanyReviewsQuery } from "@/lib/redux/companyReviewApi";
import { useAppSelector } from "@/lib/redux/hooks";
import { useText } from "@/lib/text/useText";

export function CompanyReviewsSection({ companyId }: { companyId: string }) {
  const text = useText();
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const isBootstrapped = useAppSelector((s) => s.auth.isBootstrapped);
  // Same cache key ReviewList queries below — RTK Query dedupes this to one
  // request, this call just also wants `total` for the heading count.
  const { data } = useGetCompanyReviewsQuery(companyId, { skip: !isBootstrapped });

  return (
    <section className="mt-10">
      <p className="font-mono inline-flex items-center gap-2 rounded-full bg-wash-bg px-3 py-1 text-[0.8125rem] font-medium text-wash-text">
        {text.companies.reviews.eyebrow(data?.total ?? 0)}
      </p>
      <h2 className="font-display mt-3 text-2xl font-semibold tracking-tight">{text.companies.reviews.heading}</h2>

      <h3 className="font-display mt-8 mb-4 text-lg font-semibold text-text">
        {accessToken ? text.companies.reviews.writeReviewHeading : text.companies.reviews.shareExperienceHeading}
      </h3>
      <ReviewForm companyId={companyId} />

      <div className="mt-6">
        <ReviewList companyId={companyId} />
      </div>
    </section>
  );
}
