// Company Reviews (FU-12, backed by BE-37/38/39).
export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export type CompanyReview = {
  id: string;
  companyId: string;
  // Null when isAnonymous — enforced server-side, even for the author's own
  // view (business-rule.md#company-reviews--moderation--confirmed-2026-08-04).
  userId: string | null;
  rating: number;
  content: string;
  isAnonymous: boolean;
  status: ReviewStatus;
  adminReply: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CompanyReviewListResponse = {
  items: CompanyReview[];
  total: number;
  page: number;
  pageSize: number;
};

export type CreateCompanyReviewRequest = {
  rating: number;
  content: string;
  isAnonymous: boolean;
};
