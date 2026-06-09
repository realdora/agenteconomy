import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  darkMode: ["class", ".theme-dark"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
        display: ["var(--font-denton)", "var(--font-geist-sans)", "sans-serif"],
      },
      // Design tokens (were provided by the prebuilt template CSS; now owned here so the
      // project's own Tailwind generates text-fg-default / bg-bg-default / etc.)
      colors: {
        "fg-default": "hsl(var(--fg-default))",
        "fg-secondary": "hsl(var(--fg-secondary))",
        "bg-default": "hsl(var(--bg-default))",
        "border-default": "var(--border-default)",
      },
    },
  },
  plugins: [],
};

export default config;
