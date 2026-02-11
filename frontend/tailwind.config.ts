import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fff4f2",
          100: "#ffe4df",
          200: "#ffc9bf",
          300: "#ffa194",
          400: "#ff6b52",
          500: "#f05537",
          600: "#dd3f24",
          700: "#ba2f1a",
          800: "#992a1b",
          900: "#7f281d",
          950: "#451009",
        },
        secondary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },
      },
    },
  },
  plugins: [],
};

export default config;
