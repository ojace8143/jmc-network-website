import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import { leaderboards as staticBoards } from "../../data/leaderboards";
import type { LeaderboardData, ServerConfig } from "../../types";
import { Card } from "../ui/Card";
import { EmptyState } from "../ui/EmptyState";
import { Skeleton } from "../ui/Skeleton";

type PanelState =
  | { kind: "loading" }
  | { kind: "ready"; data: LeaderboardData }
  | { kind: "empty" };

function resolveFallback(server: ServerConfig): LeaderboardData | null {
  const board = staticBoards[server.id];
  if (board && board.entries.length > 0) return board;
  return null;
}

/**
 * Leaderboard for a server.
 *
 * Resolution order:
 *  1. `server.leaderboardEndpoint` (live JSON, if configured).
 *  2. Static data from `src/data/leaderboards.ts`.
 *  3. A clearly-labeled "coming soon" placeholder.
 *
 * We never fabricate stats: with no data anywhere, the placeholder shows.
 */
export function LeaderboardPanel({ server }: { server: ServerConfig }) {
  const [state, setState] = useState<PanelState>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const endpoint = server.leaderboardEndpoint;

      if (endpoint) {
        try {
          const res = await fetch(endpoint, {
            headers: { accept: "application/json" },
          });
          if (res.ok) {
            const json = (await res.json()) as LeaderboardData;
            if (json && Array.isArray(json.entries)) {
              if (!cancelled) setState({ kind: "ready", data: json });
              return;
            }
          }
        } catch {
          // fall through to static data
        }
      }

      const fallback = resolveFallback(server);
      if (cancelled) return;
      if (fallback) setState({ kind: "ready", data: fallback });
      else setState({ kind: "empty" });
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [server]);

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <Trophy size={16} className="text-forge" aria-hidden="true" />
        <h3 className="font-display text-base font-bold text-ink">
          {state.kind === "ready" ? state.data.title : "Leaderboard"}
        </h3>
      </div>

      <div className="mt-4">
        {state.kind === "loading" && (
          <div className="space-y-2" role="status">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            <span className="sr-only">Loading leaderboard</span>
          </div>
        )}

        {state.kind === "ready" && state.data.entries.length > 0 && (
          <ol className="space-y-1">
            {state.data.entries.slice(0, 10).map((entry, i) => (
              <li
                key={`${entry.name}-${i}`}
                className="flex items-center gap-3 border-b border-border/60 py-2 last:border-0"
              >
                <span className="w-6 text-right font-pixel text-[10px] text-ink-faint">
                  {i + 1}
                </span>
                <span className="flex-1 truncate text-sm font-medium text-ink">
                  {entry.name}
                </span>
                <span className="text-sm font-semibold text-moss">
                  {entry.value.toLocaleString()}
                  {state.data.unit && (
                    <span className="ml-1 text-xs font-normal text-ink-faint">
                      {state.data.unit}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ol>
        )}

        {state.kind === "empty" && (
          <EmptyState
            icon={<Trophy size={22} aria-hidden="true" />}
            title="Leaderboards coming soon"
            hint="Stats for this server are on the way. No numbers here until real data is connected."
          />
        )}
      </div>
    </Card>
  );
}
