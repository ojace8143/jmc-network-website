import { site } from "../config/servers";
import type { ServerConfig, ServerStatus } from "../types";

/**
 * Status provider layer.
 *
 * The default provider is the public mcsrvstat v3 API. A "custom" provider
 * (e.g. a self-hosted mcstatus REST service) is supported via per-server
 * config and returns the same normalized shape.
 */

const MCSRSVSTAT_BASE = "https://api.mcsrvstat.us/3";

type ProviderResponse = {
  online: boolean;
  players: { online: number; max: number };
  version: string | null;
  motd: { clean: string } | null;
  icon: string | null;
};

function buildUrl(server: ServerConfig): string {
  if (server.status.kind === "custom") {
    const base = (server.status.baseUrl ?? "").replace(/\/$/, "");
    const template = server.status.pathTemplate ?? "/{host}:{port}";
    const path = template
      .replaceAll("{host}", server.host)
      .replaceAll("{port}", String(server.port));
    return `${base}${path}`;
  }
  return `${MCSRSVSTAT_BASE}/${server.host}`;
}

/**
 * Fetch a single status check for a server.
 *
 * Throws on network failure, non-OK HTTP status, or malformed response.
 * A server that is down is a *successful* check (online: false), not an error.
 */
export async function fetchServerStatus(
  server: ServerConfig,
  signal?: AbortSignal,
): Promise<ServerStatus> {
  const url = buildUrl(server);
  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`Status provider returned HTTP ${res.status}`);
  }
  const raw = (await res.json()) as Partial<ProviderResponse>;

  if (typeof raw.online !== "boolean") {
    throw new Error("Malformed status response");
  }

  if (raw.online) {
    return {
      kind: "online",
      players: Number(raw.players?.online ?? 0),
      maxPlayers: Number(raw.players?.max ?? 0),
      version: raw.version ?? null,
      motd: raw.motd?.clean ?? null,
      icon: raw.icon ?? null,
      checkedAt: Date.now(),
    };
  }
  return { kind: "offline", checkedAt: Date.now() };
}

/**
 * Run a status check with the configured timeout.
 * Returns the resolved ServerStatus, or an `error` status if the provider
 * itself could not be reached / produced bad data.
 */
export async function checkServerStatus(
  server: ServerConfig,
): Promise<ServerStatus> {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    site.statusTimeoutMs,
  );
  try {
    return await fetchServerStatus(server, controller.signal);
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return {
        kind: "error",
        message: "Status check timed out",
        checkedAt: Date.now(),
      };
    }
    return {
      kind: "error",
      message: err instanceof Error ? err.message : "Status check failed",
      checkedAt: Date.now(),
    };
  } finally {
    clearTimeout(timeout);
  }
}
