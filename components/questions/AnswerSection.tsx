import type { QuestionDetail } from "@/lib/types";
import { PremiumAnswer } from "@/components/questions/PremiumAnswer";
import { text } from "@/lib/text";

export function AnswerSection({ question }: { question: QuestionDetail }) {
  if (!question.hasAnswer) {
    return <p className="text-neutral-600">{text.questions.detail.noAnswerYet}</p>;
  }

  if (!question.isPremium) {
    // Free questions are never gated — the guest-scoped server fetch
    // already carries the real answer.
    return <div className="whitespace-pre-wrap leading-relaxed">{question.answer}</div>;
  }

  return <PremiumAnswer slug={question.slug} />;
}
