# JMC Network — Minecraft Community Site

A single-page site for the JMC Network, a two-server Minecraft community:

| Server | Host | Platform | Flavor |
| --- | --- | --- | --- |
| **JMC NeoForge** | `neo.orcweb.xyz` | NeoForge (1.21.1) | Heavily modded — QoL, tech, adventure |
| **JMC Fabric** | `fab.orcweb.xyz` | Fabric (1.21.1) | Vanilla / vanilla+, tuned for smooth play |

The site shows live server status, copyable IPs, a Discord community section,
news, and (when data is connected) per-server leaderboards. It never displays
fabricated statistics — when a data source is unavailable, a clearly labeled
placeholder is shown instead.

## Tech Stack

- **React 19** + **TypeScript** (strict)
- **Vite 8** with `@vitejs/plugin-react`
- **Tailwind CSS v4** (CSS-first `@theme`, no config file) via `@tailwindcss/vite`
- **React Router 7** (`BrowserRouter`)
- **lucide-react** for icons
- **clsx** for class composition
- **@fontsource** for self-hosted fonts (Inter, Space Grotesk, Press Start 2P)

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server (http://localhost:5173)
npm run dev

# Type-check + production build (outputs to dist/)
npm run build

# Preview the production build locally (http://localhost:4173)
npm run preview

# Lint
npm run lint
```

## Project Structure

```
src/
  config/servers.ts      Single source of truth: hosts, ports, versions, Java,
                         modpacks, status, Discord, canonical URL
  types/index.ts         Shared types (ServerConfig, ServerStatus, News, Leaderboard)
  lib/
    status.ts            Status provider layer (mcsrvstat / custom) + shared
                         short-TTL status cache
    paths.ts             serverRoute() — maps a server id to its /<id> route
    time.ts              Relative-time formatter ("checked 42s ago")
    clipboard.ts         Copy-to-clipboard with fallback
    cn.ts                Class-name helper (clsx)
  hooks/
    useServerStatus.ts   Polling, timeout, stale/refreshing state (cache-seeded)
    useCopyToClipboard.ts
    usePageMeta.ts       Per-page title, meta description, canonical link
    useNow.ts            Ticking "now" value for relative timestamps
  data/
    news.ts              News / announcements (static, newest-first at render)
    leaderboards.ts      Static leaderboard fallback (ships empty)
    rules.ts             Rules content (4 sections)
    staff.ts             Staff list and role descriptions
  components/
    layout/              Layout, Header, Footer, Atmosphere (backgrounds)
    ui/                  SectionHeading, Button, Card, Badge, CopyableIp,
                         Skeleton, EmptyState, ErrorBoundary
    server/              StatusIndicator, ServerCard, LeaderboardPanel
    community/           DiscordWidget
    news/                NewsItemCard
  graphics/
    og-image.svg         1200x630 Open Graph image (source of truth)
    app-icon.svg         512x512 app icon (source of truth)
  pages/
    HomePage.tsx
    NeoForgePage.tsx / FabricPage.tsx   (both render the shared detail page)
    ServerDetail.tsx            Shared server detail layout
    RulesPage.tsx / NewsPage.tsx / StaffPage.tsx / AboutPage.tsx / NotFoundPage.tsx
  App.tsx                 Router + all routes
  main.tsx                Entry point, font imports, top-level ErrorBoundary

public/
  favicon.svg            Browser tab icon
  og-image.png           Open Graph image (rendered, committed)
  icons/                 icon-192/512.png, apple-touch-icon.png (rendered, committed)
  robots.txt             Crawler rules + sitemap pointer
  sitemap.xml            All site routes

scripts/
  render-graphics.mjs    Renders the SVG sources to the committed PNGs
                         (requires ImageMagick `magick`)

.github/workflows/
  deploy.yml             Production build -> gh-pages branch
  preview.yml            Per-PR preview build -> preview/pr-<n>/
  check.yml              Lint + typecheck on PRs and pushes to main
```

## Configuration

Everything that is a *fact about the servers* lives in one file:
**`src/config/servers.ts`**. Pages and components never hardcode hosts, ports,
versions, or the Discord URL — they read from this module.

```ts
export const site = {
  name: "JMC Network",
  shortName: "JMC",
  tagline: "Two worlds. One community.",
  url: "https://ojace8143.github.io/jmc-network-website/", // canonical URL
  discord: {
    widgetUrl: "https://discord.com/widget?id=...&theme=dark", // community widget on Home
    inviteUrl: "https://discord.gg/...",                       // empty = invite buttons hidden
  },
  statusPollMs: 60_000,   // how often status is re-polled
  statusTimeoutMs: 8_000, // per-request timeout for a status check
};

export const servers: ServerConfig[] = [
  {
    id: "neo",
    name: "JMC NeoForge",
    platform: "NeoForge",
    description: "The heavily modded experience — ...",
    host: "neo.orcweb.xyz",
    port: 25565,
    version: "1.21.1",
    accent: "forge",         // identity color token
    modProfile: "modded",
    java: "Java 21",         // required runtime, shown as a badge
    modpack: {
      label: "Modpack",
      url: "",               // non-empty = download button; empty = "coming soon" box
      note: "Modpack coming soon — ...",
    },
    status: { kind: "mcsrvstat" },
  },
  { /* JMC Fabric, analogous */ },
];
```

To change a host, port, or version, edit the matching entry here. The `id`
(`"neo"` / `"fab"`) is stable — it drives routes (`/<id>`, via
`serverRoute()` in `src/lib/paths.ts`) and config lookups.

### Discord

- `site.discord.widgetUrl` — the embedded community widget shown on the Home
  page. Requires the server's widget to be enabled in Discord
  (Server Settings → Community → Widget).
- `site.discord.inviteUrl` — optional invite link. Leave it empty (`""`) and
  every invite button on the site is hidden.

## Server Status

Status is fetched by `src/lib/status.ts` and polled by
`src/hooks/useServerStatus.ts`. The default provider is the public
**mcsrvstat v3** API:

```
GET https://api.mcsrvstat.us/3/{host}
```

Response shape (normalized internally):

```json
{ "online": true, "players": { "online": 3, "max": 100 }, "version": "1.21.1",
  "motd": { "clean": "..." }, "icon": null, "hostname": "..." }
```

**Polling behavior**

- First render shows a `loading` skeleton — unless a *fresh* result is already
  in the shared status cache (see below), in which case the cached status shows
  immediately.
- Re-checks every `site.statusPollMs` (60s). Polling **pauses while the tab is
  hidden** and re-checks immediately when the tab becomes visible again.
- Each check has a `site.statusTimeoutMs` (8s) timeout.
- A manual **Refresh** button forces an immediate check.
- If the *provider* fails (network, HTTP error, bad data) but a previous check
  succeeded, the last known good status stays on screen and is flagged **stale**
  — the UI does not flash between states. A downed server (`online: false`) is a
  *definitive answer*, not an error.
- The status readout shows a small "checked Xs ago" label so viewers can tell
  how fresh the data is.

**Shared cache.** `src/lib/status.ts` keeps one short-TTL (15s) cache of
successful results, keyed by `host:port`. Components checking the same server
close together (a Home card and its server page, tab re-focus, manual refresh)
seed from the cache instead of firing duplicate provider requests. Errors and
`loading` states are never cached.

**Custom provider (self-hosted mcstatus).** To stop relying on the public API,
set a server's `status` to a `custom` provider. It must return the same
normalized shape (see above):

```ts
status: {
  kind: "custom",
  baseUrl: "https://status.jmc.example/api",
  pathTemplate: "/{host}:{port}", // {host} and {port} are substituted
},
```

The default `pathTemplate` is `"/{host}:{port}"`.

> **Note:** The public mcsrvstat API can under-report — a server may be
> reachable on its port while the API still returns `online: false`. The site
> only ever shows what the configured provider reports. If you need reliable,
> self-reported status, point the server at your own `custom` provider.

### DNS / Cloudflare note for `fab.orcweb.xyz`

`fab.orcweb.xyz` currently sits behind Cloudflare's orange-cloud (proxied) DNS
record. Minecraft uses raw TCP and cannot traverse Cloudflare's proxy, so a
proxied A record will not accept game traffic — and third-party status checkers
will report the server as offline. To make the Fabric server publicly
reachable:

1. In the Cloudflare DNS dashboard, find the record for `fab.orcweb.xyz`.
2. Disable **Proxy status** (toggle the orange cloud to a gray cloud / DNS-only).
3. Keep the record type and value pointing at the server's real IP.

`neo.orcweb.xyz` is not proxied and connects normally.

## News

News lives in **`src/data/news.ts`**. Each entry is a `NewsItem`:

```ts
{
  id: "launch",          // stable unique id (React key / anchor)
  title: "JMC Network is live",
  date: "2026-11-06",    // ISO date string
  category: "season",    // "update" | "maintenance" | "season" | "event"
  summary: "Welcome to ...",
  link: "https://..."    // optional external link for details
}
```

- The **Home** page shows the latest 3 entries.
- The **News** page shows all entries with category filter chips, synced to the
  URL (`?filter=event`). An invalid filter value falls back to `all`.
- Entries are sorted newest-first at render time, so the order in the array does
  not matter. Add a new object to the array to publish.

## Leaderboards

`src/components/server/LeaderboardPanel.tsx` resolves data in this order:

1. `server.leaderboardEndpoint` — a live JSON endpoint (if configured). Live
   fetches abort after `site.statusTimeoutMs` so a wedged endpoint can never
   hold the panel in a loading state, and successful results are kept in a
   short (30s) mount cache so quick navigation back does not refetch.
2. **`src/data/leaderboards.ts`** — static data, keyed by server `id`.
3. A clearly labeled **"Leaderboards coming soon"** placeholder.

The data shape is `LeaderboardData`:

```ts
{
  title: "Top Builders",
  unit: "blocks placed",        // optional label shown next to the value
  entries: [ { name: "ExamplePlayer", value: 123456 } ],
}
```

To connect live data, set `leaderboardEndpoint` on a server in
`src/config/servers.ts` to a URL that returns the JSON above. To seed static
data instead, fill in `src/data/leaderboards.ts` (it ships empty on purpose —
the site never invents stats). If neither source has data, the placeholder
shows.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Type-check (`tsc -b`), build the production bundle to `dist/`, then copy `dist/index.html` to `dist/404.html` (SPA deep-link fallback) |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run `oxlint` |
| `npm run render:graphics` | Re-render the SVG sources in `src/graphics/` to the committed PNGs in `public/` (needs ImageMagick `magick`) |

### Graphics

`src/graphics/og-image.svg` (1200x630) and `src/graphics/app-icon.svg` (512x512)
are the **source of truth**. The rendered PNGs (`public/og-image.png`,
`public/icons/icon-192.png`, `icon-512.png`, `apple-touch-icon.png`) are
committed, so CI and GitHub Pages never need to re-render them. To change the
artwork: edit the SVG, run `npm run render:graphics`, commit both.

## Deployment

`npm run build` produces a fully static `dist/` directory. The Vite base path
defaults to `/jmc-network-website/` and can be overridden with the `SITE_BASE`
environment variable (this is how PR previews work).

### Production (GitHub Pages)

- `deploy.yml` runs on every push to `main`: it builds and publishes `dist/`
  to the **`gh-pages` branch** via `peaceiris/actions-gh-pages`. The branch
  holds the whole build at its root and is replaced on every deploy. It is a
  pure build artifact — **never hand-commit to it**.
- The site is served at `https://ojace8143.github.io/jmc-network-website/`.
  In **Settings → Pages**, the source must be **branch `gh-pages`,
  `/ (root)`**.
- Because the build copies `index.html` → `404.html`, GitHub Pages serves the
  SPA shell for unknown paths and the router resolves deep links like `/neo`
  on refresh.
- Zero-downtime rollout: push the workflow first (the previous deploy keeps
  serving), verify the `gh-pages` branch is populated, then flip the Pages
  source to the `gh-pages` branch.

### PR previews

- `preview.yml` runs on pull requests from the main repository: it builds with
  `SITE_BASE=/jmc-network-website/preview/pr-<number>/` and publishes to
  `preview/pr-<number>/` on `gh-pages` with `keep_files: true`, so previews
  live side by side and never wipe the production build.
- The preview URL is
  `https://ojace8143.github.io/jmc-network-website/preview/pr-<number>/`.
- PRs from forks are skipped (they get a read-only token).
- Known cosmetic caveat: refreshing a deep link inside a preview falls back to
  the live site's 404 page.

### Other hosts

Any static host (nginx, Netlify, Vercel, a Minecraft community host, etc.)
works. Set the base path to match (Vite `base` / `SITE_BASE`) and configure
the host to fall back unknown paths to `index.html` so deep links like `/neo`
and `/news` resolve on refresh.
