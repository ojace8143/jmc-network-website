import { site } from "../../config/servers";

/**
 * Embedded Discord member widget (live, from the official Discord widget).
 *
 * The widget must be enabled on the server (Community -> Widget). If the
 * widget is disabled or the id is wrong, Discord renders an empty/denied
 * frame; the container keeps a fixed height so layout stays stable.
 */
export function DiscordWidget() {
  return (
    <div
      className="overflow-hidden bg-surface shadow-[4px_4px_0_0_#000]"
      role="region"
      aria-label="Discord community widget"
    >
      <iframe
        src={site.discord.widgetUrl}
        title="JMC Discord server widget"
        className="block h-[400px] w-full"
        allowTransparency
      />
    </div>
  );
}
