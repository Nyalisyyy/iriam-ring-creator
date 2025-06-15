'use client';

import { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { ShareModal } from './ShareModal';

export function RingUploader() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const handleFileChange = async (file: File | null) => {
    if (!file) return;

    if (file.type !== 'image/png') {
      setError('ファイル形式は透過PNGを選択してください。');
      return;
    }
    
    setError(null);
    setIsUploading(true);

    try {
      const response = await fetch('/api/rings/upload', {
        method: 'POST',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      if (!response.ok) {
        throw new Error('アップロードに失敗しました。');
      }

      const result = await response.json();
      setShareUrl(result.shareUrl);

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('予期せぬエラーが発生しました。');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    handleFileChange(file || null);
  };
  
  return (
    <div className="w-full max-w-md">
      <label
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="flex flex-col items-center justify-center w-full h-64 border-4 border-dashed border-white/50 rounded-2xl cursor-pointer bg-white/30 hover:bg-white/40 transition-colors"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <UploadCloud className="w-12 h-12 mb-4 text-white" />
          <p className="mb-2 text-lg text-slate-600">
            アイコンリング(PNG)をドラッグ&ドロップ
          </p>
          <p className="text-sm text-slate-500">またはクリックしてファイルを選択</p>
        </div>
        <input 
          id="dropzone-file" 
          type="file" 
          className="hidden"
          accept="image/png"
          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
          disabled={isUploading}
        />
      </label>
      
      {isUploading && (
        <div className="text-center mt-4 text-slate-600">
          アップロード中...
        </div>
      )}

      {error && (
        <div className="text-center mt-4 text-red-500 bg-white/50 p-2 rounded-lg">
          {error}
        </div>
      )}

      {shareUrl && (
        <ShareModal 
          url={shareUrl} 
          onOpenChange={() => setShareUrl(null)} 
        />
      )}
    </div>
  );
}