import type { ReactNode } from "react";

/**
 * Friendly placeholder for empty states (e.g. no leaderboard data yet).
 */
export function EmptyState({
  icon,
  title,
  hint,
}: {
  icon?: ReactNode;
  title: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border px-6 py-10 text-center">
      {icon && <span className="text-ink-faint" aria-hidden="true">{icon}</span>}
      <p className="font-display text-sm font-bold text-ink-muted">{title}</p>
      {hint && <p className="max-w-xs text-xs text-ink-faint">{hint}</p>}
    </div>
  );
}
