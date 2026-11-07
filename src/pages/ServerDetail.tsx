import {
  ArrowLeft,
  Cpu,
  Gamepad2,
  Heart,
  Leaf,
  MessageSquare,
  Rocket,
  Swords,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import { getServer, site } from "../config/servers";
import { usePageMeta } from "../hooks/usePageMeta";
import { useServerStatus } from "../hooks/useServerStatus";
import { LeaderboardPanel } from "../components/server/LeaderboardPanel";
import { StatusIndicator } from "../components/server/StatusIndicator";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { CopyableIp } from "../components/ui/CopyableIp";
import { SectionHeading } from "../components/ui/SectionHeading";
import { cn } from "../lib/cn";

type Feature = {
  icon: typeof Cpu;
  title: string;
  text: string;
};

const neoFeatures: Feature[] = [
  {
    icon: Cpu,
    title: "Modded, not bloated",
    text: "A curated NeoForge pack: quality-of-life, tech, and adventure mods that work together.",
  },
  {
    icon: Rocket,
    title: "Progression",
    text: "Automated progression from starter gear to late-game tech. No pay-to-win, ever.",
  },
  {
    icon: Swords,
    title: "Adventure content",
    text: "Custom dungeons and boss encounters built into the world.",
  },
  {
    icon: Wrench,
    title: "Tuned for stability",
    text: "Mods are chosen for performance and compatibility, updated carefully.",
  },
];

const fabFeatures: Feature[] = [
  {
    icon: Zap,
    title: "Fast and light",
    text: "Fabric loads quickly and runs smooth, even on modest hardware.",
  },
  {
    icon: Leaf,
    title: "Vanilla or vanilla+",
    text: "Play pure vanilla, or opt into the small, performance-focused mod set.",
  },
  {
    icon: Gamepad2,
    title: "Community gameplay",
    text: "Community events, build competitions, and shared projects.",
  },
  {
    icon: Users,
    title: "Cozy community",
    text: "A smaller, friendlier player base focused on building together.",
  },
];

function ServerDetail({ serverId }: { serverId: "neo" | "fab" }) {
  const server = getServer(serverId);
  const { status, stale, refreshing, refresh } = useServerStatus(server);
  usePageMeta(server.name);

  const features = server.id === "neo" ? neoFeatures : fabFeatures;
  const accentText = server.accent === "forge" ? "text-forge" : "text-weave";
  const accentBadge = server.accent === "forge" ? "forge" : "weave";
  const backHref = server.id === "neo" ? "/fabric" : "/neo";
  const otherName = server.id === "neo" ? "Fabric" : "NeoForge";

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 text-xs text-ink-faint">
          <li>
            <a href="/" className="hover:text-ink">
              Home
            </a>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-ink-muted" aria-current="page">
            {server.platform}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <section className="animate-fade-up">
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone={accentBadge as "forge" | "weave"}>
            {server.modProfile === "modded" ? "Modded" : "Vanilla+"}
          </Badge>
          <Badge tone="neutral">Minecraft {server.version}</Badge>
        </div>
        <h1 className="mt-4 font-display text-4xl font-bold text-ink sm:text-5xl">
          {server.name}
        </h1>
        <p className={cn("mt-2 font-pixel text-[11px] uppercase tracking-wide", accentText)}>
          {server.platform} · {server.host}
        </p>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted">
          {server.description}
        </p>
      </section>

      {/* Connect + status */}
      <section className="mt-10 grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <h2 className="font-display text-lg font-bold text-ink">
            How to join
          </h2>
          <ol className="mt-4 space-y-3 text-sm text-ink-muted">
            <li className="flex items-start gap-3">
              <span className="grid size-6 shrink-0 place-items-center border-2 border-border-strong bg-surface-2 font-pixel text-[10px] text-moss">
                1
              </span>
              Open Minecraft {server.version} and select{" "}
              {server.modProfile === "modded"
                ? `NeoForge (${server.version})`
                : "Multiplayer"}.
            </li>
            <li className="flex items-start gap-3">
              <span className="grid size-6 shrink-0 place-items-center border-2 border-border-strong bg-surface-2 font-pixel text-[10px] text-moss">
                2
              </span>
              Add a server and paste the IP below.
            </li>
            <li className="flex items-start gap-3">
              <span className="grid size-6 shrink-0 place-items-center border-2 border-border-strong bg-surface-2 font-pixel text-[10px] text-moss">
                3
              </span>
              Join and say hi in chat. Welcome to JMC.
            </li>
          </ol>
          <div className="mt-5 flex flex-wrap items-center gap-3 border-2 border-border bg-bg/60 px-4 py-3">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-ink-faint">
              Server IP
            </span>
            <CopyableIp value={server.host} />
          </div>
        </Card>

        <Card className="flex flex-col justify-between gap-6 p-6">
          <div>
            <h2 className="font-display text-lg font-bold text-ink">Status</h2>
            <div className="mt-4">
              <StatusIndicator
                status={status}
                stale={stale}
                refreshing={refreshing}
              />
            </div>
            {status.kind === "online" && status.motd && (
              <p className="mt-3 border-l-2 border-border pl-3 text-sm italic text-ink-muted">
                {status.motd}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={refresh}
            className="self-start text-[10px] font-semibold uppercase tracking-wide text-ink-faint underline-offset-2 hover:text-ink hover:underline"
            aria-label={`Refresh ${server.name} status`}
          >
            Refresh status
          </button>
        </Card>
      </section>

      {/* Features */}
      <section className="mt-16">
        <SectionHeading
          eyebrow="What to expect"
          title={`About the ${server.platform} experience`}
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <Card key={f.title} className="p-5">
                <div
                  className={cn(
                    "grid size-10 place-items-center border-2 border-border-strong bg-surface-2",
                    accentText,
                  )}
                  aria-hidden="true"
                >
                  <Icon size={20} />
                </div>
                <h3 className="mt-4 font-display text-base font-bold text-ink">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {f.text}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Leaderboard */}
      <section className="mt-16">
        <SectionHeading eyebrow="Community" title="Leaderboard" />
        <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:items-start">
          <LeaderboardPanel server={server} />
          <Card className="p-6">
            <h3 className="flex items-center gap-2 font-display text-base font-bold text-ink">
              <Heart size={16} className="text-offline" aria-hidden="true" />
              Keep the lights on
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              JMC is a community-run project. The best way to support it is to
              play, be kind, and invite friends. If you'd like to sponsor
              hosting or hardware, reach out on Discord.
            </p>
            {site.discord.inviteUrl && (
              <div className="mt-5">
                <Button
                  href={site.discord.inviteUrl}
                  target="_blank"
                  variant="secondary"
                >
                  <MessageSquare size={16} aria-hidden="true" />
                  Contact us
                </Button>
              </div>
            )}
          </Card>
        </div>
      </section>

      {/* Cross-link */}
      <section className="mt-16 border-t-2 border-border pt-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-ink-muted">
            Want the other side of the network?
          </p>
          <div className="flex gap-3">
            <Button to={backHref} variant="secondary">
              <ArrowLeft size={16} aria-hidden="true" className="rotate-180" />
              View {otherName}
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}

export default ServerDetail;
