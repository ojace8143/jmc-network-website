import { useSearchParams } from "react-router-dom";
import { Newspaper } from "lucide-react";
import { news } from "../data/news";
import { usePageMeta } from "../hooks/usePageMeta";
import { NewsItemCard } from "../components/news/NewsItemCard";
import { SectionHeading } from "../components/ui/SectionHeading";
import { EmptyState } from "../components/ui/EmptyState";
import { cn } from "../lib/cn";

const categories = ["all", "update", "maintenance", "season", "event"] as const;
type Category = (typeof categories)[number];

function isCategory(value: string | null): value is Category {
  return value !== null && (categories as readonly string[]).includes(value);
}

export function NewsPage() {
  usePageMeta("News");

  const [searchParams, setSearchParams] = useSearchParams();
  const raw = searchParams.get("filter");
  const active: Category = isCategory(raw) ? raw : "all";

  function selectFilter(next: Category) {
    if (next === "all") {
      setSearchParams({}, { replace: true });
    } else {
      setSearchParams({ filter: next }, { replace: true });
    }
  }

  const items = [...news]
    .filter((n) => active === "all" || n.category === active)
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <SectionHeading
        eyebrow="Network news"
        title="News & announcements"
        description="Updates, maintenance windows, seasons, and events across both servers. New entries land here first."
      />

      {/* Filter chips (URL-synced) */}
      <div
        role="group"
        aria-label="Filter news by category"
        className="mt-8 flex flex-wrap gap-2"
      >
        {categories.map((cat) => {
          const isActive = active === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => selectFilter(cat)}
              aria-pressed={isActive}
              className={cn(
                "border-2 px-3 py-1.5 font-pixel text-[9px] uppercase tracking-wide transition-colors",
                isActive
                  ? "border-moss-deep bg-moss-deep text-bg"
                  : "border-border bg-surface-2 text-ink-muted hover:border-moss hover:text-moss",
              )}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div className="mt-8">
        {items.length === 0 ? (
          <EmptyState
            icon={<Newspaper size={22} aria-hidden="true" />}
            title="No news in this category"
            hint="Try another filter, or check back soon."
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {items.map((item) => (
              <NewsItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
