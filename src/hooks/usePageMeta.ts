import { useEffect } from "react";
import { site } from "../config/servers";

/**
 * Set the document title for a route.
 *
 * Produces "<page> — JMC Network", or just the site name when page is empty.
 */
export function usePageMeta(page?: string) {
  useEffect(() => {
    const base = site.name;
    document.title = page ? `${page} — ${base}` : base;
  }, [page]);
}
