'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

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
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString.split('T')[0];
    }
  };

  const featuredPost = posts.length > 0 ? posts[0] : null;
  const recentPosts = posts.slice(0, 6);
  const categories = ['Technology', 'Governance', 'Security', 'AI & Future', 'Business', 'Media & Society'];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />

      <main className="grow">
        {/* Hero Section */}
        {loading ? (
          <section className="bg-linear-to-br from-blue-600 to-purple-600 py-20">
            <div className="max-w-7xl mx-auto px-4 text-center text-white">
              <div className="animate-pulse">
                <h2 className="text-4xl font-bold mb-4">Loading...</h2>
              </div>
            </div>
          </section>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && (
              <section className="bg-linear-to-br from-blue-600 to-purple-600 text-white py-12">
                <div className="max-w-7xl mx-auto px-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Featured Image */}
                    <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                      <Image
                        src={featuredPost.thumbnail}
                        alt={featuredPost.title}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.backgroundColor = '#e5e7eb';
                        }}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent"></div>
                    </div>

                    {/* Featured Content */}
                    <div>
                      <div className="inline-block bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                        ⭐ Featured
                      </div>
                      <h2 className="text-4xl font-bold mb-4">{featuredPost.title}</h2>
                      <p className="text-blue-100 mb-6 text-lg">{featuredPost.excerpt}</p>
                      <div className="flex items-center gap-6 mb-6">
                        <span className="text-sm">By <strong>{featuredPost.author}</strong></span>
                        <span className="text-sm" suppressHydrationWarning>{formatDate(featuredPost.created_at)}</span>
                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                          {featuredPost.category}
                        </span>
                      </div>
                      <Link
                        href={`/posts/${featuredPost.slug}`}
                        className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition shadow-lg"
                      >
                        Read Full Story →
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Posts Grid */}
            <section className="max-w-7xl mx-auto px-4 py-16">
              <div className="mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-2">Latest Stories</h2>
                <p className="text-gray-600 text-lg">Discover fresh insights and perspectives</p>
              </div>

              {posts.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl">
                  <p className="text-3xl mb-4">📝</p>
                  <p className="text-gray-600 text-lg mb-6">No posts yet. Be the first to share!</p>
                  <Link
                    href="/posts/new"
                    className="inline-block bg-linear-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg transition"
                  >
                    Create First Post
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/posts/${post.slug}`}
                      className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                    >
                      {/* Card Image */}
                      <div className="relative h-48 bg-gray-100 overflow-hidden">
                        <Image
                          src={post.thumbnail}
                          alt={post.title}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.backgroundColor = '#e5e7eb';
                          }}
                        />
                        <div className="absolute top-4 right-4">
                          <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                            {post.category}
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                          <span suppressHydrationWarning>{formatDate(post.created_at)}</span>
                          <span>•</span>
                          <span>By {post.author}</span>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition">
                          {post.title}
                        </h3>

                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{post.excerpt}</p>

                        <div className="flex items-center text-blue-600 font-semibold text-sm group">
                          Read Article
                          <span className="ml-2 group-hover:translate-x-1 transition">→</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {posts.length > 6 && (
                <div className="text-center mt-12">
                  <Link
                    href="/posts/edit"
                    className="inline-block bg-gray-200 text-gray-900 px-8 py-3 rounded-lg font-bold hover:bg-gray-300 transition"
                  >
                    View All Posts
                  </Link>
                </div>
              )}
            </section>

            {/* Categories Section */}
            <section className="bg-linear-to-br from-gray-100 to-gray-50 py-16">
              <div className="max-w-7xl mx-auto px-4">
                <div className="mb-12 text-center">
                  <h2 className="text-4xl font-bold text-gray-900 mb-2">Explore Categories</h2>
                  <p className="text-gray-600 text-lg">Find stories in your areas of interest</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories.map((category) => {
                    const categoryCount = posts.filter((p) => p.category === category).length;
                    const categoryEmojis: Record<string, string> = {
                      'Technology': '💻',
                      'Governance': '🏛️',
                      'Security': '🔒',
                      'AI & Future': '🤖',
                      'Business': '📊',
                      'Media & Society': '📰',
                    };

                    return (
                      <div
                        key={category}
                        className="bg-white rounded-2xl shadow-md p-8 text-center hover:shadow-xl transition transform hover:-translate-y-1"
                      >
                        <p className="text-5xl mb-4">{categoryEmojis[category] || '📌'}</p>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{category}</h3>
                        <p className="text-gray-600 mb-6 text-lg">
                          <span className="font-bold text-blue-600">{categoryCount}</span> posts
                        </p>
                        <button className="text-blue-600 hover:text-blue-800 font-bold text-sm group flex items-center justify-center gap-2 w-full">
                          Explore
                          <span className="group-hover:translate-x-1 transition">→</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="bg-linear-to-r from-blue-600 to-purple-600 text-white py-16 mt-12">
              <div className="max-w-4xl mx-auto px-4 text-center">
                <h2 className="text-4xl font-bold mb-4">Ready to Share Your Story?</h2>
                <p className="text-blue-100 text-lg mb-8">Join our community of writers and share your insights with the world</p>
                <Link
                  href="/posts/new"
                  className="inline-block bg-white text-blue-600 px-10 py-4 rounded-lg font-bold hover:bg-gray-100 transition shadow-lg"
                >
                  ✨ Create Your Post Now
                </Link>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
