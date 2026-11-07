import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { site } from "../../config/servers";
import { cn } from "../../lib/cn";

const navItems = [
  { to: "/", label: "Home", end: true },
  { to: "/neo", label: "NeoForge" },
  { to: "/fabric", label: "Fabric" },
  { to: "/rules", label: "Rules" },
  { to: "/news", label: "News" },
  { to: "/about", label: "About" },
];

function Logo() {
  return (
    <NavLink to="/" className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className="grid size-9 place-items-center border-2 border-border-strong bg-surface-2 shadow-[3px_3px_0_0_#000]"
      >
        {/* Four-block JMC mark: brand, forge, weave, ink */}
        <span className="grid grid-cols-2 gap-[3px]">
          <span className="size-2 bg-moss" />
          <span className="size-2 bg-forge" />
          <span className="size-2 bg-weave" />
          <span className="size-2 bg-ink" />
        </span>
      </span>
      <span className="font-pixel text-sm text-ink">{site.shortName}</span>
    </NavLink>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "px-3 py-2 text-sm font-medium transition-colors",
      "border-b-2 border-transparent",
      isActive
        ? "border-moss text-ink"
        : "text-ink-muted hover:text-ink hover:border-border-strong",
    );

  return (
    <header className="sticky top-0 z-50 border-b-2 border-border bg-bg/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={linkClass}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          className="grid size-10 place-items-center border-2 border-border bg-surface text-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <X size={20} aria-hidden="true" />
          ) : (
            <Menu size={20} aria-hidden="true" />
          )}
          <span className="sr-only">Toggle navigation menu</span>
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav
          id="mobile-nav"
          aria-label="Primary mobile"
          className="border-t-2 border-border bg-surface md:hidden"
        >
          <ul className="mx-auto max-w-6xl px-4 py-2 sm:px-6">
            {navItems.map((item) => (
              <li key={item.to} className="border-b border-border last:border-0">
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "block py-3 text-sm font-medium",
                      isActive ? "text-moss" : "text-ink-muted",
                    )
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
