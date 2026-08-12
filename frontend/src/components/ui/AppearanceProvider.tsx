"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";

export type ThemeName =
  | "dark" | "dusk" | "twilight" | "blue-hour" | "storm" | "midnight" | "aurora" | "eclipse"
  | "void" | "abyss" | "ember" | "onyx" | "ink" | "obsidian" | "graphite" | "nebula";

export interface Appearance {
  theme:     ThemeName;
  density:   "compact" | "comfortable" | "spacious";
  font_size: "small" | "medium" | "large";
}

export const THEMES: { id: ThemeName; label: string; desc: string; bg: string; surface: string; text: string; accent: string; border: string }[] = [
  { id: "dark",      label: "Dark",      desc: "Default dark mode",                  bg: "#0a0a0a", surface: "#111111", text: "#f5f5f0", accent: "#ff3b00", border: "#1e1e1e" },
  { id: "dusk",      label: "Dusk",      desc: "Soft navy fading to teal-green",    bg: "#0f1a2e", surface: "#162035", text: "#d0e8e0", accent: "#2dd4a0", border: "#1e3050" },
  { id: "twilight",  label: "Twilight",  desc: "Deep violet sky, orchid accent",    bg: "#120d1e", surface: "#1a1228", text: "#e8d8f8", accent: "#c084fc", border: "#2a1a40" },
  { id: "blue-hour", label: "Blue Hour", desc: "Cold navy with electric cyan",      bg: "#080e1a", surface: "#0d1525", text: "#c8e8ff", accent: "#00d4ff", border: "#0f2040" },
  { id: "storm",     label: "Storm",     desc: "Slate green-gray, stormy teal",     bg: "#0e1412", surface: "#141c1a", text: "#c8d8d0", accent: "#3dd68c", border: "#1e2e28" },
  { id: "midnight",  label: "Midnight",  desc: "Near-black, bright mint accent",    bg: "#050808", surface: "#0a0f0f", text: "#d0f0e8", accent: "#00ffcc", border: "#0f1e1a" },
  { id: "aurora",    label: "Aurora",    desc: "Space black, aurora green/violet",  bg: "#030508", surface: "#080c12", text: "#e0f8f0", accent: "#00ff88", border: "#0a1520" },
  { id: "eclipse",   label: "Eclipse",   desc: "Darkest mode, stark corona red",    bg: "#020202", surface: "#080808", text: "#f0e8e0", accent: "#ff2200", border: "#1a0a08" },
  { id: "void",      label: "Void",      desc: "Pure black, violet glow",           bg: "#000000", surface: "#0a0010", text: "#ede8ff", accent: "#8b5cf6", border: "#1a0a2e" },
  { id: "abyss",     label: "Abyss",     desc: "Ocean-depth teal-black, bright cyan", bg: "#010d0f", surface: "#071518", text: "#d0f5f8", accent: "#00e5ff", border: "#0a2428" },
  { id: "ember",     label: "Ember",     desc: "Warm black, glowing fire-orange",   bg: "#0d0600", surface: "#150c00", text: "#ffe8d0", accent: "#ff6a00", border: "#2a1400" },
  { id: "onyx",      label: "Onyx",      desc: "Warm near-black, burnished copper", bg: "#0c0a08", surface: "#141210", text: "#f0e8d8", accent: "#c87941", border: "#2a2018" },
  { id: "ink",       label: "Ink",       desc: "Deep indigo-black, electric blue",  bg: "#06060f", surface: "#0d0d1e", text: "#d8e0ff", accent: "#3b82f6", border: "#141430" },
  { id: "obsidian",  label: "Obsidian",  desc: "Volcanic black, polished silver",   bg: "#080808", surface: "#111111", text: "#e8e8e8", accent: "#c0c0c0", border: "#222222" },
  { id: "graphite",  label: "Graphite",  desc: "Cool gunmetal gray, steel-blue",    bg: "#0e1014", surface: "#161a20", text: "#d0d8e0", accent: "#6b8cae", border: "#222830" },
  { id: "nebula",    label: "Nebula",    desc: "Deep-space purple, magenta/violet", bg: "#0a0514", surface: "#120a20", text: "#f0d8ff", accent: "#e040fb", border: "#200a38" },
];

const DEFAULTS: Appearance = { theme: "dark", density: "comfortable", font_size: "medium" };

// Dark theme tokens — always applied on auth/landing pages via data-scope="auth" in CSS
// AppearanceProvider only applies user theme on dashboard routes
const AUTH_PATHS = ["/", "/login", "/register", "/forgot-password", "/docs"];

const AppearanceContext = createContext<{
  appearance: Appearance;
  setAppearance: (a: Appearance) => void;
}>({ appearance: DEFAULTS, setAppearance: () => {} });

function resolveTheme(theme: ThemeName): ThemeName {
  return theme;
}

function applyToDOM(a: Appearance, isDashboard: boolean) {
  const html = document.documentElement;
  const resolved = resolveTheme(a.theme);
  const t = THEMES.find((x) => x.id === resolved) ?? THEMES[0];

  if (isDashboard) {
    html.style.setProperty("--bg",      t.bg);
    html.style.setProperty("--surface", t.surface);
    html.style.setProperty("--text",    t.text);
    html.style.setProperty("--accent",  t.accent);
    html.style.setProperty("--border",  t.border);
    html.style.setProperty("--text-muted",  t.text + "88");
    html.style.setProperty("--text-subtle", t.text + "44");
    html.style.setProperty("--surface-2",   t.surface);
    html.style.setProperty("--accent-glow", t.accent + "20");
    html.setAttribute("data-theme", resolved);
  }

  // font-size and density are applied on the dashboard wrapper div via data-* attrs
  // so we store them on html only as a reference — CSS rules target [data-scope="dashboard"]
  const dash = document.querySelector<HTMLElement>("[data-scope='dashboard']");
  if (dash) {
    dash.setAttribute("data-fontsize", a.font_size);
    dash.setAttribute("data-density",  a.density);
  }
}

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const [appearance, setAppearanceState] = useState<Appearance>(DEFAULTS);
  const pathname = usePathname();

  const isDashboard = !AUTH_PATHS.some(p => pathname === p || pathname?.startsWith(p + "/"));

  useEffect(() => {
    try {
      const saved = localStorage.getItem("appearance");
      const parsed: Appearance = saved ? { ...DEFAULTS, ...JSON.parse(saved) } : DEFAULTS;
      setAppearanceState(parsed);
      if (isDashboard) applyToDOM(parsed, true);
      else applyToDOM(DEFAULTS, false);
    } catch {
      applyToDOM(DEFAULTS);
    }
  }, [isDashboard]);

  const setAppearance = useCallback((a: Appearance) => {
    setAppearanceState(a);
    localStorage.setItem("appearance", JSON.stringify(a));
    if (isDashboard) applyToDOM(a, true);
  }, [isDashboard]);

  return (
    <AppearanceContext.Provider value={{ appearance, setAppearance }}>
      {children}
    </AppearanceContext.Provider>
  );
}

export function useAppearance() {
  return useContext(AppearanceContext);
}
