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
  config/servers.ts      Single source of truth: hosts, ports, status, Discord
  types/index.ts         Shared types (ServerConfig, ServerStatus, News, Leaderboard)
  lib/
    status.ts            Status provider layer (mcsrvstat / custom)
    clipboard.ts         Copy-to-clipboard with fallback
    cn.ts                Class-name helper (clsx)
  hooks/
    useServerStatus.ts   Polling, timeout, stale/refreshing state
    useCopyToClipboard.ts
    usePageMeta.ts       Per-page document title + meta description
  data/
    news.ts              News / announcements (static, newest-first at render)
    leaderboards.ts      Static leaderboard fallback (ships empty)
    rules.ts             Rules content (4 sections)
  components/
    layout/              Layout, Header, Footer, Atmosphere (backgrounds)
    ui/                  SectionHeading, Button, Card, Badge, CopyableIp, Skeleton, EmptyState
    server/              StatusIndicator, ServerCard, LeaderboardPanel
    community/           DiscordWidget
    news/                NewsItemCard
  pages/
    Home.tsx
    NeoForge.tsx / Fabric.tsx   (both render the shared detail page)
    ServerDetail.tsx            Shared server detail layout
    Rules.tsx / News.tsx / About.tsx / NotFound.tsx
  App.tsx                 Router + all routes
  main.tsx                Entry point, font imports
```

## Configuration

Everything that is a *fact about the servers* lives in one file:
**`src/config/servers.ts`**. Pages and components never hardcode hosts, ports,
versions, or the Discord URL — they read from this module.

```ts
export const site = {
  name: "JMC Network",
  tagline: "Two worlds. One community.",
  discord: {
    widgetUrl: "https://discord.com/widget?id=...&theme=dark", // community widget on Home
    inviteUrl: "",                                             // empty = invite buttons hidden
  },
  statusPollMs: 60_000,   // how often status is re-polled
  statusTimeoutMs: 8_000, // per-request timeout for a status check
};

export const servers: ServerConfig[] = [
  {
    id: "neo",
    name: "JMC NeoForge",
    platform: "NeoForge",
    host: "neo.orcweb.xyz",
    port: 25565,
    version: "1.21.1",
    accent: "forge",         // identity color token
    modProfile: "modded",
    status: { kind: "mcsrvstat" },
  },
  { /* JMC Fabric, analogous */ },
];
```

To change a host, port, or version, edit the matching entry here. The `id`
(`"neo"` / `"fab"`) is stable — it drives routes and config lookups.

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

- First render shows a `loading` skeleton.
- Re-checks every `site.statusPollMs` (60s). Polling **pauses while the tab is
  hidden** and re-checks immediately when the tab becomes visible again.
- Each check has a `site.statusTimeoutMs` (8s) timeout.
- A manual **Refresh** button forces an immediate check.
- If the *provider* fails (network, HTTP error, bad data) but a previous check
  succeeded, the last known good status stays on screen and is flagged **stale**
  — the UI does not flash between states. A downed server (`online: false`) is a
  *definitive answer*, not an error.

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

1. `server.leaderboardEndpoint` — a live JSON endpoint (if configured).
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
| `npm run build` | Type-check (`tsc -b`) and build the production bundle to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run `oxlint` |

## Deployment

`npm run build` produces a fully static `dist/` directory. Any static host
(nginx, GitHub Pages, Netlify, Vercel, a Minecraft community host, etc.) works.
Because the app uses client-side routing, configure your host to fall back
unknown paths to `index.html` so deep links like `/neo` and `/news` resolve on
refresh.
