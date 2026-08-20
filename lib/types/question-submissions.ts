// User-Contributed Questions (FU-23, backed by BE-57/58/60). Raw userId
// always present — this domain has no anonymous-authorship option, unlike
// CompanyReview/AnswerComment (business-rule.md#user-contributed-questions--
// confirmed-2026-08-11).
export type SubmissionStatus = "PENDING" | "APPROVED" | "REJECTED";

export type QuestionSubmission = {
  id: string;
  userId: string;
  title: string;
  content: string;
  suggestedAnswer: string;
  // Opened 2026-08-19 — the contributor's optional category/tag
  // SUGGESTION, not a final assignment; the admin still always supplies
  // `categoryId` (and may change either) at approval.
  categoryId: string | null;
  category: { id: string; name: string } | null;
  tags: { id: string; name: string }[];
  status: SubmissionStatus;
  rejectionReason: string | null;
  publishedQuestionId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type QuestionSubmissionListResponse = {
  items: QuestionSubmission[];
  total: number;
  page: number;
  pageSize: number;
};

export type CreateQuestionSubmissionRequest = {
  title: string;
  content: string;
  suggestedAnswer: string;
  categoryId?: string;
  tagIds?: string[];
};

// At least one field required — enforced server-side (submission.dto.ts),
// not re-validated here. `categoryId: null` clears a previous suggestion
// back to "not sure" (distinct from omitting it); `Partial` alone can't
// express that, so it's spelled out.
export type UpdateQuestionSubmissionRequest = Partial<Omit<CreateQuestionSubmissionRequest, "categoryId">> & {
  categoryId?: string | null;
};
