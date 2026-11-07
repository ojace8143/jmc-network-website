/**
 * Shared types for the JMC Network site.
 */

/* ------------------------------------------------------------------ */
/* Server configuration                                                */
/* ------------------------------------------------------------------ */

/** Which public status provider backs this server. */
export type StatusProvider = {
  kind: "mcsrvstat" | "custom";
  /**
   * Base URL for custom providers. For the default mcsrvstat provider this
   * is not used. Example: "https://status.jmc.example/api".
   */
  baseUrl?: string;
  /**
   * Path template appended to `baseUrl` for custom providers. Supports
   * `{host}` and `{port}` placeholders. Defaults to "/{host}:{port}".
   */
  pathTemplate?: string;
};

/** A configured Minecraft server. */
export type ServerConfig = {
  /** Unique key used in routes and config lookups. */
  id: "neo" | "fab";
  /** Display name. */
  name: string;
  /** Short platform label, e.g. "NeoForge" or "Fabric". */
  platform: string;
  /** One-line description of the server's flavor. */
  description: string;
  /** Public IP / hostname players connect to. */
  host: string;
  /** Server port. */
  port: number;
  /** Minecraft version, e.g. "1.21.1". */
  version: string;
  /** Accent token used for this server's identity. */
  accent: "forge" | "weave";
  /** Modding profile of the server. */
  modProfile: "modded" | "vanilla-plus";
  /** Status provider configuration. */
  status: StatusProvider;
  /**
   * Optional endpoint returning leaderboard data (see LeaderboardData).
   * When absent (or failing), the static data file is used, and if that is
   * empty the panel shows a "coming soon" placeholder.
   */
  leaderboardEndpoint?: string;
};

/* ------------------------------------------------------------------ */
/* Server status                                                       */
/* ------------------------------------------------------------------ */

/**
 * Discriminated union describing what we know about a server right now.
 *
 * - loading:  we have not resolved a status yet.
 * - online:   the provider says the server is reachable.
 * - offline:  the provider reached the host but the server is down.
 * - error:    we could not reach the status provider itself (network, HTTP,
 *             or malformed response). The last known good status may still be
 *             displayed with the `stale` flag in the UI layer.
 */
export type ServerStatus =
  | { kind: "loading" }
  | {
      kind: "online";
      players: number;
      maxPlayers: number;
      version: string | null;
      motd: string | null;
      icon: string | null;
      checkedAt: number;
    }
  | {
      kind: "offline";
      checkedAt: number;
    }
  | {
      kind: "error";
      message: string;
      checkedAt: number;
    };

/* ------------------------------------------------------------------ */
/* News                                                                */
/* ------------------------------------------------------------------ */

export type NewsCategory = "update" | "maintenance" | "season" | "event";

export type NewsItem = {
  /** Stable unique id (used for React keys and anchors). */
  id: string;
  title: string;
  /** ISO date string, e.g. "2026-11-06". */
  date: string;
  category: NewsCategory;
  summary: string;
  /** Optional external link for details. */
  link?: string;
};

/* ------------------------------------------------------------------ */
/* Leaderboards                                                        */
/* ------------------------------------------------------------------ */

export type LeaderboardEntry = {
  name: string;
  value: number;
};

export type LeaderboardData = {
  title: string;
  /** Optional unit label, e.g. "blocks mined" or "levels". */
  unit?: string;
  entries: LeaderboardEntry[];
};
