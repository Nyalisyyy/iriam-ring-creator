// 一時的にこの最小構成のコードに置き換えてテストします

export default function CreatePage({ params }: { params: { ringId: string } }) {
  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto bg-white/30 p-8 rounded-2xl text-center">
        <h1 className="text-2xl font-bold text-slate-700">テストページ</h1>
        <p className="mt-4 text-lg">
          受け取ったリングID:
          <span className="font-bold text-xl ml-2 text-pink-500">{params.ringId}</span>
        </p>
      </div>
    </main>
  );
}