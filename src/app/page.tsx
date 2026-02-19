'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  category: string;
  created_at: string;
  thumbnail: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString.split('T')[0];
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Daily Posts</h1>
          <p className="text-gray-600 text-lg mt-2">Stay Updated with Daily Posts</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex gap-4">
          <Link
            href="/"
            className="text-gray-900 hover:text-blue-600 font-medium"
          >
            Home
          </Link>
          <Link
            href="/posts/new"
            className="text-gray-900 hover:text-blue-600 font-medium"
          >
            Create Post
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Latest Posts</h2>
          <p className="text-gray-600 mb-8">Discover the latest news, updates, and insights delivered fresh every day</p>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No posts yet</p>
              <Link
                href="/posts/new"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Create First Post
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Thumbnail */}
                    <div className="md:w-1/3 bg-gray-100 relative h-48 md:h-auto">
                      <Image
                        src={post.thumbnail}
                        alt={post.title}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.backgroundColor = '#e5e7eb';
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div className="p-6 md:w-2/3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-4 mb-3">
                          <span className="text-sm text-gray-500" suppressHydrationWarning>{formatDate(post.created_at)}</span>
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            {post.category}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600">
                          <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                        </h3>

                        <p className="text-gray-600 line-clamp-2 mb-4">{post.excerpt}</p>

                        <div className="text-sm text-gray-500">By {post.author}</div>
                      </div>

                      <Link
                        href={`/posts/${post.slug}`}
                        className="inline-block text-blue-600 hover:text-blue-800 font-medium mt-4"
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Categories Section */}
        <section className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore Categories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {['Technology', 'Governance', 'Security', 'AI & Future', 'Business', 'Media & Society'].map(
              (category) => {
                const categoryCount = posts.filter((p) => p.category === category).length;
                return (
                  <div
                    key={category}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
                  >
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{category}</h3>
                    <p className="text-gray-600 text-sm mb-4">{categoryCount} posts</p>
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                      Explore →
                    </button>
                  </div>
                );
              }
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-12">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">About</h4>
              <p className="text-gray-400 text-sm">Stay updated with the latest news, insights, and analysis.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="text-gray-400 text-sm space-y-2">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li><Link href="/posts/new" className="hover:text-white">Create Post</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Categories</h4>
              <ul className="text-gray-400 text-sm space-y-2">
                <li><a href="#" className="hover:text-white">Technology</a></li>
                <li><a href="#" className="hover:text-white">Governance</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2026 Daily Post. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
