import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        lightBackground: "#f9fafb",
        lightForeground: "#1f2937",
        darkBackground: "#1e293b",
        darkForeground: "#e2e8f0",
        formBackgroundDark: "#2d3748",
        formBorderDark: "#4a5568",
        resultBackgroundDark: "#374151"
      }
    }
  },
  plugins: []
};

export default config;
