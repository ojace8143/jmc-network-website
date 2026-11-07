import { AlertTriangle, Loader2, Users } from "lucide-react";
import type { ServerStatus } from "../../types";
import { Skeleton } from "../ui/Skeleton";
import { cn } from "../../lib/cn";

function Dot({ className }: { className?: string }) {
  return (
    <span
      className={cn("size-2 shrink-0 animate-pulse-dot", className)}
      aria-hidden="true"
    />
  );
}

/**
 * Live status readout for a server.
 *
 * States:
 * - loading:  skeleton bar ("Checking...").
 * - online:   green dot, "Online", live player count (and max/version).
 * - offline:  red dot, "Offline".
 * - error:    amber dot, "Status unavailable" (or last known state when `stale`).
 */
export function StatusIndicator({
  status,
  stale,
  refreshing,
  className,
}: {
  status: ServerStatus;
  stale: boolean;
  refreshing: boolean;
  className?: string;
}) {
  if (status.kind === "loading") {
    return (
      <div
        className={cn(
          "flex items-center gap-2 text-sm text-ink-muted",
          className,
        )}
        role="status"
      >
        <Loader2 size={14} className="animate-spin" aria-hidden="true" />
        <span className="sr-only">Checking server status</span>
        Checking…
        {refreshing && (
          <Skeleton className="h-2 w-16" />
        )}
      </div>
    );
  }

  if (status.kind === "online") {
    return (
      <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-1 text-sm", className)}>
        <span className="inline-flex items-center gap-2 text-online">
          <Dot className="bg-online" />
          <span className="font-semibold">Online</span>
        </span>
        <span className="inline-flex items-center gap-1.5 text-ink-muted">
          <Users size={14} aria-hidden="true" />
          {status.players}
          {status.maxPlayers > 0 && (
            <span className="text-ink-faint">/ {status.maxPlayers}</span>
          )}
          <span className="sr-only">players online</span>
        </span>
        {status.version && (
          <span className="text-xs text-ink-faint">v{status.version}</span>
        )}
        {stale && (
          <span className="font-pixel text-[8px] uppercase text-unknown">
            last seen
          </span>
        )}
      </div>
    );
  }

  if (status.kind === "offline") {
    return (
      <div className={cn("flex items-center gap-2 text-sm", className)}>
        <span className="inline-flex items-center gap-2 text-offline">
          <Dot className="bg-offline" />
          <span className="font-semibold">Offline</span>
        </span>
        <span className="text-xs text-ink-faint">
          {stale ? "(last checked, provider unreachable)" : "server is down"}
        </span>
      </div>
    );
  }

  // error
  return (
    <div className={cn("flex items-center gap-2 text-sm", className)}>
      <span className="inline-flex items-center gap-2 text-unknown">
        <Dot className="bg-unknown" />
        <AlertTriangle size={14} aria-hidden="true" />
        <span className="font-semibold">Status unavailable</span>
      </span>
      <span className="text-xs text-ink-faint">{status.message}</span>
    </div>
  );
}
