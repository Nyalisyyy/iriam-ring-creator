'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import { LogIn, LogOut } from 'lucide-react';

export function Header() {
  const { data: session, status } = useSession();

  // ローディング中の表示
  if (status === 'loading') {
    return (
      <header className="w-full bg-white/30 backdrop-blur-sm p-4 text-center">
        <div className="container mx-auto h-10 animate-pulse bg-slate-300/50 rounded-md"></div>
      </header>
    );
  }

  return (
    <header className="w-full bg-white/30 backdrop-blur-sm p-4 sticky top-0 z-40">
      <div className="container mx-auto flex justify-end items-center h-10">
        {session ? (
          // --- ログインしている時の表示 ---
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Image
                src={session.user?.image ?? '/default-avatar.png'}
                alt={session.user?.name ?? 'User Avatar'}
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="text-sm font-medium text-slate-700 hidden sm:block">
                {session.user?.name}
              </span>
            </div>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white/50 rounded-lg shadow-sm hover:bg-white/80 transition-colors"
            >
              <LogOut size={16} />
              ログアウト
            </button>
          </div>
        ) : (
          // --- ログインしていない時の表示 ---
          <button
            onClick={() => signIn('google')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white/50 rounded-lg shadow-sm hover:bg-white/80 transition-colors"
          >
            <LogIn size={16} />
            Googleでログイン
          </button>
        )}
      </div>
    </header>
  );
}