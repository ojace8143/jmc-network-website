import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/press-start-2p/400.css";
import "./index.css";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import App from "./App.tsx";

/**
 * Register the service worker (PWA: offline shell, install prompt).
 *
 * Each build ships its own copy of sw.js at its own base, so the worker is
 * always scoped to the build serving the page. One guard: the site-root
 * build must not register on pages under a preview/ path - those belong to a
 * different build (the preview's own sw.js handles them).
 */
function registerServiceWorker(): void {
  if (!("serviceWorker" in navigator) || !window.isSecureContext) return;

  const base = import.meta.env.BASE_URL;
  const previewMarker = "/preview/";
  const path = window.location.pathname;
  if (path.includes(previewMarker) && !base.includes(previewMarker)) return;

  // `base` is a root-relative path with a trailing slash, so plain
  // concatenation yields the worker's URL.
  const swUrl = `${base}sw.js`;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(swUrl).catch((err) => {
      console.warn("Service worker registration failed:", err);
    });
  });
}

registerServiceWorker();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
