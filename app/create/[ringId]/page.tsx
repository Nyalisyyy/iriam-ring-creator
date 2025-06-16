// app/create/[ringId]/page.tsx

import { getRingById } from '@/lib/actions';
import { ImageEditor } from '@/components/ImageEditor';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';

// Propsの型定義を削除し、関数の引数で直接型を指定します
export default async function CreatePage({ params }: { params: { ringId: string } }) {
  
  const ring = await getRingById(params.ringId);

  // ringが見つからない場合は404ページを表示
  if (!ring) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen items-center">
      <Header />
      <main className="container mx-auto flex flex-grow flex-col items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-white text-center mb-4">アイコンをつくろう！</h1>
          <p className="text-center text-slate-600 mb-6">
            リングに合わせたい画像をアップしてね
          </p>
          <ImageEditor ringImageUrl={ring.image_url} />
        </div>
      </main>
      <footer className="w-full text-center py-4">
        <Link href="/" className="text-white/70 hover:text-white transition-colors text-sm">
          リングを配布する方はこちら
        </Link>
      </footer>
    </div>
  );
}