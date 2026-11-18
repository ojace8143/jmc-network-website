import { staff } from "../data/staff";
import type { StaffRole } from "../types";
import { usePageMeta } from "../hooks/usePageMeta";
import { Card } from "../components/ui/Card";
import { SectionHeading } from "../components/ui/SectionHeading";
import { cn } from "../lib/cn";

/**
 * Rank order, display copy, and accent color for each staff role.
 * The page renders members sorted by rank: owner, then moderator, then judge.
 */
const roleInfo: Record<
  StaffRole,
  { rank: number; label: string; blurb: string; accent: string }
> = {
  owner: {
    rank: 0,
    label: "Owner",
    blurb: "Runs the network — servers, rules, and community.",
    accent: "border-moss text-moss",
  },
  moderator: {
    rank: 1,
    label: "Moderator",
    blurb: "Keeps things fair and helps out in game and on Discord.",
    accent: "border-weave text-weave",
  },
  judge: {
    rank: 2,
    label: "Judge",
    blurb: "Steps in when a dispute needs a fair ruling.",
    accent: "border-forge text-forge",
  },
};

/** "Jace" -> "J", "Alex Smith" -> "AS" */
function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function StaffPage() {
  usePageMeta("Staff");

  const sorted = [...staff].sort(
    (a, b) => roleInfo[a.role].rank - roleInfo[b.role].rank,
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <SectionHeading
        eyebrow="The team"
        title="Meet the staff"
        description="The people keeping JMC Network running. If you get stuck, see something that needs a hand, or need a ruling, reach out to any of them in game or on Discord."
      />

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((member) => {
          const info = roleInfo[member.role];
          return (
            <Card key={member.name} className="flex flex-col items-start p-6">
              <span
                aria-hidden="true"
                className={cn(
                  "grid size-14 place-items-center border-2 bg-surface-2 font-pixel text-sm",
                  info.accent,
                )}
              >
                {initials(member.name)}
              </span>
              <h2 className="mt-4 font-display text-lg font-bold text-ink">
                {member.name}
              </h2>
              <span
                className={cn(
                  "mt-2 border-2 px-2 py-1 font-pixel text-[9px] uppercase tracking-wider",
                  info.accent,
                )}
              >
                {info.label}
              </span>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                {info.blurb}
              </p>
            </Card>
          );
        })}
      </div>

      <p className="mt-8 text-xs text-ink-faint">
        Want to help out? Staff roles open up from time to time — ask on
        Discord.
      </p>
    </div>
  );
}
