import Link from 'next/link';

export function CustomFooter() {
  return (
    <footer 
      className="
        fixed bottom-0 right-0 z-50
        rounded-tl-lg bg-white/50 p-[10px_15px]
        backdrop-blur-sm
      "
    >
      <Link 
        href="https://x.com/Nyalisyyy" 
        target="_blank" 
        rel="noopener noreferrer"
        className="
          text-sm font-bold text-slate-600 no-underline 
          transition-colors hover:text-purple-600
        "
      >
        Created by @Nyalisyyy
      </Link>
    </footer>
  );
}