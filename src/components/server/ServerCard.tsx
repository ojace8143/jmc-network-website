import { ArrowRight, Cpu, Server as ServerIcon } from "lucide-react";
import { getServer } from "../../config/servers";
import { useServerStatus } from "../../hooks/useServerStatus";
import type { ServerConfig } from "../../types";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { CopyableIp } from "../ui/CopyableIp";
import { StatusIndicator } from "./StatusIndicator";
import { cn } from "../../lib/cn";

const accentStyles: Record<
  ServerConfig["accent"],
  { border: string; glow: string; badge: "forge" | "weave" }
> = {
  forge: {
    border: "border-forge-deep/60",
    glow: "radial-gradient(40rem 20rem at 85% -20%, rgba(229,176,120,0.12), transparent 60%)",
    badge: "forge",
  },
  weave: {
    border: "border-weave-deep/60",
    glow: "radial-gradient(40rem 20rem at 85% -20%, rgba(126,212,196,0.12), transparent 60%)",
    badge: "weave",
  },
};

/**
 * Prominent server card shown on the Home page.
 *
 * Shows platform identity, live status, IP with copy, and links to the
 * dedicated server page.
 */
export function ServerCard({ serverId }: { serverId: "neo" | "fab" }) {
  const server = getServer(serverId);
  const { status, stale, refreshing, refresh } = useServerStatus(server);
  const accent = accentStyles[server.accent];
  const href = server.id === "neo" ? "/neo" : "/fabric";

  return (
    <Card
      className={cn(
        "relative overflow-hidden p-6 sm:p-7",
        accent.border,
        "transition-transform hover:-translate-y-0.5",
      )}
    >
      {/* Accent glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: accent.glow }}
      />

      <div className="relative flex h-full flex-col gap-5">
        {/* Header row: platform + version */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "grid size-10 place-items-center border-2",
                server.accent === "forge"
                  ? "border-forge-deep bg-forge/15 text-forge"
                  : "border-weave-deep bg-weave/15 text-weave",
              )}
              aria-hidden="true"
            >
              {server.modProfile === "modded" ? (
                <Cpu size={20} />
              ) : (
                <ServerIcon size={20} />
              )}
            </span>
            <div>
              <p className="font-pixel text-[10px] uppercase tracking-wide text-ink-faint">
                {server.platform}
              </p>
              <h3 className="font-display text-lg font-bold text-ink">
                {server.name}
              </h3>
            </div>
          </div>
          <Badge tone={accent.badge}>{server.version}</Badge>
        </div>

        <p className="text-sm leading-relaxed text-ink-muted">
          {server.description}
        </p>

        {/* IP + copy */}
        <div className="flex flex-wrap items-center gap-3 border-2 border-border bg-bg/60 px-4 py-3">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-ink-faint">
            IP
          </span>
          <CopyableIp value={server.host} />
        </div>

        {/* Live status */}
        <div className="flex items-center justify-between gap-3">
          <StatusIndicator
            status={status}
            stale={stale}
            refreshing={refreshing}
          />
          <button
            type="button"
            onClick={refresh}
            className="text-[10px] font-semibold uppercase tracking-wide text-ink-faint underline-offset-2 hover:text-ink hover:underline"
            aria-label={`Refresh ${server.name} status`}
          >
            Refresh
          </button>
        </div>

        {/* CTA */}
        <div className="mt-auto">
          <Button to={href} variant={server.accent === "forge" ? "primary" : "secondary"} className="w-full sm:w-auto">
            View {server.platform}
            <ArrowRight size={16} aria-hidden="true" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
