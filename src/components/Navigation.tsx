'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 backdrop-blur-lg border-b border-blue-500/30 shadow-2xl">
      <div className="max-w-7xl mx-auto">
        {/* Main header */}
        <div className="px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg p-2 group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all">
              <span className="text-2xl font-bold text-white">📝</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Daily Post</h1>
              <p className="text-gray-400 text-xs">Stories & Insights</p>
            </div>
          </Link>
        </div>

        {/* Navigation tabs */}
        <nav className="border-t border-blue-500/20 px-6 py-0 flex gap-0 flex-wrap">
          <Link
            href="/"
            className={`px-6 py-4 font-semibold transition-all border-b-2 text-sm ${
              isActive('/')
                ? 'border-blue-400 text-blue-300 bg-blue-500/10'
                : 'border-transparent text-gray-400 hover:text-blue-300 hover:bg-blue-500/5'
            }`}
          >
            🏠 Home
          </Link>
          <Link
            href="/posts/new"
            className={`px-6 py-4 font-semibold transition-all border-b-2 text-sm ${
              isActive('/posts/new')
                ? 'border-purple-400 text-purple-300 bg-purple-500/10'
                : 'border-transparent text-gray-400 hover:text-purple-300 hover:bg-purple-500/5'
            }`}
          >
            ✨ Create Post
          </Link>
          <Link
            href="/posts/edit"
            className={`px-6 py-4 font-semibold transition-all border-b-2 text-sm ${
              isActive('/posts/edit')
                ? 'border-pink-400 text-pink-300 bg-pink-500/10'
                : 'border-transparent text-gray-400 hover:text-pink-300 hover:bg-pink-500/5'
            }`}
          >
            ✏️ Edit Posts
          </Link>
          <Link
            href="/posts/bulk-upload"
            className={`px-6 py-4 font-semibold transition-all border-b-2 text-sm ${
              isActive('/posts/bulk-upload')
                ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
                : 'border-transparent text-gray-400 hover:text-cyan-300 hover:bg-cyan-500/5'
            }`}
          >
            📤 Upload CSV
          </Link>
        </nav>
      </div>
    </header>
  );
}
