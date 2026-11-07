export type RuleSection = {
  heading: string;
  rules: string[];
};

/**
 * Server rules shown on the Rules page.
 *
 * These are sensible community defaults. Edit them to match how you actually
 * moderate the servers — this file is the single source of truth.
 */
export const ruleSections: RuleSection[] = [
  {
    heading: "General",
    rules: [
      "Be respectful. No harassment, hate speech, or personal attacks.",
      "No spam or excessive use of caps, emotes, or repeated messages.",
      "One person, one account. No alt abuse.",
      "English is the primary language in global chat.",
    ],
  },
  {
    heading: "Building & Gameplay",
    rules: [
      "No griefing or destroying other players' builds.",
      "Build at least 100 blocks from spawn or another player's build.",
      "No lag machines, chunk-loaders, or resource farms that tax the server.",
      "Keep builds within reasonable bounds. No world-border or sky builds without staff approval.",
    ],
  },
  {
    heading: "Cheating & Exploits",
    rules: [
      "No cheats, hacks, X-ray, or any unfair advantage.",
      "No duping, item stacking exploits, or NPE abuse.",
      "Report bugs to staff instead of exploiting them.",
    ],
  },
  {
    heading: "Chat & Community",
    rules: [
      "No advertising or self-promotion of other servers.",
      "No sharing of personal information (yours or others') — doxxing is a ban.",
      "Discord rules apply in all voice and text channels.",
    ],
  },
];
