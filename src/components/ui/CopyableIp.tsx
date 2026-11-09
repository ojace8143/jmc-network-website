import { Check, Copy } from "lucide-react";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import { cn } from "../../lib/cn";

/**
 * IP display with copy-to-clipboard and transient "Copied" feedback.
 * The IP itself uses the pixel font; the copy affordance is an icon button
 * with an accessible label.
 */
export function CopyableIp({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const { copied, copy } = useCopyToClipboard(value);

  return (
    <span className={cn("inline-flex items-center", className)}>
      <code className="font-pixel text-[11px] leading-none text-ink sm:text-xs">
        {value}
      </code>
      <button
        type="button"
        onClick={() => void copy(value)}
        aria-label={copied ? "IP copied" : `Copy IP ${value}`}
        className={cn(
          "ml-2 inline-flex items-center gap-1.5 border-2 px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wide transition-colors",
          copied
            ? "border-online/60 bg-online/15 text-online"
            : "border-border-strong bg-surface-2 text-ink-muted hover:border-moss hover:text-moss",
        )}
      >
        {copied ? (
          <Check size={14} aria-hidden="true" />
        ) : (
          <Copy size={14} aria-hidden="true" />
        )}
        <span>{copied ? "Copied" : "Copy"}</span>
      </button>
    </span>
  );
}
