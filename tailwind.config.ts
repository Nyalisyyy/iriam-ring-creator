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
        'pastel-blue': '#AEE2FF',
        'pastel-purple': '#E2C2FF',
        'pastel-pink': '#FFC8DD',
        'pastel-mint': '#A0E7E5',
        'brand-primary': '#B9E0FF', // 明るいブルー系
        'brand-secondary': '#D4B8FF', // 明るいパープル系
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;