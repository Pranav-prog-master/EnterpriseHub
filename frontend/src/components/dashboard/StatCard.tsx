"use client";

import { LucideIcon } from "lucide-react";
import { clsx } from "clsx";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: "accent" | "blue" | "yellow" | "green";
  loading?: boolean;
  delta?: string;
  deltaPositive?: boolean;
}

const accentMap = {
  accent: {
    border:   "border-l-[#ff3b00]",
    icon:     "text-[#ff3b00]",
    iconBg:   "bg-[#ff3b00]/10 border-[#ff3b00]/30",
    bar:      "bg-[#ff3b00]",
    glow:     "hover:shadow-[0_0_20px_rgba(255,59,0,0.1)]",
  },
  blue: {
    border:   "border-l-[#0057ff]",
    icon:     "text-[#0057ff]",
    iconBg:   "bg-[#0057ff]/10 border-[#0057ff]/30",
    bar:      "bg-[#0057ff]",
    glow:     "hover:shadow-[0_0_20px_rgba(0,87,255,0.1)]",
  },
  yellow: {
    border:   "border-l-[#ffd600]",
    icon:     "text-[#ffd600]",
    iconBg:   "bg-[#ffd600]/10 border-[#ffd600]/30",
    bar:      "bg-[#ffd600]",
    glow:     "hover:shadow-[0_0_20px_rgba(255,214,0,0.1)]",
  },
  green: {
    border:   "border-l-[#00c853]",
    icon:     "text-[#00c853]",
    iconBg:   "bg-[#00c853]/10 border-[#00c853]/30",
    bar:      "bg-[#00c853]",
    glow:     "hover:shadow-[0_0_20px_rgba(0,200,83,0.1)]",
  },
};

export function StatCard({
  label, value, icon: Icon, accent = "accent", loading, delta, deltaPositive = true,
}: StatCardProps) {
  const s = accentMap[accent];

  return (
    <div className={clsx(
      "border-2 border-[#1e1e1e] border-l-4 bg-[#111] p-5 relative overflow-hidden",
      "transition-all duration-150",
      s.border, s.glow
    )}>
      {/* Top section: label + icon */}
      <div className="flex items-start justify-between mb-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#666]">{label}</p>
        <div className={clsx("w-8 h-8 border flex items-center justify-center shrink-0", s.iconBg)}>
          <Icon size={13} className={s.icon} />
        </div>
      </div>

      {/* Value */}
      {loading ? (
        <div className="h-12 w-24 bg-[#1e1e1e] animate-pulse" />
      ) : (
        <p className="font-display text-6xl text-white leading-none tracking-wide">
          {value}
        </p>
      )}

      {/* Delta */}
      {delta && (
        <p className={clsx(
          "font-mono text-[10px] mt-3 uppercase tracking-wider flex items-center gap-1",
          deltaPositive ? "text-[#00c853]" : "text-[#ff3b00]"
        )}>
          <span>{deltaPositive ? "↑" : "↓"}</span>
          {delta}
        </p>
      )}

      {/* Bottom accent bar */}
      <div className={clsx("absolute bottom-0 left-0 h-0.5 w-full opacity-40", s.bar)} />
    </div>
  );
}
