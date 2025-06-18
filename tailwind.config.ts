import type { Config } from "tailwindcss";
const colors = require('tailwindcss/colors');

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // 【重要】カスタムカラーをここに定義します
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      slate: colors.slate,
      red: colors.red,
      pink: colors.pink, // スライダーのホバー色で使用
      // カスタムカラー
      'pastel-blue': '#AEE2FF',
      'pastel-purple': '#E2C2FF',
      'pastel-pink': '#FFC8DD',
      'pastel-mint': '#A0E7E5',
      'brand-primary': '#B9E0FF',
      'brand-secondary': '#D4B8FF',
    },
    extend: {
      // colors以外の拡張はここに記述します
    },
  },
  plugins: [],
};
export default config;