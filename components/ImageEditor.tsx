'use client';

import React, { useState, useCallback, useRef } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { Save, Upload, X } from 'lucide-react';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      ringImg.src = ringImageUrl;
      
      await new Promise<void>((resolve, reject) => {
        ringImg.onload = () => resolve();
        ringImg.onerror = reject;
      });

      const finalSize = ringImg.width > 0 ? ringImg.width : 512;
      canvas.width = finalSize;
      canvas.height = finalSize;

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

  return (
    <>
      {finalImage && <ResultModal imageUrl={finalImage} onClose={() => setFinalImage(null)} />}

      <div className="w-full flex flex-col items-center gap-6 p-4 sm:p-6 bg-white/50 rounded-2xl shadow-lg">
        <div className="relative w-full max-w-[300px] aspect-square bg-slate-200 rounded-full overflow-hidden">
          {userImage && (
            <Cropper image={userImage} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete} cropShape="round" showGrid={false} />
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ringImageUrl} alt="Icon Ring" crossOrigin="anonymous" className="absolute top-0 left-0 w-full h-full pointer-events-none z-10" />
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
              {/* 【重要】classNameを "custom-range" に変更 */}
              <input type="range" value={zoom} min={0.2} max={3} step={0.01} onChange={(e) => setZoom(Number(e.target.value))} className="custom-range" disabled={!userImage} />
          </div>

          <button onClick={handleSave} disabled={!userImage || isProcessing} className="flex items-center justify-center gap-2 w-full bg-brand-secondary text-slate-800 font-bold py-3 px-4 rounded-xl hover:bg-opacity-90 transition-all duration-200 shadow-md disabled:bg-slate-300 disabled:cursor-not-allowed">
            <Save className="w-5 h-5" />
            {isProcessing ? "作成中..." : "画像を保存"}
          </button>
        </div>
      </div>
    </>
  );
}