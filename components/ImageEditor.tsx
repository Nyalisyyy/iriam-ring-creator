'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import { Save, Upload, X, DownloadCloud } from 'lucide-react';

// 完成した画像を表示するためのポップアップ（モーダル）コンポーネント
const ResultModal = ({ imageUrl, onClose }: { imageUrl: string; onClose: () => void; }) => {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl p-6 shadow-2xl w-full max-w-md mx-auto text-center">
        <button onClick={onClose} className="absolute -top-4 -right-2 bg-slate-600 text-white rounded-full p-1 shadow-lg">
          <X size={24} />
        </button>
        <h3 className="text-lg font-bold text-slate-800 mb-4">画像が完成しました！</h3>
        <p className="text-sm text-slate-600 mb-4">画像を長押しして保存してください</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt="完成したアイコンリング" className="w-full max-w-[300px] mx-auto rounded-full border-4 border-white shadow-md" />
        <button onClick={onClose} className="mt-6 w-full bg-brand-secondary text-slate-800 font-bold py-3 px-4 rounded-xl hover:bg-opacity-90 transition-all duration-200 shadow-md">
          閉じる
        </button>
      </div>
    </div>
  );
};


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
  const [currentRingUrl, setCurrentRingUrl] = useState(ringImageUrl);
  const [hasError, setHasError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentRingUrl(ringImageUrl);
    setHasError(false);
  }, [ringImageUrl]);

  const handleImageError = () => {
    if (hasError) return; // 無限ループを防ぐ

    try {
      setHasError(true); // エラーが発生したことを記録
      const url = new URL(currentRingUrl);
      const filename = url.pathname.split('/').pop() || '';
      const decodedFilename = decodeURIComponent(filename);
      
      if (filename === decodedFilename) {
        // 元が日本語などの場合、エンコードしたURLを試す
        const newUrl = `${url.origin}/${encodeURIComponent(filename)}`;
        setCurrentRingUrl(newUrl);
      }
    } catch (e) {
      console.error("Invalid URL:", e);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setUserImage(reader.result as string));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);
  
  const handleSave = async () => {
    if (!userImage || !croppedAreaPixels) return;
    setIsProcessing(true);

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsProcessing(false);
        return;
      };
  
      const ringImg = new window.Image();
      ringImg.crossOrigin = "anonymous";
      ringImg.src = currentRingUrl;
      
      await new Promise<void>((resolve, reject) => {
        ringImg.onload = () => resolve();
        ringImg.onerror = reject;
      });

      const finalSize = ringImg.width > 0 ? ringImg.width : 512;
      canvas.width = finalSize;
      canvas.height = finalSize;
      
      if (!isTransparent) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, finalSize, finalSize);
      }

      const userImg = new window.Image();
      userImg.crossOrigin = "anonymous";
      userImg.src = userImage;
      
      await new Promise<void>((resolve, reject) => {
        userImg.onload = () => resolve();
        userImg.onerror = reject;
      });
      
      ctx.drawImage(userImg, croppedAreaPixels.x, croppedAreaPixels.y, croppedAreaPixels.width, croppedAreaPixels.height, 0, 0, finalSize, finalSize);
      ctx.drawImage(ringImg, 0, 0, finalSize, finalSize);

      setFinalImage(canvas.toDataURL('image/png'));

    } catch (error) {
      console.error("Failed to create image", error);
      alert("画像の生成に失敗しました。");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRingOnlyDownload = async () => {
    setIsRingDownloading(true);
    try {
      const response = await fetch(currentRingUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'icon-ring.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download ring image", error);
      alert("リング画像のダウンロードに失敗しました。");
    } finally {
      setIsRingDownloading(false);
    }
  };

  return (
    <>
      {finalImage && <ResultModal imageUrl={finalImage} onClose={() => setFinalImage(null)} />}

      <div className="w-full flex flex-col items-center gap-6 p-4 sm:p-6 bg-white/50 rounded-2xl shadow-lg">
        <div className="relative w-full max-w-[300px] aspect-square bg-slate-200 rounded-full overflow-hidden">
          {userImage && (
            <Cropper image={userImage} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete} cropShape="round" showGrid={false} restrictPosition={false} />
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={currentRingUrl} alt="Icon Ring" crossOrigin="anonymous" className="absolute top-0 left-0 w-full h-full pointer-events-none z-10" onError={handleImageError} />
          {!userImage && (
            <div className="w-full h-full flex items-center justify-center text-slate-400 p-4 text-center">
              ここに画像が表示されます
            </div>
          )}
        </div>

        <div className="w-full max-w-xs flex flex-col gap-4">
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center gap-2 w-full bg-pastel-pink text-slate-800 font-bold py-3 px-4 rounded-xl hover:bg-opacity-90 transition-all duration-200 shadow-md">
            <Upload className="w-5 h-5" />
            画像をえらぶ
          </button>
          <input type="file" ref={fileInputRef} onChange={onFileChange} accept="image/*" className="hidden" />

          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">大きさ</span>
            <input type="range" value={zoom} min={0.2} max={3} step={0.01} onChange={(e) => setZoom(Number(e.target.value))} className="custom-range" disabled={!userImage} />
          </div>
          
          <div className="flex items-center justify-center gap-2">
            <input type="checkbox" id="transparent-bg" checked={isTransparent} onChange={(e) => setIsTransparent(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-pastel-pink focus:ring-pink-400" />
            <label htmlFor="transparent-bg" className="text-sm text-slate-600">
              背景を透過する
            </label>
          </div>

          <button onClick={handleSave} disabled={!userImage || isProcessing} className="flex items-center justify-center gap-2 w-full bg-brand-secondary text-slate-800 font-bold py-3 px-4 rounded-xl hover:bg-opacity-90 transition-all duration-200 shadow-md disabled:bg-slate-300 disabled:cursor-not-allowed">
            <Save className="w-5 h-5" />
            {isProcessing ? "作成中..." : "画像を保存"}
          </button>
          
          <button onClick={handleRingOnlyDownload} disabled={isRingDownloading} className="flex items-center justify-center gap-2 w-full bg-white text-slate-700 border border-slate-300 font-bold py-3 px-4 rounded-xl hover:bg-slate-50 transition-all duration-200 shadow-sm disabled:bg-slate-200">
            <DownloadCloud className="w-5 h-5" />
            {isRingDownloading ? "準備中..." : "リングのみ保存"}
          </button>
        </div>
      </div>
    </>
  );
}
