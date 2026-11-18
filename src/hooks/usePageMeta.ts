import { useEffect } from "react";
import { site } from "../config/servers";

/**
 * Set document metadata for a route: title, description, and canonical link.
 *
 * - Title: "<page> — JMC Network", or just the site name when page is empty.
 * - Description: when provided, overrides meta[name=description] content.
 * - Canonical: sets a <link rel="canonical"> pointing at the absolute URL
 *   of the current route (site.url plus the path below the app base).
 */
export function usePageMeta(page?: string, description?: string) {
  useEffect(() => {
    const base = site.name;
    document.title = page ? `${page} — ${base}` : base;

    if (description) {
      setMetaContent("description", description);
    }

    // Route path below the app base, e.g. "neo" for /jmc-network-website/neo.
    const baseHref = import.meta.env.BASE_URL.replace(/\/$/, "");
    const path = window.location.pathname
      .slice(baseHref.length)
      .replace(/^\/+/, "");
    const route = path ? `/${path.replace(/\/+$/, "")}` : "";
    setLinkHref("canonical", `${site.url}${route}`);
  }, [page, description]);
}

/** Get or create a <meta name> element in <head> and set its content. */
function setMetaContent(name: string, content: string) {
  let meta = document.head.querySelector<HTMLMetaElement>(
    `meta[name="${name}"]`,
  );
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = name;
    document.head.appendChild(meta);
  }
  meta.content = content;
}

/** Get or create a <link rel> element in <head> and set its href. */
function setLinkHref(rel: string, href: string) {
  let link = document.head.querySelector<HTMLLinkElement>(
    `link[rel="${rel}"]`,
  );
  if (!link) {
    link = document.createElement("link");
    link.rel = rel;
    document.head.appendChild(link);
  }
  link.href = href;
}
