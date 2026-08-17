import type { QuestionDetail } from "@/lib/types";
import { AnswerCard } from "@/components/questions/AnswerCard";
import { PremiumAnswer } from "@/components/questions/PremiumAnswer";
import { RevealAnswer } from "@/components/questions/RevealAnswer";
import { CodeDemoBlock } from "@/components/questions/CodeDemoBlock";
import { NoteCallout } from "@/components/questions/NoteCallout";
import { FormattedAnswerText } from "@/components/questions/FormattedAnswerText";
import { ReferenceLinksSection } from "@/components/questions/ReferenceLinksSection";
import { getText } from "@/lib/text";
import type { Locale } from "@/lib/routes/locale";

export function AnswerSection({ question, lang }: { question: QuestionDetail; lang: Locale }) {
  const text = getText(lang);
  const title = text.questions.detail.answerHeading;

  // referenceLinks is never gated (schema.prisma's Question.referenceLinks
  // comment) — rendered regardless of premium/entitlement/answer state.
  const referenceLinks = <ReferenceLinksSection links={question.referenceLinks} lang={lang} />;

  if (!question.hasAnswer) {
    return (
      <>
        <AnswerCard title={title}>
          <p className="text-text-muted">{text.questions.detail.noAnswerYet}</p>
        </AnswerCard>
        {referenceLinks}
      </>
    );
  }

  // `question.answer` already present means the guest-scoped server fetch
  // was entitled to it — either a free question, or a premium one the
  // backend currently unlocks for everyone (PREMIUM_GATING_ENABLED=false,
  // see subscription.service.ts's getEntitlement). Branching on
  // `!question.isPremium` alone (pre-2026-08-18) discarded this SSR content
  // for any premium question and unconditionally deferred to
  // PremiumAnswer's client-side re-fetch — which itself skips entirely for
  // a guest (no accessToken), so a guest never saw content the backend had
  // already unlocked for them. Checking the field's actual presence fixes
  // that for both cases without needing to know which one it is.
  if (question.answer !== undefined) {
    return (
      <>
        <AnswerCard
          title={title}
          status={question.isPremium ? text.questions.detail.premiumAnswer.unlockedBadge : text.questions.detail.freeBadge}
        >
          <RevealAnswer>
            <div className="flex flex-col gap-5">
              <FormattedAnswerText text={question.answer} />
              {question.codeDemo && <CodeDemoBlock language={question.codeDemo.language} code={question.codeDemo.code} />}
              {question.note && <NoteCallout title={question.note.title} items={question.note.items} />}
            </div>
          </RevealAnswer>
        </AnswerCard>
        {referenceLinks}
      </>
    );
  }

  return (
    <>
      <PremiumAnswer slug={question.slug} title={title} />
      {referenceLinks}
    </>
  );
}
