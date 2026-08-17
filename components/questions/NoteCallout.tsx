import { ArrowRightIcon } from "@/components/icons";

/**
 * "When to use which" style callout — a short title plus decision-guide
 * bullets. Each bullet is a single admin-written line (e.g. "Shortest path
 * in unweighted graph → BFS"); the segment after the *last* arrow renders
 * bold, a lightweight display heuristic (not stored structure) so the
 * admin form stays a single textarea instead of a repeating fieldset.
 */
export function NoteCallout({ title, items }: { title: string | null; items: string[] }) {
  if (items.length === 0) return null;

  return (
    <div className="rounded-xl bg-correct-bg p-5">
      {title && <p className="font-display mb-3 font-semibold text-correct-text">{title}</p>}
      <ul className="flex flex-col gap-2">
        {items.map((item, i) => {
          const lastArrow = item.lastIndexOf("→");
          const lead = lastArrow === -1 ? item : item.slice(0, lastArrow + 1);
          const emphasized = lastArrow === -1 ? "" : item.slice(lastArrow + 1).trim();
          return (
            <li key={i} className="flex items-start gap-2 text-sm text-correct-text">
              <ArrowRightIcon className="mt-0.5 size-3.5 shrink-0" />
              <span>
                {lead.replace(/→\s*$/, "").trim()}
                {emphasized && (
                  <>
                    {" → "}
                    <strong className="font-semibold">{emphasized}</strong>
                  </>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
