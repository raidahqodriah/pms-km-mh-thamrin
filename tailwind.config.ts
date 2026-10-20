import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      colors: {
        navy: {
          50: "#eef4fb",
          100: "#d9e6f5",
          200: "#b5cdea",
          300: "#86aad8",
          400: "#4f82c0",
          500: "#2f6db0",
          600: "#1d548f",
          700: "#12406f",
          800: "#0d2f52",
          900: "#091f38",
        },
        sea: {
          50: "#e8f8f9",
          100: "#c8eef1",
          200: "#93dde3",
          400: "#33b9c4",
          500: "#0e9aa7",
          600: "#0b7f8a",
          700: "#0a6670",
        },
      },
      boxShadow: {
        soft: "0 1px 2px rgba(13,47,82,.05), 0 8px 24px -10px rgba(13,47,82,.12)",
        lift: "0 12px 32px -12px rgba(13,47,82,.35)",
      },
    },
  },
  plugins: [],
};

export default config;
