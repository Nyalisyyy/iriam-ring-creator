import type { Metadata } from "next";
import { M_PLUS_Rounded_1c } from "next/font/google";
import "./globals.css";

const roundedMplus = M_PLUS_Rounded_1c({
  weight: ['400', '700'],
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "リングドリップ - IRIAMアイコンリングメーカー",
  description: "IRIAMのアイコンリングを簡単にかさねてオリジナルアイコンを作ろう！",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={roundedMplus.className}>{children}</body>
    </html>
  );
}