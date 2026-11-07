import { cn } from "../../lib/cn";

/**
 * Loading placeholder bar. Square, subtle, non-animated flicker (respecting
 * reduced motion via a gentle pulse).
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block animate-pulse-dot border border-border bg-surface-2",
        className,
      )}
    />
  );
}
