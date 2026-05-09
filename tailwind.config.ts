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
        background: "#FFFEFC",
        surface: "#FFFFFF",
        primary: "#E07A5F",
        secondary: "#2D6A4F",
        textMain: "#37352F",
        textMuted: "#868E96",
        warm: "#F0EBE1",
      },
      fontFamily: {
        sans: ["var(--font-pretendard)", "sans-serif"],
        quote: ["var(--font-ridibatang)", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
