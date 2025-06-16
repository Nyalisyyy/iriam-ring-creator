import { getRingById } from '@/lib/db';
import { ImageEditor } from '@/components/ImageEditor';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { JSX } from 'react'; // JSX型をreactからインポート

// Next.jsのApp Routerで推奨される、より厳格なPropsの型定義
interface CreatePageProps {
  params: { ringId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

// asyncコンポーネントであることを踏まえ、返り値の型もPromise<JSX.Element>と明記します
export default async function CreatePage({ params }: CreatePageProps): Promise<JSX.Element> {
  // paramsからringIdを安全に取得します
  const { ringId } = params;
  const ring = await getRingById(ringId);

  // ringが見つからない場合は、404ページを表示します
  if (!ring) {
    notFound();
  }

  // データベースから取得したデータを使ってページを返します
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