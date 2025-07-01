'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { Save, Upload, X, DownloadCloud } from 'lucide-react';

// ... (ResultModalコンポーネントは変更ありません) ...

interface Props {
  ringImageUrl: string;
}

export function ImageEditor({ ringImageUrl }: Props) {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [isTransparent, setIsTransparent] = useState(true);
  const [isRingDownloading, setIsRingDownloading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 【重要】リング画像のURLをstateで管理
  const [currentRingUrl, setCurrentRingUrl] = useState(ringImageUrl);

  // 【重要】画像の読み込みに失敗した時の処理
  const handleImageError = () => {
    try {
      const url = new URL(currentRingUrl);
      const filename = url.pathname.split('/').pop() || '';
      // デコードしてみて、元の文字列と変わるか（エンコードされていたか）をチェック
      const decodedFilename = decodeURIComponent(filename);
      if (filename !== decodedFilename) {
        // 元がエンコードされていた場合、何もしない（エラーが解決しないため）
        return;
      }
      // 元が日本語などの場合、エンコードしたURLを試す
      const newUrl = `${url.origin}/${encodeURIComponent(filename)}`;
      setCurrentRingUrl(newUrl);
    } catch (e) {
      console.error("Invalid URL:", e);
    }
  };

  // ringImageUrlが変更されたら、stateをリセット
  useEffect(() => {
    setCurrentRingUrl(ringImageUrl);
  }, [ringImageUrl]);


  // ... (onFileChange, onCropComplete, handleSave, handleRingOnlyDownload の各関数は変更ありません) ...

  return (
    <>
      {/* ... (ResultModalは変更ありません) ... */}

      <div className="w-full flex flex-col items-center gap-6 p-4 sm:p-6 bg-white/50 rounded-2xl shadow-lg">
        <div className="relative w-full max-w-[300px] aspect-square bg-slate-200 rounded-full overflow-hidden">
          {userImage && (
            <Cropper image={userImage} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete} cropShape="round" showGrid={false} restrictPosition={false} />
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentRingUrl} // stateからURLを読み込む
            alt="Icon Ring"
            crossOrigin="anonymous"
            className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
            onError={handleImageError} // 読み込み失敗時にフォールバック処理を呼ぶ
          />
          {!userImage && (
            <div className="w-full h-full flex items-center justify-center text-slate-400 p-4 text-center">
              ここに画像が表示されます
            </div>
          )}
        </div>

        <div className="w-full max-w-xs flex flex-col gap-4">
          {/* ... (ボタンやスライダーは変更ありません) ... */}
        </div>
      </div>
    </>
  );
}
