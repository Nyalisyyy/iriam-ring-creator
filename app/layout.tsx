import type { Metadata } from "next";
import { M_PLUS_Rounded_1c } from "next/font/google";
import "./globals.css";
import { CustomFooter } from "@/components/CustomFooter";
import { AuthProvider } from "@/components/AuthProvider";
import { Header } from "@/components/Header";

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
      {/* 【重要】bodyタグに直接フォントと背景のクラスを適用します */}
      <body className={`${roundedMplus.className} bg-gradient-to-br from-pastel-blue to-pastel-purple min-h-screen text-slate-700`}>
        <AuthProvider>
          <Header />
          {children}
          <CustomFooter />
        </AuthProvider>
      </body>
    </html>
  );
}