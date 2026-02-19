'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const CATEGORIES = [
  'Technology',
  'Governance',
  'Security',
  'AI & Future',
  'Business',
  'Media & Society',
];

export default function NewPost() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    category: 'Technology',
    thumbnail: '',
  });

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
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.title.trim() || !formData.excerpt.trim() || !formData.content.trim()) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          author: formData.author || 'Daily Post',
          thumbnail: formData.thumbnail || '/images/placeholder-default.jpg',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const newPost = await response.json();

      // Redirect to the new post
      router.push(`/posts/${newPost.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Daily Posts</h1>
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
            className="text-blue-600 font-medium border-b-2 border-blue-600"
          >
            Create Post
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Create New Post</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-8 border border-gray-200">
          {/* Title */}
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-2">
              Title <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter post title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Category */}
          <div className="mb-6">
            <label htmlFor="category" className="block text-sm font-medium text-gray-900 mb-2">
              Category <span className="text-red-600">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Excerpt */}
          <div className="mb-6">
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-900 mb-2">
              Excerpt <span className="text-red-600">*</span>
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              placeholder="Enter post excerpt (short summary)"
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
          </div>

          {/* Content */}
          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium text-gray-900 mb-2">
              Content <span className="text-red-600">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Enter full post content"
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
          </div>

          {/* Author */}
          <div className="mb-6">
            <label htmlFor="author" className="block text-sm font-medium text-gray-900 mb-2">
              Author
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Enter author name (optional)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Thumbnail URL */}
          <div className="mb-6">
            <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-900 mb-2">
              Thumbnail URL
            </label>
            <input
              type="url"
              id="thumbnail"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              placeholder="Enter thumbnail image URL (optional)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium transition-colors"
            >
              {loading ? 'Creating...' : 'Create Post'}
            </button>
            <Link
              href="/"
              className="flex-1 bg-gray-200 text-gray-900 px-6 py-2 rounded-lg hover:bg-gray-300 font-medium transition-colors text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-12">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2026 Daily Post. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
