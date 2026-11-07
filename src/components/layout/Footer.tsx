import { Link } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { servers, site } from "../../config/servers";

const year = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="relative z-10 border-t-2 border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        {/* Brand */}
        <div>
          <p className="font-pixel text-sm text-ink">{site.name}</p>
          <p className="mt-3 max-w-xs text-sm text-ink-muted">{site.tagline}</p>
        </div>

        {/* Servers */}
        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-wide text-ink-faint">
            Servers
          </h2>
          <ul className="mt-3 space-y-3">
            {servers.map((s) => (
              <li key={s.id}>
                <Link
                  to={s.id === "neo" ? "/neo" : "/fabric"}
                  className="group flex items-center gap-3"
                >
                  <span
                    className={
                      "size-2 shrink-0 " +
                      (s.accent === "forge" ? "bg-forge" : "bg-weave")
                    }
                    aria-hidden="true"
                  />
                  <span>
                    <span className="block text-sm font-medium text-ink group-hover:text-moss">
                      {s.platform}
                    </span>
                    <code className="font-pixel text-[10px] text-ink-faint">
                      {s.host}
                    </code>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Community */}
        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-wide text-ink-faint">
            Community
          </h2>
          <div className="mt-3 space-y-3">
            <p className="text-sm text-ink-muted">
              Hang out with the community on Discord.
            </p>
            {site.discord.inviteUrl && (
              <a
                href={site.discord.inviteUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border-2 border-border bg-surface-2 px-3 py-2 text-sm font-medium text-ink hover:border-moss"
              >
                <MessageSquare size={16} aria-hidden="true" />
                Join Discord
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {year} {site.name}. Not affiliated with Mojang or Microsoft.
          </p>
          <p>Built for the Jace Minecraft Community.</p>
        </div>
      </div>
    </footer>
  );
}
