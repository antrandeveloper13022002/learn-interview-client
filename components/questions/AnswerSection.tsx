import type { QuestionDetail } from "@/lib/types";
import { PremiumAnswer } from "@/components/questions/PremiumAnswer";
import { RevealAnswer } from "@/components/questions/RevealAnswer";
import { getText } from "@/lib/text";
import type { Locale } from "@/lib/routes/locale";

export function AnswerSection({ question, lang }: { question: QuestionDetail; lang: Locale }) {
  const text = getText(lang);
  if (!question.hasAnswer) {
    return <p className="text-text-muted">{text.questions.detail.noAnswerYet}</p>;
  }

  if (!question.isPremium) {
    // Free questions are never gated — the guest-scoped server fetch
    // already carries the real answer. Still blurred-until-clicked so
    // visitors try answering themselves first (flashcard pattern), purely
    // a client-side reveal — the text is already in the SSR HTML for SEO.
    return (
      <RevealAnswer>
        <div className="whitespace-pre-wrap leading-relaxed">{question.answer}</div>
      </RevealAnswer>
    );
  }

  return <PremiumAnswer slug={question.slug} />;
}
