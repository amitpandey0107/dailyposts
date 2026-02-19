'use client';

export default function Footer() {
  return (
    <footer className="bg-linear-to-r from-gray-900 to-gray-800 text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Daily Post</h3>
            <p className="text-gray-400">
              Your source for daily insights and stories about technology, governance, security, and more.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Categories</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition">Technology</a></li>
              <li><a href="#" className="hover:text-white transition">AI & Future</a></li>
              <li><a href="#" className="hover:text-white transition">Security</a></li>
              <li><a href="#" className="hover:text-white transition">Governance</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="/" className="hover:text-white transition">Home</a></li>
              <li><a href="/posts/new" className="hover:text-white transition">Create Post</a></li>
              <li><a href="/posts/edit" className="hover:text-white transition">Manage Posts</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2026 Daily Post. All Rights Reserved. | Built with Next.js & React</p>
        </div>
      </div>
    </footer>
  );
}
