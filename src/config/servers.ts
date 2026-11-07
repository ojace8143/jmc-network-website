import type { ServerConfig } from "../types";

/**
 * Central configuration for the JMC Network site.
 *
 * Everything that is "facts about the servers" lives here: hosts, ports,
 * versions, status endpoints, Discord. Pages and components never hardcode
 * any of it — they read from this module.
 */

export const site = {
  name: "JMC Network",
  shortName: "JMC",
  tagline: "Two worlds. One community.",
  discord: {
    /**
     * Widget embed URL shown on the Home page. Requires the server's widget
     * to be enabled (Server Settings -> Community -> Widget).
     */
    widgetUrl:
      "https://discord.com/widget?id=1412189287796965539&theme=dark",
    /**
     * Optional invite link. Leave empty to hide invite buttons.
     */
    inviteUrl: "",
  },
  /** How often server status is re-polled, in milliseconds. */
  statusPollMs: 60_000,
  /** Per-request timeout for status checks, in milliseconds. */
  statusTimeoutMs: 8_000,
} as const;

/**
 * The two JMC servers.
 *
 * Status defaults to the public mcsrvstat v3 API:
 *   GET https://api.mcsrvstat.us/3/{host}
 *
 * To use your own status endpoint (e.g. a self-hosted mcstatus REST service
 * returning `{ online, players: { online, max }, version, motd, icon }`),
 * set `status` to:
 *   { kind: "custom", baseUrl: "https://status.example.com/api",
 *     pathTemplate: "/{host}:{port}" }
 */
export const servers: ServerConfig[] = [
  {
    id: "neo",
    name: "JMC NeoForge",
    platform: "NeoForge",
    description:
      "The heavily modded experience — quality of life, tech, and adventure on 1.21.1.",
    host: "neo.orcweb.xyz",
    port: 25565,
    version: "1.21.1",
    accent: "forge",
    modProfile: "modded",
    status: { kind: "mcsrvstat" },
  },
  {
    id: "fab",
    name: "JMC Fabric",
    platform: "Fabric",
    description:
      "Fast and light — vanilla or vanilla+ on 1.21.1, tuned for smooth play.",
    host: "fab.orcweb.xyz",
    port: 25565,
    version: "1.21.1",
    accent: "weave",
    modProfile: "vanilla-plus",
    status: { kind: "mcsrvstat" },
  },
];

export function getServer(id: "neo" | "fab"): ServerConfig {
  const server = servers.find((s) => s.id === id);
  if (!server) {
    throw new Error(`Unknown server id: ${id}`);
  }
  return server;
}
