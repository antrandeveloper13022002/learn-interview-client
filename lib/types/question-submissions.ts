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
};

// At least one field required — enforced server-side (submission.dto.ts),
// not re-validated here.
export type UpdateQuestionSubmissionRequest = Partial<CreateQuestionSubmissionRequest>;
