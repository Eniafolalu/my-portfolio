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
        background: "#0D0E15",
        foreground: "#EDEDED",
        surface: {
          DEFAULT: "#141522",
          hover: "#1C1D2F",
          border: "#24253B",
          muted: "#18192A",
        },
        navy: {
          DEFAULT: "#1A1A2E",
          card: "#141522",
          border: "#24253B",
          light: "#23233D",
        },
        orange: {
          DEFAULT: "#F97316",
          50: "#FFF7ED",
          100: "#FFEDD5",
          200: "#FED7AA",
          300: "#FDBA74",
          400: "#FB923C",
          500: "#F97316",
          600: "#EA580C",
          700: "#C2410C",
          800: "#9A3412",
          900: "#7C2D12",
          950: "#431407",
        },
        editorial: {
          50: "#FAFAFA",
          100: "#F4F4F5",
          200: "#E4E4E7",
          300: "#D4D4D8",
          400: "#A1A1AA",
          500: "#71717A",
          600: "#52525B",
          700: "#3F3F46",
          800: "#27272A",
          900: "#18181B",
          950: "#09090B",
        },
        accent: {
          DEFAULT: "#F97316",
          orange: "#F97316",
          navy: "#1A1A2E",
          highlight: "#F97316",
          subtle: "rgba(249, 115, 22, 0.12)",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-manrope)",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        display: [
          "var(--font-bricolage)",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        bricolage: [
          "var(--font-bricolage)",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        manrope: [
          "var(--font-manrope)",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        editorial: [
          "var(--font-bricolage)",
          "Playfair Display",
          "Georgia",
          "serif",
        ],
      },
      letterSpacing: {
        tighter: "-0.04em",
        tight: "-0.02em",
        wide: "0.04em",
        widest: "0.15em",
      },
      animation: {
        "marquee": "marquee 45s linear infinite",
        "marquee-reverse": "marquee-reverse 45s linear infinite",
        "fade-in": "fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
