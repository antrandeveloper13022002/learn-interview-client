// Company Reviews (FU-12, backed by BE-37/38/39).
export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export type CompanyReview = {
  id: string;
  companyId: string;
  // Null when isAnonymous — enforced server-side, even for the author's own
  // view (business-rule.md#company-reviews--moderation--confirmed-2026-08-04).
  userId: string | null;
  // BE-65 — null when isAnonymous, or when the non-anonymous author has no
  // displayName set (the two cases aren't distinguishable from this field).
  authorDisplayName: string | null;
  // BE-67 — true only for the requesting caller's own review, computed
  // server-side against the real userId before it's nulled above. Use this
  // for own-review detection instead of comparing `userId` directly — that
  // comparison can never match an anonymous review's own author, since
  // `userId` is null for them too (found live via TC-FU30-03).
  isMine: boolean;
  rating: number;
  content: string;
  isAnonymous: boolean;
  status: ReviewStatus;
  adminReply: string | null;
  createdAt: string;
  updatedAt: string;
  // BE-73 — never hidden on an anonymous review, unlike userId/
  // authorDisplayName above: a like is the viewer's own action, not
  // something that identifies the review's author.
  likeCount: number;
  isLikedByMe: boolean;
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
