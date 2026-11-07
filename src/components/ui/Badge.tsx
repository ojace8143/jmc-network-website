import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

type Tone = "neutral" | "moss" | "forge" | "weave" | "online" | "offline" | "unknown";

const tones: Record<Tone, string> = {
  neutral: "border-border bg-surface-2 text-ink-muted",
  moss: "border-moss-deep bg-moss/15 text-moss",
  forge: "border-forge-deep bg-forge/15 text-forge",
  weave: "border-weave-deep bg-weave/15 text-weave",
  online: "border-online/60 bg-online/15 text-online",
  offline: "border-offline/60 bg-offline/15 text-offline",
  unknown: "border-unknown/60 bg-unknown/15 text-unknown",
};

/**
 * Small square badge with a pixel-ish font, used for labels and category chips.
 */
export function Badge({
  tone = "neutral",
  children,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border-2 px-2 py-1 font-pixel text-[9px] uppercase tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
