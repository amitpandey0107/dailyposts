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
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto">
        {/* Main header */}
        <div className="px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="text-3xl font-bold text-red-700">📝</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-serif">Daily Post</h1>
              <p className="text-gray-500 text-xs">Stories & Insights</p>
            </div>
          </Link>

          {/* Right Side - Auth Controls */}
          <div className="flex items-center gap-4">
            {isLoggedIn && (
              <Link href="/dashboard" className="text-sm px-4 py-2 text-gray-700 hover:text-red-700 transition-colors hidden md:inline-block font-medium">
                📊 Dashboard
              </Link>
            )}
            
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-700 transition-colors"
                >
                  <span>👤</span>
                  <span className="text-sm font-medium">{user?.username}</span>
                  <span className="text-xs">▼</span>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-200 text-gray-900 text-sm">
                      <p className="font-semibold">{user?.username}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors md:hidden"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      📊 Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors border-t border-gray-200"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login" className="text-sm px-4 py-2 text-red-700 hover:text-red-800 transition-colors font-medium">
                🔐 Login
              </Link>
            )}
          </div>
        </div>

        {/* Navigation tabs */}
        <nav className="border-t border-gray-200 px-6 py-0 flex gap-0 flex-wrap">
          <Link
            href="/"
            className={`px-6 py-4 font-semibold transition-all border-b-2 text-sm ${
              isActive('/')
                ? 'border-red-700 text-red-700'
                : 'border-transparent text-gray-600 hover:text-red-700'
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
                    ? 'border-red-700 text-red-700'
                    : 'border-transparent text-gray-600 hover:text-red-700'
                }`}
              >
                ✨ Create Post
              </Link>
              <Link
                href="/posts/edit"
                className={`px-6 py-4 font-semibold transition-all border-b-2 text-sm ${
                  isActive('/posts/edit')
                    ? 'border-red-700 text-red-700'
                    : 'border-transparent text-gray-600 hover:text-red-700'
                }`}
              >
                ✏️ Edit Posts
              </Link>
              <Link
                href="/posts/bulk-upload"
                className={`px-6 py-4 font-semibold transition-all border-b-2 text-sm ${
                  isActive('/posts/bulk-upload')
                    ? 'border-red-700 text-red-700'
                    : 'border-transparent text-gray-600 hover:text-red-700'
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
