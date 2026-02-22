'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  const handleLogout = async () => {
    await logout();
    router.push('/');
    setIsDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 backdrop-blur-lg border-b border-blue-500/30 shadow-2xl">
      <div className="max-w-7xl mx-auto">
        {/* Main header */}
        <div className="px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-blue-500 to-orange-500 rounded-lg p-2 group-hover:shadow-lg group-hover:shadow-orange-500/50 transition-all">
              <span className="text-2xl font-bold text-white">📝</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">Daily Post</h1>
              <p className="text-gray-400 text-xs">Stories & Insights</p>
            </div>
          </Link>

          {/* Right Side - Auth Controls */}
          <div className="flex items-center gap-4">
            {isLoggedIn && (
              <Link href="/dashboard" className="text-sm px-4 py-2 bg-blue-500/20 border border-blue-500/50 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors hidden md:inline-block">
                📊 Dashboard
              </Link>
            )}
            
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500/20 border border-orange-500/50 text-orange-300 rounded-lg hover:bg-orange-500/30 transition-colors"
                >
                  <span>👤</span>
                  <span className="text-sm font-semibold text-gray-300">{user?.username}</span>
                  <span className="text-xs">▼</span>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-blue-500/30 rounded-lg shadow-xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-blue-500/20 text-gray-300 text-sm">
                      <p className="font-semibold">{user?.username}</p>
                      <p className="text-xs text-gray-400">{user?.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-blue-500/20 transition-colors md:hidden"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      📊 Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-300 hover:bg-red-500/20 transition-colors border-t border-blue-500/20"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login" className="text-sm px-4 py-2 bg-blue-500/20 border border-blue-500/50 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors">
                🔐 Login
              </Link>
            )}
          </div>
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
          
          {/* Show Create/Edit/Upload only if logged in */}
          {isLoggedIn && (
            <>
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
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
