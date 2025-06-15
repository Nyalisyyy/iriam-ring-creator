// components/Header.tsx

import { Sparkles } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="py-4 px-6 w-full">
      <Link href="/" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
        <Sparkles className="h-7 w-7 text-pastel-pink" />
        <span className="text-xl font-bold">リングドリップ</span>
      </Link>
    </header>
  );
}