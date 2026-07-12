import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1C1A17",
        paper: "#F6F2E9",
        "paper-dim": "#EDE6D3",
        moss: "#3F5B4E",
        "moss-dark": "#2C4239",
        gold: "#B98B3E",
        muted: "#726B5E",
        border: "#E1D8C2",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      // A single deliberate scale, not ad-hoc text-2xl/text-3xl calls
      // scattered per component. "display" sizes are for Fraunces
      // headlines only; body copy stays on the default Tailwind scale.
      fontSize: {
        "display-sm": ["1.75rem", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
        "display-md": ["2.75rem", { lineHeight: "1.1", letterSpacing: "-0.015em" }],
        "display-lg": ["3.5rem", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-xl": ["4.5rem", { lineHeight: "1.02", letterSpacing: "-0.02em" }],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      // Warm, low-contrast shadows built from the ink color rather than
      // default Tailwind gray/black — a shadow tinted toward the brand
      // reads as "designed" instead of "browser default."
      boxShadow: {
        soft: "0 1px 2px 0 rgb(28 26 23 / 0.04), 0 1px 1px 0 rgb(28 26 23 / 0.03)",
        card: "0 2px 8px -2px rgb(28 26 23 / 0.06), 0 1px 2px -1px rgb(28 26 23 / 0.04)",
        lifted: "0 12px 32px -8px rgb(28 26 23 / 0.12), 0 4px 12px -4px rgb(28 26 23 / 0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
