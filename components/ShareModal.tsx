'use client';

import { Check, Copy } from "lucide-react";
import { useState } from "react";

// 簡易的なモーダル（ポップアップ）コンポーネント
const Dialog = ({ open, onOpenChange, children }: { open: boolean, onOpenChange: (open: boolean) => void, children: React.ReactNode }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => onOpenChange(false)}>
      <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

export function ShareModal({ url, onOpenChange }: { url: string; onOpenChange: (open: boolean) => void; }) {
  const [hasCopied, setHasCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(() => {
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000); // 2秒後に元に戻す
    });
  };

  return (
    <Dialog open={!!url} onOpenChange={onOpenChange}>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-brand-secondary">URLができました！</h2>
        <p className="text-slate-500 mt-2">
          このURLをリスナーさんにシェアして使ってもらおう！
        </p>
      </div>
      <div className="mt-6 flex items-center space-x-2">
        <input
          value={url}
          readOnly
          className="flex-grow bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 text-slate-600 focus:outline-none"
        />
        <button
          onClick={copyToClipboard}
          className="p-3 rounded-lg bg-pastel-pink text-white hover:bg-opacity-90 transition-all duration-200"
        >
          {hasCopied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
        </button>
      </div>
    </Dialog>
  );
}