import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#0a0d0a",
          secondary: "#0d110d",
          card: "#111611",
          "card-hover": "#151a15",
          elevated: "#1a1f1a",
        },
        accent: {
          DEFAULT: "#4ade80",
          dim: "#22c55e",
          glow: "rgba(74, 222, 128, 0.12)",
          "glow-strong": "rgba(74, 222, 128, 0.25)",
        },
        text: {
          primary: "#f4f4f5",
          secondary: "#a1a1aa",
          muted: "#71717a",
        },
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
      },
      boxShadow: {
        glow: "0 0 60px var(--accent-glow)",
        "glow-strong": "0 0 100px var(--accent-glow-strong)",
      },
    },
  },
  plugins: [],
};

export default config;
