import { Analytics } from "@vercel/analytics/next"
import { getRingById } from '@/lib/db';
import { ImageEditor } from '@/components/ImageEditor';
import { notFound } from 'next/navigation';
import Link from 'next/link';

// Next.jsの型定義
type Props = {
  params: Promise<{ ringId: string }>;
};

export default async function CreatePage({ params }: Props) {
  const ring = await getRingById((await params).ringId);

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
      <footer className="py-8 mt-auto text-center w-full">
        <Link 
          href="/" 
          className="text-slate-600 bg-white/50 hover:bg-white/80 transition-colors text-sm px-4 py-2 rounded-full"
        >
          リングを配布する方はこちら
        </Link>
      </footer>
      <Analytics />
    </main>
  );
}