import type { Config } from "tailwindcss";
const colors = require('tailwindcss/colors'); // この行を追加

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // extendの外にcolorsを定義します
    colors: {
      // 既存の便利なカラーも使えるように設定
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      slate: colors.slate,
      red: colors.red,
      // ここからが、あなたのカスタムカラーです
      'pastel-blue': '#AEE2FF',
      'pastel-purple': '#E2C2FF',
      'pastel-pink': '#FFC8DD',
      'pastel-mint': '#A0E7E5',
      'brand-primary': '#B9E0FF',
      'brand-secondary': '#D4B8FF',
    },
    extend: {
      // colors以外の拡張は、必要であればここに記述します
    },
  },
  plugins: [],
};
export default config;