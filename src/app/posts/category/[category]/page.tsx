'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
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
}

interface Category {
  id: number;
  name: string;
  slug: string;
  emoji: string;
}

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.category as string;
  const categoryName = decodeURIComponent(categorySlug).replace(/-/g, ' ');

  const [posts, setPosts] = useState<Post[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch category data and posts in parallel
        const [postsResponse, categoriesResponse] = await Promise.all([
          fetch(`/api/posts/category/${categorySlug}`),
          fetch('/api/categories'),
        ]);

        if (!postsResponse.ok) {
          throw new Error('Failed to fetch posts');
        }

        const postsData = await postsResponse.json();
        const categoriesData = await categoriesResponse.json();

        // Find the matching category
        const foundCategory = Array.isArray(categoriesData)
          ? categoriesData.find((c: Category) => c.slug === categorySlug)
          : null;

        setPosts(Array.isArray(postsData) ? postsData : []);
        setCategory(foundCategory || null);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load posts. Please try again later.');
        setPosts([]);
        setCategory(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categorySlug]);

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
        {/* Category Header */}
        <section className="py-16 md:py-24 border-b border-blue-500/20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="text-7xl md:text-8xl mb-6">
              {category?.emoji || '📌'}
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-orange-400 to-green-400 bg-clip-text text-transparent mb-4 leading-tight">
              {category?.name || categoryName}
            </h1>
            <p className="text-gray-400 text-xl md:text-2xl mb-6">
              Explore all stories in <span className="text-blue-400 font-semibold">{category?.name || categoryName}</span>
            </p>
            <p className="text-gray-500 text-lg">
              {loading ? 'Loading...' : `${posts.length} ${posts.length === 1 ? 'post' : 'posts'} found`}
            </p>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="max-w-7xl mx-auto px-4 py-20">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-pulse space-y-4">
                <div className="h-12 bg-gradient-to-r from-blue-500/20 to-orange-500/20 rounded-lg w-2/3 mx-auto"></div>
                <div className="h-16 bg-gradient-to-r from-blue-500/20 to-orange-500/20 rounded-lg w-full mx-auto"></div>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-gradient-to-br from-red-500/5 to-orange-500/5 backdrop-blur-xl rounded-2xl border border-red-400/20">
              <p className="text-5xl mb-4">⚠️</p>
              <p className="text-gray-300 text-xl">{error}</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 bg-gradient-to-br from-blue-500/5 to-orange-500/5 backdrop-blur-xl rounded-2xl border border-blue-400/20">
              <p className="text-5xl mb-4">📝</p>
              <p className="text-gray-300 text-xl mb-6">No posts found in this category yet.</p>
              <Link
                href="/"
                className="inline-block bg-gradient-to-r from-blue-500 to-orange-500 text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg transition"
              >
                Back to Home
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="group bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur-xl rounded-2xl border border-blue-400/20 overflow-hidden hover:border-orange-400/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                >
                  {/* Post Image */}
                  <div className="relative h-56 overflow-hidden bg-slate-900">
                    <Image
                      src={post.thumbnail}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.backgroundColor = '#1e293b';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:via-black/50 transition duration-500"></div>
                    <div className="absolute top-4 right-4">
                      <span className="inline-block bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        {post.category}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-2">
                      <div className="flex gap-2 text-xs">
                        <span className="bg-blue-500/60 text-white px-2 py-1 rounded font-bold">#{post.post_number}</span>
                        <span className="bg-orange-500/60 text-white px-2 py-1 rounded text-xs" suppressHydrationWarning>🕐 {formatDateTime(post.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-300 text-sm line-clamp-3">{post.excerpt}</p>

                    <div className="space-y-4 pt-4 border-t border-blue-400/20">
                      <div className="flex flex-col text-sm text-gray-400 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <span>✍️</span>
                            {post.author}
                          </span>
                          <span suppressHydrationWarning className="flex items-center gap-2">
                            <span>📅</span>
                            {formatDate(post.created_at)}
                          </span>
                        </div>
                        <div suppressHydrationWarning className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Posted at</span>
                          <span className="text-xs font-semibold text-blue-400">{formatDateTime(post.created_at)}</span>
                        </div>
                      </div>

                      <Link
                        href={`/posts/${post.slug}`}
                        className="inline-block w-full text-center bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white px-4 py-2 rounded-lg font-bold transition-all transform active:scale-95"
                      >
                        Read Story →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Back to Home */}
        <section className="text-center py-12">
          <Link
            href="/"
            className="inline-block bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold transition border border-white/20 hover:border-blue-400/50"
          >
            ← Back to Home
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
