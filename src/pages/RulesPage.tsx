import { Gavel } from "lucide-react";
import { ruleSections } from "../data/rules";
import { usePageMeta } from "../hooks/usePageMeta";
import { Card } from "../components/ui/Card";
import { SectionHeading } from "../components/ui/SectionHeading";

export function RulesPage() {
  usePageMeta("Rules");

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <SectionHeading
        eyebrow="House rules"
        title="Server rules"
        description="These rules apply to both JMC servers. Enforcement is kept simple and reasonable — punishments fit the situation, and you'll always get an explanation. When in doubt, ask a staff member."
      />

      <div className="mt-10 space-y-6">
        {ruleSections.map((section, i) => (
          <Card key={section.heading} className="p-6">
            <div className="flex items-center gap-3">
              <span className="grid size-8 shrink-0 place-items-center border-2 border-border-strong bg-surface-2 font-pixel text-[11px] text-moss">
                {i + 1}
              </span>
              <h2 className="font-display text-lg font-bold text-ink">
                {section.heading}
              </h2>
            </div>
            <ul className="mt-4 space-y-2.5">
              {section.rules.map((rule) => (
                <li key={rule} className="flex items-start gap-3 text-sm leading-relaxed text-ink-muted">
                  <Gavel size={15} className="mt-0.5 shrink-0 text-ink-faint" aria-hidden="true" />
                  {rule}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <p className="mt-8 text-xs text-ink-faint">
        Last reviewed: 2026-11-06. Rules may be updated as the community
        grows — check here or Discord for the latest.
      </p>
    </div>
  );
}
