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
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
export default config;
