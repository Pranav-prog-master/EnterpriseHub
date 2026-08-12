"use client";

interface BrutalTickerProps {
  items: string[];
  accentColor?: string;
  speed?: number;
}

export function BrutalTicker({ items, accentColor = "#ff3b00", speed = 30 }: BrutalTickerProps) {
  // Repeat 4x so the seamless loop has enough content at all viewport widths
  const track = [...items, ...items, ...items, ...items];

  const row = (cls: string, duration: number) => (
    <div className="overflow-hidden relative">
      <div
        className={cls}
        style={{ animationDuration: `${duration}s` }}
      >
        {track.map((item, i) => (
          <span
            key={i}
            className="shrink-0 flex items-center gap-3 px-6 font-mono text-[10px] uppercase tracking-[0.25em] text-[#555]"
          >
            <span style={{ color: accentColor }}>&#9670;</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="border-y-2 border-[#1e1e1e] bg-[#0d0d0d] overflow-hidden relative">
      {/* Left fade */}
      <div
        className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, #0d0d0d, transparent)" }}
      />
      {/* Right fade */}
      <div
        className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, #0d0d0d, transparent)" }}
      />

      <div className="py-2">
        {row("ticker-track", speed)}
      </div>
    </div>
  );
}
