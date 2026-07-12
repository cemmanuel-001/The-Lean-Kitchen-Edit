import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FBF7F0",
        linen: "#F3ECDF",
        ink: "#2E2A24",
        clay: "#B5602F",
        clayDark: "#94491F",
        sage: "#5C6E51",
        sageLight: "#A7B79A",
        butter: "#E7B655",
        rose: "#C97064",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-work-sans)", "Helvetica", "Arial", "sans-serif"],
      },
      maxWidth: {
        prose: "68ch",
      },
      borderRadius: {
        soft: "0.6rem",
      },
    },
  },
  plugins: [],
};

export default config;
