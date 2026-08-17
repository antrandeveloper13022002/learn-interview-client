import { Highlight, themes } from "prism-react-renderer";

/**
 * Opened 2026-08-13 — optional code demo shown alongside an answer. Uses
 * prism-react-renderer (not shiki) specifically because this same
 * component renders from two different contexts: a Server Component (free
 * questions, answer already in the SSR payload) and a Client Component
 * (PremiumAnswer.tsx's client-side entitlement re-check) — prism-react-
 * renderer's `Highlight` needs no client-only browser API, so one
 * implementation works in both without a "use client" boundary of its own.
 *
 * Deliberately theme-fixed (vsDark), not following the site's light/dark
 * toggle — a dark code block reads better for syntax highlighting
 * regardless of page theme, the same choice most documentation sites make.
 */
export function CodeDemoBlock({ language, code }: { language: string; code: string }) {
  return (
    <Highlight theme={themes.vsDark} code={code.trim()} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={`${className} overflow-x-auto rounded-xl p-4 text-[13px] leading-relaxed`}
          style={style}
        >
          <code>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </code>
        </pre>
      )}
    </Highlight>
  );
}
