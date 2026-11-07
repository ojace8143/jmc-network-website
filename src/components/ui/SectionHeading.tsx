import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

/**
 * Section heading with a pixel "eyebrow" label above the title.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  as: Tag = "h2",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow && (
        <p className="font-pixel text-[10px] uppercase tracking-wider text-moss">
          {eyebrow}
        </p>
      )}
      <Tag className="mt-3 font-display text-2xl font-bold text-ink sm:text-3xl">
        {title}
      </Tag>
      {description && (
        <p className="mt-3 text-sm leading-relaxed text-ink-muted sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}
