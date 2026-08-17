/**
 * Bordered card frame around a question's answer — header row (title +
 * entitlement status) over a padded body. Shared by every AnswerSection
 * branch (no answer / free / premium locked / premium unlocked) so the
 * frame stays consistent regardless of which state is rendering inside it.
 */
export function AnswerCard({
  title,
  status,
  children,
}: {
  title: string;
  status?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <h2 className="font-display font-semibold text-text">{title}</h2>
        {status && <span className="font-mono text-xs text-text-muted">{status}</span>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
