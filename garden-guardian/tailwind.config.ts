import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        leaf: { 50: "#f3f8ee", 100: "#e5f2dc", 200: "#cfe6c0", 300: "#afd49a", 400: "#8abd70", 500: "#68a452", 600: "#4f8340", 700: "#416936", 800: "#36542f", 900: "#2f472a" },
        soil: { 50: "#faf7f2", 100: "#f1e9dd", 300: "#ceb99e", 600: "#80654c", 800: "#4b3b2f" },
      },
      boxShadow: {
        soft: "0 22px 60px rgba(55, 82, 46, 0.12)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
