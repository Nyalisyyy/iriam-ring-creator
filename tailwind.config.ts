import type { Config } from "tailwindcss";
const colors = require('tailwindcss/colors');

const config: Config = {
  // 【重要】このcontentの設定が正しいかご確認ください
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      slate: colors.slate,
      red: colors.red,
      'pastel-blue': '#AEE2FF',
      'pastel-purple': '#E2C2FF',
      'pastel-pink': '#FFC8DD',
      'pastel-mint': '#A0E7E5',
      'brand-primary': '#B9E0FF',
      'brand-secondary': '#D4B8FF',
    },
    extend: {},
  },
  plugins: [],
};
export default config;