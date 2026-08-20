// Q&A Comments + Ratings (FU-29, backed by BE-48/49/65).

export type CommentStatus = "PUBLISHED" | "REMOVED";

export type CommentAuthor = {
  // Null when isAnonymous — enforced server-side, same pattern as
  // CompanyReview.userId (business-rule.md's Q&A Comments section).
  userId: string | null;
  // BE-65 — null when isAnonymous, or when a non-anonymous author has no
  // displayName set (not distinguishable from this field alone).
  authorDisplayName: string | null;
  isAnonymous: boolean;
  // FU-34 — true only for the requesting caller's own comment, computed
  // server-side against the real userId before it's nulled above. Use
  // this for own-comment detection (Edit/Delete), never `userId` directly
  // — that comparison can never match an anonymous comment's own author
  // (same class of bug as CompanyReview, see BE-67/TC-FU30-03).
  isMine: boolean;
};

export type Comment = CommentAuthor & {
  id: string;
  answerId: string;
  parentCommentId: string | null;
  content: string;
  status: CommentStatus;
  // Soft admin-only moderation signal (BE-46 #8c) — never rendered to the
  // end user, present here only because the API returns it on every row.
  similarityFlagged: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ThreadedComment = Comment & { replies: Comment[] };

export type CreateCommentRequest = {
  content: string;
  isAnonymous: boolean;
  parentCommentId?: string;
};

export type RatingSummary = {
  averageScore: number | null;
  ratingCount: number;
};
