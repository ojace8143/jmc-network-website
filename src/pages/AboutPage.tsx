import { Handshake, Heart, Users } from "lucide-react";
import { site } from "../config/servers";
import { usePageMeta } from "../hooks/usePageMeta";
import { Card } from "../components/ui/Card";
import { SectionHeading } from "../components/ui/SectionHeading";

const values = [
  {
    icon: Heart,
    title: "Community first",
    text: "JMC exists for the people who play. No pay-to-win, no pay-to-skip. Everyone plays on the same field.",
  },
  {
    icon: Users,
    title: "Two worlds, one home",
    text: "Whether you want a packed modpack or a clean vanilla world, there is a JMC server built for you — and both share one community.",
  },
  {
    icon: Handshake,
    title: "Fair and transparent",
    text: "Clear rules, visible moderation, and a staff team that explains its decisions. If something feels unfair, you can ask why.",
  },
];

export function AboutPage() {
  usePageMeta("About");

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <SectionHeading
        eyebrow="About"
        title={`What is ${site.name}?`}
        description={`${site.name} is the home of the Jace Minecraft Community. We run two Minecraft 1.21.1 servers — JMC NeoForge and JMC Fabric — and keep the community together on Discord.`}
      />

      <Card className="mt-10 p-6 sm:p-8">
        <h2 className="font-display text-lg font-bold text-ink">Our story</h2>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-ink-muted">
          <p>
            It started as a group of friends playing on a single server. As the
            community grew, so did the desire for two very different
            experiences: a rich, modded world for those who love tech and
            progression, and a fast, lightweight world for those who prefer
            vanilla with just a touch of extra.
          </p>
          <p>
            Rather than split the community in two, we kept it together under
            one roof. Both servers share the same people, the same Discord, and
            the same values. You can play both, or just the one that fits —
            either way, you are part of JMC.
          </p>
          <p>
            Everything is community-run and volunteer-powered. We take the time
            to keep the servers stable, the rules fair, and the atmosphere
            welcoming.
          </p>
        </div>
      </Card>

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        {values.map((v) => {
          const Icon = v.icon;
          return (
            <Card key={v.title} className="p-5">
              <span
                className="grid size-10 place-items-center border-2 border-border-strong bg-surface-2 text-moss"
                aria-hidden="true"
              >
                <Icon size={20} />
              </span>
              <h3 className="mt-4 font-display text-base font-bold text-ink">
                {v.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {v.text}
              </p>
            </Card>
          );
        })}
      </div>

      <Card className="mt-8 border-moss-deep/60 p-6">
        <h2 className="font-display text-lg font-bold text-ink">
          How to help
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          The best way to support {site.name} is to play, be a good community
          member, and invite friends. If you would like to help out — with
          moderation, building, or hosting — join the Discord and let the team
          know.
        </p>
      </Card>
    </div>
  );
}
