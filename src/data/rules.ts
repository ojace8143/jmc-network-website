export type RuleSection = {
  heading: string;
  rules: string[];
};

/**
 * Server rules shown on the Rules page.
 *
 * Written to match how the network is actually moderated: laid-back,
 * high-trust, reasonable enforcement. This file is the single source of
 * truth — edit it whenever the rules change.
 */
export const ruleSections: RuleSection[] = [
  {
    heading: "General",
    rules: [
      "Keep it chill. No insanely vulgar stuff.",
      "One person, one account.",
      "I'm pretty reasonable about rules and punishments if you break them, so don't abuse it.",
    ],
  },
  {
    heading: "Building and Gameplay",
    rules: [
      "No griefing, only in the spawn area, unless otherwise specified.",
      "No lag machines, or anything else that seriously taxes the performance of the server.",
      "Keep builds reasonable.",
    ],
  },
  {
    heading: "Cheating, Exploits and Mods",
    rules: [
      "No huge cheats, like xray, etc. Freecam MAY BE PERMITTED under certain circumstances or specific server rules.",
      "No duping, stacking exploits, or NPE abuse.",
      "Report bugs to server owners or maintainers instead of exploiting them.",
    ],
  },
  {
    heading: "Chat",
    rules: [
      "High trust. Just be reasonable and you won't receive a punishment or ban.",
    ],
  },
];
