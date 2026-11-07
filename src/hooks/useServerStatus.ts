import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "../config/servers";
import { checkServerStatus } from "../lib/status";
import type { ServerConfig, ServerStatus } from "../types";

type UseServerStatusResult = {
  /** The current resolved status. */
  status: ServerStatus;
  /**
   * True when the provider itself failed but we are still displaying the
   * last known good status (from a previous successful check).
   */
  stale: boolean;
  /** True while a background/manual refresh is in flight. */
  refreshing: boolean;
  /** Force an immediate status check. */
  refresh: () => void;
};

/**
 * Poll a server's status with the site-wide interval.
 *
 * Behavior:
 * - First render: `loading`.
 * - Polls every `site.statusPollMs`, pausing while the tab is hidden.
 * - Provider errors keep the last known good status visible (marked `stale`)
 *   instead of flashing the UI between states.
 */
export function useServerStatus(
  server: ServerConfig,
): UseServerStatusResult {
  const [status, setStatus] = useState<ServerStatus>({ kind: "loading" });
  const [stale, setStale] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Keep a ref to the latest status so error handling can decide whether to
  // keep it (stale) or show the error.
  const lastGoodRef = useRef<ServerStatus | null>(null);
  const inFlightRef = useRef(false);
  const mountedRef = useRef(true);

  const runCheck = useCallback(async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setRefreshing(true);
    try {
      const next = await checkServerStatus(server);
      if (!mountedRef.current) return;
      if (next.kind === "error") {
        if (lastGoodRef.current) {
          // Keep showing the last known good status, but flag it stale.
          setStatus(lastGoodRef.current);
          setStale(true);
        } else {
          setStatus(next);
        }
      } else {
        if (next.kind === "online") {
          lastGoodRef.current = next;
        } else if (next.kind === "offline") {
          // Offline is a definitive provider answer, not an error.
          lastGoodRef.current = next;
        }
        setStatus(next);
        setStale(false);
      }
    } finally {
      inFlightRef.current = false;
      if (mountedRef.current) {
        setRefreshing(false);
      }
    }
  }, [server]);

  useEffect(() => {
    mountedRef.current = true;
    void runCheck();

    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void runCheck();
      }
    }, site.statusPollMs);

    // Re-check immediately when the tab becomes visible again.
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        void runCheck();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      mountedRef.current = false;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [runCheck]);

  return { status, stale, refreshing, refresh: () => void runCheck() };
}
