'use client';

import React, { useState, useCallback, useRef } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { Download, Upload } from 'lucide-react';
// Next.jsのImageコンポーネントは、ここで表示するリング画像には使いません
// import Image from 'next/image'; 

interface Props {
  ringImageUrl: string;
}

export function ImageEditor({ ringImageUrl }: Props) {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
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
  
  const handleDownload = async () => {
    if (!userImage || !croppedAreaPixels) return;
    setIsProcessing(true);

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsProcessing(false);
        return;
      };
  
      // 【重要】 new Image() を new window.Image() に変更
      const ringImg = new window.Image();
      ringImg.crossOrigin = "anonymous";
      ringImg.src = ringImageUrl;
      
      // 画像の読み込みを待つ
      await new Promise((resolve, reject) => {
        ringImg.onload = resolve;
        ringImg.onerror = reject;
      });

      const finalSize = ringImg.width > 0 ? ringImg.width : 512;
      canvas.width = finalSize;
      canvas.height = finalSize;

      // 【重要】こちらも new window.Image() に変更
      const userImg = new window.Image();
      userImg.crossOrigin = "anonymous";
      userImg.src = userImage;
      
      // 画像の読み込みを待つ
      await new Promise((resolve, reject) => {
        userImg.onload = resolve;
        userImg.onerror = reject;
      });
      
      ctx.drawImage(
        userImg,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0, 0, finalSize, finalSize
      );
      ctx.drawImage(ringImg, 0, 0, finalSize, finalSize);

      const link = document.createElement('a');
      link.download = 'icon-with-ring.png';
      link.href = canvas.toDataURL('image/png');
      link.click();

    } catch (error) {
      console.error("Failed to create image", error);
      alert("画像の生成に失敗しました。");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-6 p-6 bg-white/50 rounded-2xl shadow-lg">
      <div style={{ position: 'relative', width: 300, height: 300 }} className="bg-slate-200 rounded-full overflow-hidden">
        {userImage && (
          <Cropper
            image={userImage}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            cropShape="round"
            showGrid={false}
          />
        )}
        <img 
           src={ringImageUrl} 
           alt="Icon Ring"
           crossOrigin="anonymous" 
           style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }} 
        />
         {!userImage && (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
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
            <input type="range" value={zoom} min={0.2} max={3} step={0.01} onChange={(e) => setZoom(Number(e.target.value))} className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer" disabled={!userImage} />
        </div>

        <button onClick={handleDownload} disabled={!userImage || isProcessing} className="flex items-center justify-center gap-2 w-full bg-brand-secondary text-slate-800 font-bold py-3 px-4 rounded-xl hover:bg-opacity-90 transition-all duration-200 shadow-md disabled:bg-slate-300 disabled:cursor-not-allowed">
          <Download className="w-5 h-5" />
          {isProcessing ? "作成中..." : "画像を保存"}
        </button>
      </div>
    </div>
  );
}