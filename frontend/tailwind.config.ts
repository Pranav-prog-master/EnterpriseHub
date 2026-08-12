/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans:    ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        mono:    ["var(--font-space-mono)", "monospace"],
        display: ["var(--font-bebas-neue)", "sans-serif"],
      },
      colors: {
        black:           "#0a0a0a",
        white:           "#f5f5f0",
        accent:          "#ff3b00",
        "accent-yellow": "#ffd600",
        "accent-blue":   "#0057ff",
        "accent-green":  "#00c853",
        border:          "#1a1a1a",
        surface:         "#111111",
        muted:           "#2a2a2a",
        "muted-fg":      "#888888",
      },
      borderWidth: { "3": "3px" },
      boxShadow: {
        "brutal":        "4px 4px 0px #f5f5f0",
        "brutal-sm":     "2px 2px 0px #f5f5f0",
        "brutal-lg":     "6px 6px 0px #f5f5f0",
        "brutal-accent": "4px 4px 0px #ff3b00",
        "brutal-blue":   "4px 4px 0px #0057ff",
        "brutal-green":  "4px 4px 0px #00c853",
        "brutal-yellow": "4px 4px 0px #ffd600",
        "brutal-dark":   "4px 4px 0px #0a0a0a",
      },
      animation: {
        "fade-in":   "fadeIn 0.2s ease-out both",
        "slide-in":  "slideIn 0.2s ease-out both",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%":   { transform: "translateX(-8px)", opacity: "0" },
          "100%": { transform: "translateX(0)",    opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
