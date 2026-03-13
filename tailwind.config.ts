import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: "#F5F0E8",
        driftwood: "#A89279",
        "deep-ocean": "#1B3A4B",
        "sea-glass": "#6B9F9E",
        coral: "#E07A5F",
        white: "#FFFFFF",
        shell: "#EDE5D8",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        accent: ["var(--font-accent)", "cursive"],
      },
      boxShadow: {
        warm: "0 4px 6px -1px rgba(168, 146, 121, 0.1), 0 2px 4px -1px rgba(168, 146, 121, 0.06)",
        "warm-lg": "0 10px 15px -3px rgba(168, 146, 121, 0.1), 0 4px 6px -2px rgba(168, 146, 121, 0.05)",
      },
    },
  },
  plugins: [],
};
export default config;
