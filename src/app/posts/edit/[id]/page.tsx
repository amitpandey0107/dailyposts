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
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation />
        <main className="grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation />
        <main className="grow max-w-4xl mx-auto px-4 w-full py-12">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-900 font-medium">❌ Post not found</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />

      <main className="flex-grow max-w-4xl mx-auto px-4 w-full py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Post</h1>
          <p className="text-gray-600">{post.title}</p>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-8">
            <p className="text-red-800 font-medium">❌ {error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-8">
            <p className="text-green-800 font-medium">✅ {success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
          <div className="mb-8">
            <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-3">
              Post Title <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            />
          </div>

          <div className="mb-8">
            <label htmlFor="category" className="block text-sm font-semibold text-gray-900 mb-3">
              Category <span className="text-red-600">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-8">
            <label htmlFor="excerpt" className="block text-sm font-semibold text-gray-900 mb-3">
              Excerpt <span className="text-red-600">*</span>
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition"
              required
            />
          </div>

          <div className="mb-8">
            <label htmlFor="content" className="block text-sm font-semibold text-gray-900 mb-3">
              Content <span className="text-red-600">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={10}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition"
              required
            />
          </div>

          <div className="mb-8">
            <label htmlFor="author" className="block text-sm font-semibold text-gray-900 mb-3">
              Author
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div className="mb-8">
            <label htmlFor="thumbnail" className="block text-sm font-semibold text-gray-900 mb-3">
              Thumbnail URL
            </label>
            <input
              type="url"
              id="thumbnail"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-linear-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 font-semibold transition-all shadow-lg"
            >
              {saving ? '🔄 Saving...' : '💾 Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-gray-200 text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-300 font-semibold transition-all"
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
