// Minimal inline-Markdown rendering for Answer.content/contentEn — **bold**,
// `code`, and *italic* only (no headers/lists/links/block code — those
// already have dedicated places: CodeDemoBlock for code, NoteCallout for
// decision-guide bullets). Chosen specifically because this syntax is
// already present throughout the existing seeded answer text (backtick-
// wrapped terms like `var`/`let`/`const`) and is the same convention this
// project's own docs/comments already use — no new convention for the
// admin to learn, and every existing question benefits immediately without
// re-authoring.
// `(?!\s)`/`(?<!\s)` right after the opening and right before the closing
// marker (CommonMark's left/right-flanking delimiter rule, simplified) —
// without this, algorithmic-complexity text like "O(n * log n)" gets the
// entire span between its two multiplication asterisks swallowed into an
// unintended <em>, since a bare `*...*` with no such guard matches across
// any whitespace-padded `*`.
const INLINE_TOKEN = /(\*\*(?!\s).+?(?<!\s)\*\*|`.+?`|\*(?!\s).+?(?<!\s)\*)/g;

function renderInlineSegment(segment: string, key: number): React.ReactNode {
  if (segment.startsWith("**") && segment.endsWith("**")) {
    return (
      <strong key={key} className="font-semibold text-text">
        {segment.slice(2, -2)}
      </strong>
    );
  }
  if (segment.startsWith("`") && segment.endsWith("`")) {
    return (
      <code key={key} className="rounded bg-marker-100 px-1.5 py-0.5 font-mono text-[0.9em] text-marker-700">
        {segment.slice(1, -1)}
      </code>
    );
  }
  if (segment.startsWith("*") && segment.endsWith("*")) {
    return <em key={key}>{segment.slice(1, -1)}</em>;
  }
  return segment;
}

function renderParagraph(paragraph: string): React.ReactNode {
  return paragraph.split(INLINE_TOKEN).map((part, i) => (part ? renderInlineSegment(part, i) : null));
}

/** Renders Answer.content/contentEn with bold/code/italic inline markers
 * and blank-line paragraph breaks. Plain text with none of these markers
 * renders exactly as before (no visual change). */
export function FormattedAnswerText({ text }: { text: string }) {
  const paragraphs = text.split(/\n{2,}/);
  return (
    <div className="flex flex-col gap-4 leading-relaxed">
      {paragraphs.map((paragraph, i) => (
        <p key={i} className="whitespace-pre-wrap">
          {renderParagraph(paragraph)}
        </p>
      ))}
    </div>
  );
}
