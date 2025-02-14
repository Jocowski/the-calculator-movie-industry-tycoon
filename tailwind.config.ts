import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // Inicia o suporte ao modo escuro baseado em classes
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        lightBackground: "#f9fafb", // Fundo claro
        lightForeground: "#1f2937", // Texto no tema claro (cinza escuro)
        darkBackground: "#1e293b",  // Fundo escuro (azul escuro)
        darkForeground: "#e2e8f0",  // Texto no tema escuro (cinza claro)
        formBackgroundDark: "#2d3748", // Fundo de formulário no modo escuro
        formBorderDark: "#4a5568",    // Bordas no modo escuro
        resultBackgroundDark: "#374151", // Fundo do resultado no modo escuro
      },
    },
  },
  plugins: [],
};

export default config;