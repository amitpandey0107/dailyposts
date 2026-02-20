'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const CATEGORIES = [
  'Technology',
  'Governance',
  'Security',
  'AI & Future',
  'Business',
  'Media & Society',
];

interface Post {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  thumbnail: string;
  slug: string;
}

export default function EditPost() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    category: 'Technology',
    thumbnail: '',
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Get post by ID from backend
        const response = await fetch(`/api/posts?id=${postId}`);
        if (!response.ok) throw new Error('Failed to fetch post');
        
        const posts = await response.json();
        const foundPost = posts.find((p: Post) => p.id === parseInt(postId));
        
        if (!foundPost) {
          throw new Error('Post not found');
        }

        setPost(foundPost);
        setFormData({
          title: foundPost.title,
          excerpt: foundPost.excerpt,
          content: foundPost.content,
          author: foundPost.author,
          category: foundPost.category,
          thumbnail: foundPost.thumbnail,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch post');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [postId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      if (!formData.title.trim() || !formData.excerpt.trim() || !formData.content.trim()) {
        setError('Please fill in all required fields');
        setSaving(false);
        return;
      }

      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update post');
      }

      setSuccess('Post updated successfully!');
      setTimeout(() => {
        router.push('/posts/edit');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update post');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
        <Navigation />
        <main className="grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-blue-500"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
        <Navigation />
        <main className="grow max-w-4xl mx-auto px-4 w-full py-12 flex items-center">
          <div className="bg-red-500/10 border-2 border-red-500/30 rounded-xl p-8 text-center w-full backdrop-blur-sm">
            <p className="text-3xl mb-3">❌</p>
            <p className="text-red-300 font-medium text-lg">Post not found</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-blue-900/20 to-gray-900 flex flex-col">
      <Navigation />

      <main className="grow max-w-5xl mx-auto px-4 w-full py-12">
        {/* Header Section */}
        <div className="mb-12">
          <div className="mb-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl">
              ✏️
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">Edit Post</h1>
              <p className="text-gray-400 text-sm mt-1">Update your story</p>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 mt-6">
            <p className="text-gray-300 text-sm">
              <span className="text-gray-500">Current Title: </span>
              <span className="font-semibold text-blue-400">{post.title}</span>
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border-2 border-red-500/30 rounded-xl p-4 mb-8 flex gap-3 backdrop-blur-sm">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-semibold text-red-400">Error</h3>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border-2 border-green-500/30 rounded-xl p-4 mb-8 flex gap-3 backdrop-blur-sm">
            <span className="text-2xl">✅</span>
            <div>
              <h3 className="font-semibold text-green-400">Success</h3>
              <p className="text-green-300 text-sm">{success}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-3xl rounded-3xl shadow-2xl p-8 md:p-12 border border-white/10 space-y-8">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-200 mb-3">
              Post Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition backdrop-blur-sm text-lg"
              required
            />
          </div>

          {/* Category and Author Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-gray-200 mb-3">
                Category <span className="text-red-400">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition backdrop-blur-sm cursor-pointer"
                required
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-gray-800">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Author */}
            <div>
              <label htmlFor="author" className="block text-sm font-semibold text-gray-200 mb-3">
                Author
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label htmlFor="excerpt" className="block text-sm font-semibold text-gray-200 mb-3">
              Excerpt <span className="text-red-400">*</span>
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows={3}
              className="w-full px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition backdrop-blur-sm"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-semibold text-gray-200 mb-3">
              Content <span className="text-red-400">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={12}
              className="w-full px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition backdrop-blur-sm"
              required
            />
          </div>

          {/* Thumbnail URL */}
          <div>
            <label htmlFor="thumbnail" className="block text-sm font-semibold text-gray-200 mb-3">
              Thumbnail URL
            </label>
            <input
              type="url"
              id="thumbnail"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition backdrop-blur-sm"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-8 border-t border-white/10">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:via-gray-600 disabled:to-gray-600 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl disabled:shadow-none transform hover:scale-105 disabled:scale-100 flex items-center justify-center gap-3"
            >
              {saving ? (
                <>
                  <span className="animate-spin">⏳</span> Saving...
                </>
              ) : (
                <>
                  <span>💾</span> Save Changes
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold transition border border-white/20"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
