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
    const fetchData = async () => {
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
    };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <Navigation />

      <main className="grow relative z-10">
        {/* Loading State */}
        {loading ? (
          <section className="py-24">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <div className="animate-pulse space-y-4">
                <div className="h-12 bg-gradient-to-r from-blue-500/20 to-orange-500/20 rounded-lg w-2/3 mx-auto"></div>
                <div className="h-16 bg-gradient-to-r from-blue-500/20 to-orange-500/20 rounded-lg w-full mx-auto"></div>
              </div>
            </div>
          </section>
        ) : (
          <>
            {/* Featured Post Section */}
            {posts.length > 0 && (
              <section className="relative py-16 md:py-24 border-b border-blue-500/20">
                <div className="max-w-7xl mx-auto px-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Featured Image */}
                    <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-blue-400/30 group">
                      <Image
                        src={posts[0].thumbnail}
                        alt={posts[0].title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.backgroundColor = '#1e293b';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:via-black/50 transition duration-500"></div>
                      <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                        <div>
                          <span className="inline-block bg-gradient-to-r from-yellow-400 via-orange-400 to-amber-400 text-slate-900 px-4 py-2 rounded-full text-sm font-bold shadow-lg mb-3">
                            ⭐ Featured
                          </span>
                          <div className="flex gap-3 text-xs text-gray-200 font-semibold">
                            <span className="bg-blue-500/40 px-3 py-1 rounded-full">Post #{posts[0].post_number}</span>
                            <span className="bg-orange-500/40 px-3 py-1 rounded-full" suppressHydrationWarning>
                              🕐 {formatDateTime(posts[0].created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Featured Content */}
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-orange-400 to-green-400 bg-clip-text text-transparent leading-tight">
                          {posts[0].title}
                        </h1>
                        <p className="text-gray-300 text-lg leading-relaxed">{posts[0].excerpt}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-6 pt-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-blue-400/30">
                          <span className="text-blue-400">✍️</span>
                          <span className="text-gray-300 text-sm">{posts[0].author}</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-orange-400/30">
                          <span className="text-orange-400">📅</span>
                          <span className="text-gray-300 text-sm" suppressHydrationWarning>{formatDate(posts[0].created_at)}</span>
                        </div>
                        <div className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-orange-500/20 text-blue-300 rounded-full text-sm font-semibold border border-blue-500/50">
                          🏷️ {posts[0].category}
                        </div>
                      </div>

                      <Link
                        href={`/posts/${posts[0].slug}`}
                        className="inline-block bg-gradient-to-r from-blue-500 via-orange-500 to-green-500 hover:from-blue-600 hover:via-orange-600 hover:to-green-600 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95"
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
                <h2 className="text-5xl font-bold text-white mb-4">Latest Stories</h2>
                <p className="text-gray-400 text-xl">Discover fresh insights and perspectives</p>
              </div>

              {posts.length === 0 ? (
                <div className="text-center py-20 bg-gradient-to-br from-blue-500/5 to-orange-500/5 backdrop-blur-xl rounded-2xl border border-blue-400/20">
                  <p className="text-5xl mb-4">📝</p>
                  <p className="text-gray-300 text-xl mb-6">No posts yet. Be the first to share your story!</p>
                  <Link
                    href="/posts/new"
                    className="inline-block bg-gradient-to-r from-blue-500 to-orange-500 text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg transition"
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
                      className="group bg-gradient-to-br from-slate-800/50 via-slate-800/30 to-slate-800/50 backdrop-blur-xl rounded-2xl border border-blue-400/20 hover:border-orange-400/50 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                    >
                      {/* Card Image */}
                      <div className="relative h-48 bg-slate-700 overflow-hidden">
                        <Image
                          src={post.thumbnail}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.backgroundColor = '#334155';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute top-4 right-4">
                          <span className="bg-gradient-to-r from-blue-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                            {post.category}
                          </span>
                        </div>
                        <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-2">
                          <div className="flex gap-2 text-xs">
                            <span className="bg-blue-500/60 text-white px-2 py-1 rounded font-bold">#{post.post_number}</span>
                            {/* <span className="bg-orange-500/60 text-white px-2 py-1 rounded text-xs" suppressHydrationWarning>🕐 {formatDateTime(post.created_at)}</span> */}
                          </div>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3 text-xs text-gray-400">
                          <span suppressHydrationWarning>{formatDate(post.created_at)}</span>
                          <span>•</span>
                          <span>{post.author}</span>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-orange-400 group-hover:bg-clip-text transition">
                          {post.title}
                        </h3>

                        <p className="text-gray-400 text-sm line-clamp-2 mb-4">{post.excerpt}</p>

                        <div className="flex items-center text-blue-400 font-semibold text-sm group/link">
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
                    className="inline-block bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold transition border border-white/20 hover:border-blue-400/50"
                  >
                    View All Posts
                  </Link>
                </div>
              )}
            </section>

            {/* Categories Section */}
            <section className="bg-gradient-to-r from-blue-500/5 via-orange-500/5 to-green-500/5 py-20 border-y border-blue-400/20 backdrop-blur-sm">
              <div className="max-w-7xl mx-auto px-4">
                <div className="mb-16 text-center">
                  <h2 className="text-5xl font-bold text-white mb-4">Explore Categories</h2>
                  <p className="text-gray-400 text-xl">Find stories in your areas of interest</p>
                </div>

                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-pulse space-y-4">
                      <div className="h-20 bg-gradient-to-r from-blue-500/20 to-orange-500/20 rounded-lg w-full mx-auto"></div>
                    </div>
                  </div>
                ) : categories.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
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
                          className="group bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur-xl rounded-2xl border border-blue-400/20 p-8 text-center hover:border-orange-400/50 hover:bg-orange-500/10 transition-all duration-300 transform hover:scale-105"
                        >
                          <p className="text-6xl mb-4 group-hover:scale-125 transition-transform duration-300">
                            {category.emoji || '📌'}
                          </p>
                          <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                          <p className="text-gray-400 mb-6 text-lg">
                            <span className="font-bold text-blue-400">{categoryCount}</span> posts
                          </p>
                          <div className="text-blue-400 hover:text-orange-400 font-bold text-sm group/btn flex items-center justify-center gap-2 w-full transition">
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
            <section className="bg-gradient-to-r from-blue-600/20 via-orange-600/20 to-green-600/20 text-white py-20 my-12 mx-4 md:mx-12 rounded-3xl border border-blue-500/30 backdrop-blur-sm">
              <div className="max-w-4xl mx-auto px-4 text-center">
                <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-orange-400 to-green-400 bg-clip-text text-transparent">
                  Ready to Share Your Story?
                </h2>
                <p className="text-gray-300 text-xl mb-8">
                  Join our community of writers and share your insights with the world
                </p>
                <Link
                  href="/posts/new"
                  className="inline-block bg-gradient-to-r from-blue-500 via-orange-500 to-green-500 hover:from-blue-600 hover:via-orange-600 hover:to-green-600 text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95"
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
