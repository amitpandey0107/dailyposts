'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 bg-linear-to-r from-blue-600 to-purple-600 shadow-lg">
      <div className="max-w-7xl mx-auto">
        {/* Main header */}
        <div className="px-6 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-white rounded-lg p-2">
              <span className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                📝
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Daily Post</h1>
              <p className="text-blue-100 text-xs">Blog & Stories</p>
            </div>
          </Link>
        </div>

        {/* Navigation tabs */}
        <nav className="border-t border-blue-500 px-6 py-0 flex gap-0">
          <Link
            href="/"
            className={`px-6 py-4 font-medium transition-all border-b-2 ${
              isActive('/')
                ? 'border-white text-white'
                : 'border-transparent text-blue-100 hover:text-white'
            }`}
          >
            Home
          </Link>
          <Link
            href="/posts/new"
            className={`px-6 py-4 font-medium transition-all border-b-2 ${
              isActive('/posts/new')
                ? 'border-white text-white'
                : 'border-transparent text-blue-100 hover:text-white'
            }`}
          >
            Create Post
          </Link>
          <Link
            href="/posts/edit"
            className={`px-6 py-4 font-medium transition-all border-b-2 ${
              isActive('/posts/edit')
                ? 'border-white text-white'
                : 'border-transparent text-blue-100 hover:text-white'
            }`}
          >
            Edit Posts
          </Link>
          <Link
            href="/posts/bulk-upload"
            className={`px-6 py-4 font-medium transition-all border-b-2 ${
              isActive('/posts/bulk-upload')
                ? 'border-white text-white'
                : 'border-transparent text-blue-100 hover:text-white'
            }`}
          >
            Upload CSV
          </Link>
        </nav>
      </div>
    </header>
  );
}
