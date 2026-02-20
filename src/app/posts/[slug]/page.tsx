'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  created_at: string;
  thumbnail: string;
}

export default function PostDetail() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${slug}`);
        if (!response.ok) {
          throw new Error('Post not found');
        }
        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <div className="animate-pulse">
            <div className="h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl mb-8"></div>
            <div className="h-12 bg-gray-700 rounded-lg w-3/4 mx-auto mb-4"></div>
            <div className="h-8 bg-gray-700 rounded-lg w-full mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center">
        <div className="max-w-md text-center">
          <p className="text-6xl mb-4">🔍</p>
          <p className="text-red-400 mb-4 text-lg font-medium">{error || 'Post not found'}</p>
          <Link href="/" className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg transition">
            ← Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Top Navigation */}
      <header className="border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl bg-gray-900/80">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold transition">
            ← Back to Home
          </Link>
          <div className="text-sm text-gray-400">
            Post #{post.id}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Featured Image Section */}
        <div className="relative w-full h-96 md:h-[500px] rounded-2xl overflow-hidden mb-12 shadow-2xl border border-white/10">
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            className="object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.backgroundColor = '#374151';
            }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/30 to-transparent"></div>
          <div className="absolute bottom-6 left-6 flex items-center gap-3">
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold">
              {post.category}
            </span>
          </div>
        </div>

        {/* Post Header */}
        <div className="mb-12">
          <div className="flex flex-wrap items-center gap-6 mb-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-blue-400">📅</span>
              <span className="text-gray-300" suppressHydrationWarning>{formatDate(post.created_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400">✍️</span>
              <span className="text-gray-300 font-medium">{post.author}</span>
            </div>
            <div className="text-gray-500">•</div>
            <span className="text-gray-400">Reading time: ~3 min</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {post.title}
          </h1>

          <p className="text-xl text-gray-300 leading-relaxed border-l-4 border-blue-500 pl-6">
            {post.excerpt}
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-transparent my-12"></div>

        {/* Post Content */}
        <article className="max-w-none mb-16">
          <div className="space-y-8">
            {post.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-lg text-gray-300 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </article>

        {/* Post Footer */}
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-8 border border-blue-500/20 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-bold text-lg mb-2">Share this post</h3>
              <p className="text-gray-400 text-sm">Help others discover this article</p>
            </div>
            <div className="flex gap-3">
              <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition border border-white/20 font-medium">
                📱 Twitter
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition border border-white/20 font-medium">
                💼 LinkedIn
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition border border-white/20 font-medium">
                🔗 Copy
              </button>
            </div>
          </div>
        </div>

        {/* Related Posts Section */}
        <div className="mt-16 pt-16 border-t border-white/10">
          <h3 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            More from {post.category}
          </h3>
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-12 border border-white/10 text-center">
            <p className="text-6xl mb-4">📚</p>
            <p className="text-gray-300 mb-6 text-lg">Check back soon for more posts in this category</p>
            <Link href="/" className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg hover:shadow-xl">
              View all posts →
            </Link>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-20 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-2xl p-12 border border-blue-500/30 text-center backdrop-blur-sm">
          <h3 className="text-2xl font-bold mb-3">Want to share your story?</h3>
          <p className="text-gray-300 mb-6">Join our community of writers and create your first post today.</p>
          <Link
            href="/posts/new"
            className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 rounded-lg font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            ✨ Create Your Post
          </Link>
        </div>
      </main>
    </div>
  );
}
