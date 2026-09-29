import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          50: "#FDFBF7",
          100: "#F7F4EC",
          200: "#EFE9DC",
          300: "#E2D8C3",
          400: "#C8B896",
          500: "#AC9A73",
          600: "#B29F7F",
          700: "#8C7B5F",
          800: "#5E523F",
          900: "#2A241A",
          950: "#17140E",
        },
        sage: {
          50: "#F2F7F4",
          100: "#E2EFE7",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#68B38A",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
          950: "#03291F",
        },
        amber: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
          950: "#361B05",
        },
        charcoal: {
          50: "#F6F6F7",
          100: "#E4E4E7",
          200: "#D4D4D8",
          300: "#A1A1AA",
          400: "#71717A",
          500: "#52525B",
          600: "#3F3F46",
          700: "#27272A",
          800: "#1E1E22",
          900: "#18181B",
          950: "#121214",
        },
      },
    },
  },
  plugins: [],
};

export default config;
