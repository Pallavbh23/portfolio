import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FFFFFF",
        ink: "#0B1220",
        mist: "#F7F8FB",
        cloud: "#EEF2FF",
        indigo: { 100: "#E0E7FF", 600: "#4F46E5" },
        teal: { 500: "#14B8A6" },
        slate: { 500: "#64748B" },
      },
      boxShadow: {
        card: "0 8px 24px rgba(11,18,32,0.06)",
      },
    },
  },
  plugins: [],
} satisfies Config;
