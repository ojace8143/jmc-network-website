import type { ServerConfig } from "../types";

/**
 * Route helpers for server-specific paths.
 *
 * Server ids map 1:1 onto routes (/neo, /fabric). Keeping that mapping in
 * one place avoids sprinkling `id === "neo" ? ... : ...` ternaries through
 * components.
 */

/** The detail-page route for a server, e.g. "/neo" or "/fabric". */
export function serverRoute(server: Pick<ServerConfig, "id">): string {
  return `/${server.id}`;
}
