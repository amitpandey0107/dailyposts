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
      <div className="min-h-screen bg-white">
        <header className="border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              ← Back to Home
            </Link>
          </div>
        </header>
        <div className="max-w-3xl mx-auto px-4 py-12 text-center">
          <p className="text-gray-500">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white">
        <header className="border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              ← Back to Home
            </Link>
          </div>
        </header>
        <div className="max-w-3xl mx-auto px-4 py-12 text-center">
          <p className="text-red-600 mb-4">{error || 'Post not found'}</p>
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Home
          </Link>
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
      <main className="max-w-3xl mx-auto px-4 py-12">
        {/* Featured Image */}
        <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden mb-8">
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

        {/* Post Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm text-gray-500" suppressHydrationWarning>{formatDate(post.created_at)}</span>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {post.category}
            </span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

          <p className="text-lg text-gray-600 mb-6 leading-relaxed">{post.excerpt}</p>

          <div className="flex flex-col gap-2 text-sm text-gray-500">
            <p>By <span className="font-medium text-gray-900">{post.author}</span></p>
            <p>Post ID: #{post.id}</p>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-8 border-gray-200" />

        {/* Post Content */}
        <article className="prose prose-lg max-w-none mb-12">
          <div className="space-y-6">
            {post.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-gray-700 leading-relaxed text-base">
                {paragraph}
              </p>
            ))}
          </div>
        </article>

        {/* Post Footer */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4">Share this post</h3>
          <div className="flex gap-4">
            <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
              Share on Twitter
            </button>
            <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
              Share on LinkedIn
            </button>
            <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
              Copy Link
            </button>
          </div>
        </div>

        {/* Related Posts Section */}
        <div className="mt-12 pt-12 border-t border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">More from {post.category}</h3>
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500 mb-4">Check back soon for more posts in this category</p>
            <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
              View all posts →
            </Link>
          </div>
        </div>
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
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2026 Daily Post. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
