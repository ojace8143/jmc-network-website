import type { LeaderboardData } from "../types";

/**
 * Static leaderboard data, used as a fallback when a server has no
 * `leaderboardEndpoint` configured (or that endpoint fails).
 *
 * Ships empty by design — we never fabricate statistics. When a board is
 * empty the panel shows a "coming soon" placeholder instead.
 *
 * To seed a board, add an entry like the commented example below:
 *
 * export const leaderboards: Record<string, LeaderboardData> = {
 *   neo: {
 *     title: "Top Builders",
 *     unit: "blocks placed",
 *     entries: [
 *       { name: "ExamplePlayer", value: 123456 },
 *     ],
 *   },
 * };
 */
export const leaderboards: Record<string, LeaderboardData> = {
  neo: { title: "Top Builders", entries: [] },
  fab: { title: "Top Explorers", entries: [] },
};
