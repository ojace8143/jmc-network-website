import { MessageSquare, Radio } from "lucide-react";
import { site } from "../config/servers";
import { news } from "../data/news";
import { usePageMeta } from "../hooks/usePageMeta";
import { DiscordWidget } from "../components/community/DiscordWidget";
import { NewsItemCard } from "../components/news/NewsItemCard";
import { ServerCard } from "../components/server/ServerCard";
import { Button } from "../components/ui/Button";
import { SectionHeading } from "../components/ui/SectionHeading";

export function HomePage() {
  usePageMeta();

  const latestNews = [...news]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      {/* Hero */}
      <section className="flex min-h-[52vh] flex-col justify-center py-16 sm:py-24">
        <div className="max-w-3xl animate-fade-up">
          <p className="flex items-center gap-2 font-pixel text-[10px] uppercase tracking-wider text-moss">
            <Radio size={13} aria-hidden="true" />
            {site.name}
          </p>
          <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-ink sm:text-6xl">
            Two worlds.
            <br />
            <span className="text-moss">One community.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
            The Jace Minecraft Community runs two Minecraft 1.21.1 servers — a
            heavily modded NeoForge world and a fast, light Fabric world. Pick
            your side, copy the IP, and jump in.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#servers"
              className="inline-flex items-center justify-center gap-2 border-2 border-moss-deep bg-moss-deep px-5 py-2.5 text-sm font-semibold text-bg shadow-[4px_4px_0_0_#000] transition-all hover:border-moss hover:bg-moss active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              Browse servers
            </a>
            {site.discord.inviteUrl && (
              <Button
                href={site.discord.inviteUrl}
                target="_blank"
                variant="secondary"
              >
                <MessageSquare size={16} aria-hidden="true" />
                Join Discord
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Servers */}
      <section id="servers" className="scroll-mt-24 pb-16 sm:pb-20">
        <SectionHeading
          eyebrow="Pick a world"
          title="Choose your server"
          description="Both servers run Minecraft 1.21.1. Status updates automatically every minute — the last real check is always shown, never a guess."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <ServerCard serverId="neo" />
          <ServerCard serverId="fab" />
        </div>
      </section>

      {/* Community */}
      <section className="pb-16 sm:pb-20">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionHeading
              eyebrow="Community"
              title="Hang out on Discord"
              description="Chats, coordinates, builds, and community events all happen on our Discord. The widget below shows who's online right now — come say hi."
            />
            <ul className="mt-6 space-y-3 text-sm text-ink-muted">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-2 shrink-0 bg-moss" aria-hidden="true" />
                Live voice channels for building sessions
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-2 shrink-0 bg-forge" aria-hidden="true" />
                Announcements for both servers
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-2 shrink-0 bg-weave" aria-hidden="true" />
                A place to show off your builds
              </li>
            </ul>
          </div>
          <DiscordWidget />
        </div>
      </section>

      {/* News */}
      <section className="pb-20 sm:pb-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="News" title="Latest from the network" />
          <Button to="/news" variant="ghost">
            All news
          </Button>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {latestNews.map((item) => (
            <NewsItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
