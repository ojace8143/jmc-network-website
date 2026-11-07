/**
 * Full-page atmospheric background: layered radial gradients, a faint pixel
 * grid, and a blocky horizon. Purely decorative (aria-hidden).
 */
export function Atmosphere() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Base wash */}
      <div className="absolute inset-0 bg-bg" />

      {/* Soft radial glows */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60rem 40rem at 15% -10%, rgba(156,192,138,0.10), transparent 60%)," +
            "radial-gradient(50rem 35rem at 110% 10%, rgba(229,176,120,0.07), transparent 60%)," +
            "radial-gradient(50rem 35rem at 90% 110%, rgba(126,212,196,0.07), transparent 60%)",
        }}
      />

      {/* Faint pixel grid, slowly drifting */}
      <div
        className="absolute inset-0 animate-drift opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(154,166,156,0.06) 1px, transparent 1px)," +
            "linear-gradient(to bottom, rgba(154,166,156,0.06) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Blocky horizon at the bottom */}
      <svg
        className="absolute inset-x-0 bottom-0 h-40 w-full"
        viewBox="0 0 1200 160"
        preserveAspectRatio="none"
      >
        <g fill="#111512">
          <rect x="0" y="120" width="1200" height="40" />
          <rect x="0" y="104" width="180" height="16" />
          <rect x="220" y="112" width="120" height="8" />
          <rect x="360" y="104" width="90" height="16" />
          <rect x="500" y="116" width="160" height="8" />
          <rect x="700" y="108" width="100" height="12" />
          <rect x="840" y="116" width="140" height="8" />
          <rect x="1020" y="108" width="120" height="12" />
        </g>
        <g fill="#171c18">
          <rect x="0" y="136" width="1200" height="24" />
          <rect x="60" y="128" width="60" height="8" />
          <rect x="300" y="130" width="80" height="6" />
          <rect x="560" y="128" width="70" height="8" />
          <rect x="760" y="130" width="90" height="6" />
          <rect x="980" y="128" width="70" height="8" />
        </g>
      </svg>

      {/* Faint floating particles */}
      <div className="absolute inset-0">
        {[
          { left: "12%", top: "30%", size: 4, delay: "0s" },
          { left: "28%", top: "62%", size: 3, delay: "6s" },
          { left: "47%", top: "22%", size: 5, delay: "3s" },
          { left: "64%", top: "70%", size: 3, delay: "9s" },
          { left: "81%", top: "40%", size: 4, delay: "12s" },
          { left: "92%", top: "58%", size: 3, delay: "5s" },
        ].map((p, i) => (
          <span
            key={i}
            className="absolute animate-pulse-dot bg-moss/40"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>
    </div>
  );
}
