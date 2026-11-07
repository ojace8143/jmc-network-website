import { ArrowUpRight, CalendarDays } from "lucide-react";
import type { NewsItem } from "../../types";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";

const categoryTone: Record<
  NewsItem["category"],
  "moss" | "unknown" | "forge" | "weave"
> = {
  update: "moss",
  maintenance: "unknown",
  season: "forge",
  event: "weave",
};

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * A single news/announcement entry.
 */
export function NewsItemCard({ item }: { item: NewsItem }) {
  return (
    <Card className="flex h-full flex-col gap-3 p-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={categoryTone[item.category]}>{item.category}</Badge>
        <span className="inline-flex items-center gap-1.5 text-xs text-ink-faint">
          <CalendarDays size={13} aria-hidden="true" />
          {formatDate(item.date)}
        </span>
      </div>
      <h3 className="font-display text-base font-bold leading-snug text-ink">
        {item.link ? (
          <a
            href={item.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-start gap-1 hover:text-moss"
          >
            {item.title}
            <ArrowUpRight size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
          </a>
        ) : (
          item.title
        )}
      </h3>
      <p className="text-sm leading-relaxed text-ink-muted">{item.summary}</p>
    </Card>
  );
}
