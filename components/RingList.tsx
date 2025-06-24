'use client';

import { Trash2, Share2 } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

// Ringの型定義
type Ring = {
  id: string;
  image_url: string;
  created_at: Date;
};

// 確認モーダルのコンポーネント
const ConfirmDeleteModal = ({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void; }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-lg p-6 shadow-xl text-center">
      <h3 className="text-lg font-bold text-slate-800">本当に削除しますか？</h3>
      <p className="text-sm text-slate-600 mt-2">この操作は取り消せません。</p>
      <div className="mt-6 flex gap-4">
        <button onClick={onCancel} className="flex-1 px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">
          キャンセル
        </button>
        <button onClick={onConfirm} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
          削除する
        </button>
      </div>
    </div>
  </div>
);

// 【重要】deleteActionをpropsとして受け取るように変更
export function RingList({ rings, deleteAction }: { rings: Ring[]; deleteAction: (formData: FormData) => Promise<void>; }) {
  const [showConfirm, setShowConfirm] = useState<string | null>(null);
  const [ringToDelete, setRingToDelete] = useState<FormData | null>(null);

  const handleDeleteClick = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setRingToDelete(formData);
    setShowConfirm(formData.get('ringId') as string);
  };

  const executeDelete = async () => {
    if (ringToDelete) {
      try {
        await deleteAction(ringToDelete);
      } catch (error) {
        alert(error instanceof Error ? error.message : "削除中にエラーが発生しました。");
      } finally {
        setShowConfirm(null);
        setRingToDelete(null);
      }
    }
  };

  if (rings.length === 0) {
    return <p className="text-center text-white/70 mt-4">ログイン中にアップロードしたリングはありません。</p>;
  }

  return (
    <>
      {showConfirm && <ConfirmDeleteModal onConfirm={executeDelete} onCancel={() => setShowConfirm(null)} />}
      <div className="w-full max-w-md mt-8 space-y-4">
        {rings.map((ring) => {
          const deletionDate = new Date(ring.created_at);
          deletionDate.setDate(deletionDate.getDate() + 60);
          const formattedDeletionDate = deletionDate.toLocaleDateString('ja-JP');
          const origin = typeof window !== 'undefined' ? window.location.origin : '';
          const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || origin}/create/${ring.id}`;

          return (
            <div key={ring.id} className="flex items-center justify-between p-3 bg-white/30 rounded-lg backdrop-blur-sm">
              <Image
                src={ring.image_url}
                alt="Icon Ring"
                width={64}
                height={64}
                className="w-16 h-16 rounded-full object-cover border-2 border-white"
              />
              <div className="text-right text-slate-700">
                <p className="font-bold">削除予定日</p>
                <p className="text-sm">{formattedDeletionDate}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => navigator.clipboard.writeText(shareUrl)} title="共有URLをコピー" className="p-2 bg-blue-100/50 rounded-md hover:bg-blue-200/50"><Share2 size={16} /></button>
                <form onSubmit={handleDeleteClick}>
                  <input type="hidden" name="ringId" value={ring.id} />
                  <input type="hidden" name="imageUrl" value={ring.image_url} />
                  <button type="submit" title="削除" className="p-2 bg-red-100/50 rounded-md hover:bg-red-200/50"><Trash2 size={16} className="text-red-600" /></button>
                </form>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}