import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Atmosphere } from "./Atmosphere";

/**
 * Scroll to the top on every route change (respecting hash links).
 */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}

/**
 * App shell: atmospheric background, sticky header, routed content, footer.
 */
export function Layout() {
  return (
    <div className="relative min-h-screen">
      <Atmosphere />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:border-2 focus:border-moss focus:bg-surface focus:px-4 focus:py-2 focus:font-display"
      >
        Skip to content
      </a>
      <ScrollToTop />
      <Header />
      <main id="main" className="relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
