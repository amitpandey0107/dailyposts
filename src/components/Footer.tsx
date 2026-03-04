'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative bg-gray-900 text-gray-100 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl font-bold text-red-700">📝</div>
              <h3 className="text-xl font-bold text-white font-serif">Daily Post</h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Your source for daily insights and stories about technology, governance, security, and more. Share your voice with the world.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2 font-serif">
              <span className="text-red-700">•</span> Categories
            </h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-red-700 transition flex items-center gap-2"><span>💻</span> Technology</a></li>
              <li><a href="#" className="hover:text-red-700 transition flex items-center gap-2"><span>🤖</span> AI & Future</a></li>
              <li><a href="#" className="hover:text-red-700 transition flex items-center gap-2"><span>🔒</span> Security</a></li>
              <li><a href="#" className="hover:text-red-700 transition flex items-center gap-2"><span>🏛️</span> Governance</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2 font-serif">
              <span className="text-red-700">•</span> Quick Links
            </h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link href="/" className="hover:text-red-700 transition flex items-center gap-2"><span>🏠</span> Home</Link></li>
              <li><Link href="/posts/new" className="hover:text-red-700 transition flex items-center gap-2"><span>✨</span> Create Post</Link></li>
              <li><Link href="/posts/edit" className="hover:text-red-700 transition flex items-center gap-2"><span>✏️</span> Manage Posts</Link></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-4">
              &copy; 2026 Daily Post. All Rights Reserved. | Built with <span className="text-red-700 font-semibold">Next.js</span> & <span className="text-red-700 font-semibold">React</span>
            </p>
            <div className="flex justify-center gap-6 text-gray-500 text-xs">
              <a href="#" className="hover:text-red-700 transition">Privacy Policy</a>
              <a href="#" className="hover:text-red-700 transition">Terms of Service</a>
              <a href="#" className="hover:text-red-700 transition">Contact Us</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
