import type { HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

/**
 * Block-style card: 2px border, square corners, hard offset shadow.
 */
export function Card({
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "border-2 border-border bg-surface shadow-[4px_4px_0_0_#000]",
        className,
      )}
      {...rest}
    />
  );
}
