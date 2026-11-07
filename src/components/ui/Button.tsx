import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/cn";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 border-2 px-4 py-2 text-sm font-semibold transition-all " +
  "disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "border-moss-deep bg-moss-deep text-bg hover:bg-moss hover:border-moss " +
    "shadow-[4px_4px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
  secondary:
    "border-border-strong bg-surface-2 text-ink hover:border-moss hover:text-moss",
  ghost:
    "border-transparent bg-transparent text-ink-muted hover:border-border hover:text-ink",
};

export type ButtonProps = {
  variant?: Variant;
  children: ReactNode;
  className?: string;
  /** Internal route; renders a router <Link>. */
  to?: string;
  /** External URL; renders an <a>. */
  href?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
  disabled?: boolean;
  "aria-label"?: string;
};

/**
 * Block-style button. Renders a router link, external anchor, or plain
 * button depending on `to` / `href`.
 */
export function Button({
  variant = "primary",
  children,
  className,
  to,
  href,
  target,
  rel,
  onClick,
  disabled,
  ...rest
}: ButtonProps) {
  const classes = cn(base, variants[variant], className);

  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick} {...rest}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel ?? (target === "_blank" ? "noreferrer" : undefined)}
        className={classes}
        onClick={onClick}
        {...rest}
      >
        {children}
      </a>
    );
  }
  return (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
