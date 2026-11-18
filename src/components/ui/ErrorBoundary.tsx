import { Component, type ReactNode } from "react";
import { site } from "../../config/servers";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  error: Error | null;
};

/**
 * Top-level error boundary.
 *
 * Catches render-time errors anywhere in the app and shows a themed
 * fallback instead of a blank screen. The site is a static SPA, so a
 * reload is the only real recovery path.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    return (
      <div className="grid min-h-screen place-items-center bg-bg px-4">
        <div className="w-full max-w-md border-2 border-border-strong bg-surface p-8 shadow-[4px_4px_0_0_#000]">
          <p className="font-pixel text-[10px] uppercase tracking-wide text-offline">
            Error
          </p>
          <h1 className="mt-4 font-display text-2xl font-bold text-ink">
            Something broke.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            {site.name} hit an unexpected error while rendering this page.
            A quick reload usually fixes it — if it keeps happening, tell us
            on Discord.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 border-2 border-border-strong bg-surface-2 px-4 py-2 text-sm font-semibold text-ink hover:border-moss"
          >
            Reload page
          </button>
        </div>
      </div>
    );
  }
}
