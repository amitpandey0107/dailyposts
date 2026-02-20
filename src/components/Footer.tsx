'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-t from-slate-900 via-slate-900 to-transparent border-t border-blue-500/20 text-white mt-16">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg p-2">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Daily Post</h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Your source for daily insights and stories about technology, governance, security, and more. Share your voice with the world.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-purple-400">•</span> Categories
            </h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition flex items-center gap-2"><span>💻</span> Technology</a></li>
              <li><a href="#" className="hover:text-purple-400 transition flex items-center gap-2"><span>🤖</span> AI & Future</a></li>
              <li><a href="#" className="hover:text-pink-400 transition flex items-center gap-2"><span>🔒</span> Security</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition flex items-center gap-2"><span>🏛️</span> Governance</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-blue-400">•</span> Quick Links
            </h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link href="/" className="hover:text-blue-400 transition flex items-center gap-2"><span>🏠</span> Home</Link></li>
              <li><Link href="/posts/new" className="hover:text-purple-400 transition flex items-center gap-2"><span>✨</span> Create Post</Link></li>
              <li><Link href="/posts/edit" className="hover:text-pink-400 transition flex items-center gap-2"><span>✏️</span> Manage Posts</Link></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-blue-500/20 pt-8">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-4">
              &copy; 2026 Daily Post. All Rights Reserved. | Built with <span className="text-blue-400">Next.js</span> & <span className="text-purple-400">React</span>
            </p>
            <div className="flex justify-center gap-6 text-gray-500 text-xs">
              <a href="#" className="hover:text-blue-400 transition">Privacy Policy</a>
              <a href="#" className="hover:text-purple-400 transition">Terms of Service</a>
              <a href="#" className="hover:text-pink-400 transition">Contact Us</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
