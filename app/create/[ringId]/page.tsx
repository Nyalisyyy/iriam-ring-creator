import { getRingById } from '@/lib/db';
import { ImageEditor } from '@/components/ImageEditor';
import { notFound } from 'next/navigation';
import Link from 'next/link';

type Props = {
  params: { ringId: string };
};

export default async function CreatePage({ params }: Props) {
  const ring = await getRingById(params.ringId);

  if (!ring) {
    notFound();
  }

  return (
    // 【重要】トップページと同様の、中央揃えのレイアウトを追加しました
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-white text-center mb-4">アイコンをつくろう！</h1>
        <p className="text-center text-slate-600 mb-6">
          リングに合わせたい画像をアップしてね
        </p>
        <ImageEditor ringImageUrl={ring.image_url} />
      </div>
      <footer className="absolute bottom-4 text-center w-full">
        <Link href="/" className="text-white/70 hover:text-white transition-colors text-sm">
          リングを配布する方はこちら
        </Link>
      </footer>
    </main>
  );
}