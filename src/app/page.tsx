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
  post_number?: string;
  post_index?: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  emoji: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [postsResponse, categoriesResponse] = await Promise.all([
          fetch('/api/posts'),
          fetch('/api/categories'),
        ]);

        const postsData = await postsResponse.json();
        const categoriesData = await categoriesResponse.json();

        setPosts(Array.isArray(postsData) ? postsData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setPosts([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
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

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      <Navigation />

      <main className="grow relative z-10">
        {/* Loading State */}
        {loading ? (
          <section className="py-24">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <div className="animate-pulse space-y-4">
                <div className="h-12 bg-gray-200 rounded-lg w-2/3 mx-auto"></div>
                <div className="h-16 bg-gray-200 rounded-lg w-full mx-auto"></div>
              </div>
            </div>
          </section>
        ) : (
          <>
            {/* Featured Post Section */}
            {posts.length > 0 && (
              <section className="relative py-16 md:py-24 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Featured Image */}
                    <div className="relative h-96 md:h-[500px] rounded-xl overflow-hidden shadow-lg border border-gray-300 group">
                      <Image
                        src={posts[0].thumbnail}
                        alt={posts[0].title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.backgroundColor = '#f0f0f0';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent group-hover:via-black/40 transition duration-500"></div>
                      <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                        <div>
                          <span className="inline-block bg-red-700 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg mb-3">
                            ⭐ Featured
                          </span>
                          <div className="flex gap-3 text-xs text-gray-200 font-semibold">
                            <span className="bg-black/40 px-3 py-1 rounded-full">Post #{posts[0].post_number}</span>
                            <span className="bg-black/40 px-3 py-1 rounded-full" suppressHydrationWarning>
                              🕐 {formatDateTime(posts[0].created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Featured Content */}
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight font-serif">
                          {posts[0].title}
                        </h1>
                        <p className="text-gray-700 text-lg leading-relaxed">{posts[0].excerpt}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-6 pt-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full border border-gray-300">
                          <span className="text-red-700">✍️</span>
                          <span className="text-gray-900 text-sm font-medium">{posts[0].author}</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full border border-gray-300">
                          <span className="text-red-700">📅</span>
                          <span className="text-gray-900 text-sm" suppressHydrationWarning>{formatDate(posts[0].created_at)}</span>
                        </div>
                        <div className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-semibold border border-gray-800">
                          🏷️ {posts[0].category}
                        </div>
                      </div>

                      <Link
                        href={`/posts/${posts[0].slug}`}
                        className="inline-block bg-red-700 hover:bg-red-800 text-white px-8 py-4 rounded-lg font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                      >
                        Read Full Story →
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Latest Stories Section */}
            <section className="max-w-7xl mx-auto px-4 py-20">
              <div className="mb-16">
                <h2 className="text-5xl font-bold text-gray-900 mb-4 font-serif">Latest Stories</h2>
                <p className="text-gray-700 text-xl">Discover fresh insights and perspectives</p>
              </div>

              {posts.length === 0 ? (
                <div className="text-center py-20 bg-gray-100 backdrop-blur-xl rounded-xl border border-gray-300">
                  <p className="text-5xl mb-4">📝</p>
                  <p className="text-gray-800 text-xl mb-6">No posts yet. Be the first to share your story!</p>
                  <Link
                    href="/posts/new"
                    className="inline-block bg-red-700 hover:bg-red-800 text-white px-8 py-4 rounded-lg font-bold transition"
                  >
                    Create First Post
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.slice(0, 6).map((post) => (
                    <Link
                      key={post.id}
                      href={`/posts/${post.slug}`}
                      className="group bg-white rounded-xl border border-gray-200 hover:border-red-700 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      {/* Card Image */}
                      <div className="relative h-48 bg-gray-300 overflow-hidden">
                        <Image
                          src={post.thumbnail}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.backgroundColor = '#e5e7eb';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                        <div className="absolute top-4 right-4">
                          <span className="bg-red-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                            {post.category}
                          </span>
                        </div>
                        <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-2">
                          <div className="flex gap-2 text-xs">
                            <span className="bg-black/60 text-white px-2 py-1 rounded font-bold">#{post.post_number}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3 text-xs text-gray-600">
                          <span suppressHydrationWarning>{formatDate(post.created_at)}</span>
                          <span>•</span>
                          <span>{post.author}</span>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-700 transition">
                          {post.title}
                        </h3>

                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{post.excerpt}</p>

                        <div className="flex items-center text-red-700 font-semibold text-sm group/link">
                          Read Article
                          <span className="ml-2 group-hover/link:translate-x-1 transition">→</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {posts.length > 6 && (
                <div className="text-center mt-16">
                  <Link
                    href="/posts/edit"
                    className="inline-block bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-lg font-bold transition border border-gray-800 hover:border-red-700"
                  >
                    View All Posts
                  </Link>
                </div>
              )}
            </section>

            {/* Categories Section */}
            <section className="bg-gray-100 py-20 border-y border-gray-300">
              <div className="max-w-7xl mx-auto px-4">
                <div className="mb-16 text-center">
                  <h2 className="text-5xl font-bold text-gray-900 mb-4 font-serif">Explore Categories</h2>
                  <p className="text-gray-700 text-xl">Find stories in your areas of interest</p>
                </div>

                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-pulse space-y-4">
                      <div className="h-20 bg-gray-300 rounded-lg w-full mx-auto"></div>
                    </div>
                  </div>
                ) : categories.length === 0 ? (
                  <div className="text-center py-12 text-gray-600">
                    <p className="text-lg">No categories available yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => {
                      const categoryCount = posts.filter((p) => p.category === category.name).length;

                      return (
                        <Link
                          key={category.id}
                          href={`/posts/category/${category.slug}`}
                          className="group bg-white rounded-xl border border-gray-300 p-8 text-center hover:border-red-700 hover:bg-red-50 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
                        >
                          <p className="text-6xl mb-4 group-hover:scale-125 transition-transform duration-300">
                            {category.emoji || '📌'}
                          </p>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2 font-serif">{category.name}</h3>
                          <p className="text-gray-700 mb-6 text-lg">
                            <span className="font-bold text-red-700">{categoryCount}</span> posts
                          </p>
                          <div className="text-red-700 hover:text-red-800 font-bold text-sm group/btn flex items-center justify-center gap-2 w-full transition">
                            Explore
                            <span className="group-hover/btn:translate-x-1 transition">→</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gray-900 text-white py-20 my-12 mx-4 md:mx-12 rounded-2xl border border-gray-800">
              <div className="max-w-4xl mx-auto px-4 text-center">
                <h2 className="text-5xl font-bold mb-4 text-white font-serif">
                  Ready to Share Your Story?
                </h2>
                <p className="text-gray-400 text-xl mb-8">
                  Join our community of writers and share your insights with the world
                </p>
                <Link
                  href="/posts/new"
                  className="inline-block bg-red-700 hover:bg-red-800 text-white px-10 py-4 rounded-lg font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
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
