import type { NewsItem } from "../types";

/**
 * News / announcements for the JMC Network.
 *
 * Add new entries here. They appear on the Home page (latest 3) and on the
 * dedicated News page (with category filtering). Order newest-first is
 * enforced at render time, so the array order here does not matter.
 */
export const news: NewsItem[] = [
  {
    id: "launch",
    title: "JMC Network is live",
    date: "2026-11-06",
    category: "season",
    summary:
      "Welcome to the JMC Network. We are now hosting two Minecraft servers: " +
      "JMC NeoForge (heavily modded) and JMC Fabric (vanilla+). Grab your pick, " +
      "copy an IP, and come build with us.",
  },
];
