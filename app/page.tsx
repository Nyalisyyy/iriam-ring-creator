import { RingUploader } from "@/components/RingUploader";
import { createClient } from "@vercel/postgres";
import { Sparkles, Trash2 } from "lucide-react";

// アップロードされたリングの型定義
type Ring = {
  id: string;
  image_url: string;
  created_at: Date;
};

// データベースからリングの一覧を取得する非同期関数
async function getRings(): Promise<Ring[]> {
  const client = createClient({ connectionString: process.env.DIRECT_DATABASE_URL });
  await client.connect();
  try {
    const result = await client.sql<Ring>`
      SELECT id, image_url, created_at FROM icon_rings ORDER BY created_at DESC
    `;
    return result.rows;
  } catch (error) {
    console.error("Failed to fetch rings:", error);
    return []; // エラー時は空の配列を返す
  } finally {
    await client.end();
  }
}

// アップロードされたリングをリスト表示するコンポーネント
function RingList({ rings }: { rings: Ring[] }) {
  if (rings.length === 0) {
    return <p className="text-center text-white/70 mt-4">まだアップロードされたリングはありません。</p>;
  }

  return (
    <div className="w-full max-w-md mt-8 space-y-4">
      {rings.map((ring) => {
        const deletionDate = new Date(ring.created_at);
        deletionDate.setDate(deletionDate.getDate() + 60);
        const formattedDeletionDate = deletionDate.toLocaleDateString('ja-JP');

        return (
          <div key={ring.id} className="flex items-center justify-between p-3 bg-white/30 rounded-lg">
            <img src={ring.image_url} alt="Icon Ring" className="w-16 h-16 rounded-full object-cover border-2 border-white" />
            <div className="text-right text-slate-700">
              <p className="font-bold">削除予定日</p>
              <p className="text-sm">{formattedDeletionDate}</p>
              <p className="text-xs text-slate-500 mt-1 flex items-center justify-end gap-1">
                <Trash2 size={12} />
                <span>60日後に自動削除</span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// メインのページコンポーネント
export default async function HomePage() {
  const rings = await getRings();

  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center p-8">
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
      
      {/* リングアップローダー */}
      <RingUploader />

      {/* アップロード済みリング一覧 */}
      <div className="w-full max-w-md mt-12">
        <h2 className="text-xl font-bold text-white text-center">配布中のリング</h2>
        <RingList rings={rings} />
      </div>

      <footer className="py-8 mt-auto text-center w-full text-white/70 text-sm">
        <p>© 2025 Ring-Drip. All Rights Reserved.</p>
      </footer>
    </main>
  );
}