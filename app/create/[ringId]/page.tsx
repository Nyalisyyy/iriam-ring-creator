import { getRingById } from '@/lib/db';
import { ImageEditor } from '@/components/ImageEditor';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';

// type Props = ...; の行を削除します

// 関数の引数に直接型を定義します
export default async function CreatePage({ params }: { params: { ringId: string } }) {
  const ring = await getRingById(params.ringId);

  if (!ring) {
    notFound();
  }

  return (
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