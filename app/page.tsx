import { RingUploader } from "@/components/RingUploader";
import { Sparkles } from "lucide-react";
import "./globals.css";

// メインのページコンポーネント
export default function HomePage() {
  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <Sparkles className="h-10 w-10 text-pastel-pink" />
          リングドリップ
          <Sparkles className="h-10 w-10 text-pastel-pink" />
        </h1>
        <p className="text-lg text-slate-600">
          あなただけのアイコンリングをファンに届けよう
        </p>
      </div>
      
      {/* リングアップローダーのみを表示するシンプルな構成に戻します */}
      <RingUploader />

      <footer className="py-8 mt-auto text-center w-full text-white/70 text-sm">
        <p>© 2025 Ring-Drip. All Rights Reserved.</p>
      </footer>
    </main>
  );
}