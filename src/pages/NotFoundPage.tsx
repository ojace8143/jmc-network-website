import { Compass, Home } from "lucide-react";
import { usePageMeta } from "../hooks/usePageMeta";
import { Button } from "../components/ui/Button";

export function NotFoundPage() {
  usePageMeta("Page not found");

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
      <p className="font-pixel text-5xl text-moss sm:text-7xl">404</p>
      <h1 className="mt-6 font-display text-2xl font-bold text-ink sm:text-3xl">
        This chunk hasn't been loaded
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-muted sm:text-base">
        The page you are looking for does not exist — it may have been moved,
        or the address is a little off. Let's get you back to solid ground.
      </p>

      {/* Decorative block row */}
      <div
        aria-hidden="true"
        className="mt-8 flex gap-1.5"
        style={{ imageRendering: "pixelated" }}
      >
        {[
          "bg-moss",
          "bg-forge",
          "bg-weave",
          "bg-ink",
          "bg-moss",
          "bg-forge",
          "bg-weave",
        ].map((c, i) => (
          <span key={i} className={"size-3 " + c} />
        ))}
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button to="/" variant="primary">
          <Home size={16} aria-hidden="true" />
          Back to home
        </Button>
        <Button to="/news" variant="secondary">
          <Compass size={16} aria-hidden="true" />
          Browse news
        </Button>
      </div>
    </div>
  );
}
