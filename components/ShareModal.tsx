'use client';

import { Check, Copy, X, Info } from "lucide-react";
import { useState } from "react";

const Dialog = ({ open, onOpenChange, children }: { open: boolean, onOpenChange: (open: boolean) => void, children: React.ReactNode }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl p-8 shadow-2xl w-full max-w-md mx-auto" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => onOpenChange(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X size={24} />
        </button>
        {children}
      </div>
    </div>
  )
}

// 【重要】deletionDateをpropsとして受け取る
export function ShareModal({ url, deletionDate, onOpenChange }: { url: string; deletionDate: string; onOpenChange: (open: boolean) => void; }) {
  const [hasCopied, setHasCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(() => {
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    });
  };

  // 受け取った日付文字列をフォーマットする
  const formattedDeletionDate = new Date(deletionDate).toLocaleDateString('ja-JP');

  return (
    <Dialog open={!!url} onOpenChange={onOpenChange}>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-brand-secondary">URLができました！</h2>
        <p className="text-slate-500 mt-2">
          このURLをリスナーさんにシェアして使ってもらおう！
        </p>
      </div>
      <div className="mt-6 flex items-center space-x-2">
        <input value={url} readOnly className="flex-grow bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 text-slate-600 focus:outline-none" />
        <button onClick={copyToClipboard} className="p-3 rounded-lg bg-pastel-pink text-slate-800 hover:bg-opacity-90 transition-all duration-200">
          {hasCopied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
        </button>
      </div>
      {/* 【重要】削除予定日に関する注意書きを追加 */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800">
          このアイコンリングは、セキュリティと容量確保のため、<strong className="font-bold">{formattedDeletionDate}</strong>頃に自動的に削除されます。
        </p>
      </div>
    </Dialog>
  );
}