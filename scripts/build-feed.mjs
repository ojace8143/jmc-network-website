#!/usr/bin/env node
/**
 * Build the RSS feed into dist/feed.xml.
 *
 * Runs after `vite build` (see the build script in package.json). The news
 * and site data live in TypeScript modules, so this script bundles them with
 * Vite into a temporary ESM file and imports that - no extra TS runtime
 * dependency needed.
 */
import { build as viteBuild } from "vite";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Escape a string for safe embedding in XML content or attribute values.
 */
function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

/**
 * Convert an ISO date string (YYYY-MM-DD) to an RFC 822 / RFC 1123 date,
 * as required for RSS pubDate / lastBuildDate.
 */
function toRssDate(isoDate) {
  return new Date(`${isoDate}T00:00:00Z`).toUTCString();
}

async function loadSiteData() {
  const dir = await mkdtemp(path.join(tmpdir(), "jmc-feed-"));
  try {
    // A tiny entry that re-exports the modules the feed needs. Absolute
    // import paths keep the entry in the temp dir but rooted in the repo.
    const entry = path.join(dir, "feed-entry.ts");
    await writeFile(
      entry,
      [
        `export { site } from ${JSON.stringify(
          path.join(root, "src/config/servers.ts"),
        )};`,
        `export { news } from ${JSON.stringify(
          path.join(root, "src/data/news.ts"),
        )};`,
        "",
      ].join("\n"),
      "utf8",
    );

    const result = await viteBuild({
      configFile: false,
      root,
      logLevel: "error",
      build: {
        write: false,
        minify: false,
        emptyOutDir: false,
        lib: { entry, formats: ["es"] },
      },
    });

    // Vite returns a RollupOutput, an array of them, or undefined depending
    // on the build shape; normalize to a single list of output items.
    const outputs = Array.isArray(result) ? result : [result];
    const items = outputs.flatMap((output) => output?.output ?? []);
    const chunk = items.find((item) => item.type === "chunk");
    if (!chunk) throw new Error("Vite did not produce a chunk to import");

    const bundle = path.join(dir, "bundle.mjs");
    await writeFile(bundle, chunk.code, "utf8");
    return await import(bundle);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

async function main() {
  const { site, news } = await loadSiteData();

  const items = [...news].sort((a, b) => b.date.localeCompare(a.date));
  if (items.length === 0) {
    throw new Error("No news items found; refusing to write an empty feed");
  }

  const newsPageUrl = `${site.url}news`;
  const feedUrl = `${site.url}feed.xml`;
  const description =
    "News and announcements from the JMC Network Minecraft community.";

  const itemXml = items
    .map((item) => {
      const link = item.link ?? `${newsPageUrl}#${item.id}`;
      return `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="${item.link ? "true" : "false"}">${escapeXml(link)}</guid>
      <description>${escapeXml(item.summary)}</description>
      <category>${escapeXml(item.category)}</category>
      <pubDate>${toRssDate(item.date)}</pubDate>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.name)}</title>
    <link>${escapeXml(newsPageUrl)}</link>
    <description>${escapeXml(description)}</description>
    <language>en</language>
    <lastBuildDate>${toRssDate(items[0].date)}</lastBuildDate>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
${itemXml}
  </channel>
</rss>
`;

  await writeFile(path.join(root, "dist", "feed.xml"), xml, "utf8");
  console.log(`Wrote dist/feed.xml (${items.length} item(s))`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
