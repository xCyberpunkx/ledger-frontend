import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14121F",
        muted: "#65627A",
        surface: "#FFFFFF",
        "surface-soft": "#F8F7FC",
        border: "#E7E4F3",
        primary: "#6D5EF8",
        "primary-dark": "#5645E0",
        pink: "#FF6B9C",
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
