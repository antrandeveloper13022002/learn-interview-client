import Link from "next/link";
import type { Category, QuestionSummary } from "@/lib/types";
import { text } from "@/lib/text";
import { PAGE_ROUTES } from "@/lib/routes";

type QuestionListProps = {
  questions: QuestionSummary[];
  categories: Category[];
};

export function QuestionList({ questions, categories }: QuestionListProps) {
  if (questions.length === 0) {
    return (
      <div
        role="status"
        className="mt-8 rounded-lg border border-dashed border-neutral-300 p-10 text-center"
      >
        <p className="font-semibold">{text.questions.list.emptyTitle}</p>
        <p className="mt-2 text-sm text-neutral-600">{text.questions.list.emptyBody}</p>
      </div>
    );
  }

  const categoryById = new Map(categories.map((c) => [c.id, c]));

  return (
    <ul className="mt-8 flex flex-col gap-3">
      {questions.map((question) => {
        const category = categoryById.get(question.categoryId);
        return (
          <li key={question.id}>
            <Link
              href={PAGE_ROUTES.questionDetail(question.slug)}
              className="flex flex-col gap-2 rounded-lg border border-neutral-200 bg-white p-4 hover:border-blue-400 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">{question.title}</p>
                {category && <p className="mt-1 text-sm text-neutral-500">{category.name}</p>}
              </div>
              <div className="flex shrink-0 gap-2">
                <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
                  {text.questions.difficultyLabel[question.difficulty]}
                </span>
                {question.isPremium && (
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                    {text.common.premiumBadge}
                  </span>
                )}
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
