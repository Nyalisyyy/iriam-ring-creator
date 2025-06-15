'use client';
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'; // Shadcn/uiのDialogを想定

// Shadcn/ui を使わない場合の簡易Dialog
const SimpleDialog = ({ open, onOpenChange, children }: any) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => onOpenChange(false)}>
      <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

export function ShareModal({ url, onOpenChange }: { url: string; onOpenChange: (open: boolean) => void; }) {
  const [hasCopied, setHasCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <SimpleDialog open={!!url} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-center text-brand-secondary">URLができました！</DialogTitle>
        <DialogDescription className="text-center text-slate-500 mt-2">
          このURLをリスナーさんにシェアして使ってもらおう！
        </DialogDescription>
      </DialogHeader>
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
    </SimpleDialog>
  );
}

// Shadcn/ui用のDialogコンポーネントをcomponents/ui/dialog.tsxに作成する必要があります。
// ここでは簡易的なモーダルで代用しています。