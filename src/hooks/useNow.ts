import { useEffect, useState } from "react";

/**
 * Re-render on a fixed interval so relative timestamps stay fresh.
 *
 * Returns the current epoch milliseconds, updated every `tickMs`. Use a
 * coarse tick (5s+) — per-second re-renders are wasted work for a label
 * like "checked 42s ago".
 */
export function useNow(tickMs: number): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), tickMs);
    return () => window.clearInterval(id);
  }, [tickMs]);

  return now;
}
