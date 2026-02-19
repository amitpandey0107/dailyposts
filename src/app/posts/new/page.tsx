'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
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

interface FormData {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  thumbnail: string;
  thumbnailFile?: File;
}

export default function NewPost() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    title: '',
    excerpt: '',
    content: '',
    author: 'Satish Mehta',
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

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      thumbnailFile: file,
      thumbnail: '', // Clear URL when file is selected
    }));

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setUploadedFileName(file.name);
    };
    reader.readAsDataURL(file);
    setError('');
  };

  const handleImageUrlChange = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      thumbnail: url,
      thumbnailFile: undefined,
    }));
    setImagePreview('');
    setUploadedFileName('');
    setError('');
  };

  const uploadImageToBackend = async (file: File): Promise<string> => {
    const formDataObj = new FormData();
    formDataObj.append('image', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataObj,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      return data.imageUrl;
    } catch (err) {
      throw new Error('Image upload failed');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate required fields
      if (!formData.title.trim() || !formData.excerpt.trim() || !formData.content.trim()) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Validate image (either file or URL)
      if (!formData.thumbnailFile && !formData.thumbnail) {
        setError('Please upload an image or provide an image URL');
        setLoading(false);
        return;
      }

      let thumbnailUrl = formData.thumbnail;

      // Upload image file if provided
      if (formData.thumbnailFile) {
        thumbnailUrl = await uploadImageToBackend(formData.thumbnailFile);
      }

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          excerpt: formData.excerpt,
          content: formData.content,
          author: formData.author || 'Satish Mehta',
          category: formData.category,
          thumbnail: thumbnailUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const newPost = await response.json();
      setSuccess('Post created successfully! Redirecting...');

      setTimeout(() => {
        router.push(`/posts/${newPost.slug}`);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />

      {/* Main Content */}
      <main className="grow max-w-4xl mx-auto px-4 w-full py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Post</h1>
          <p className="text-gray-600">Share your thoughts and insights with the world</p>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-8 flex gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-8 flex gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <h3 className="font-semibold text-green-900">Success</h3>
              <p className="text-green-800 text-sm">{success}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          {/* Title */}
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
              placeholder="Enter an engaging title for your post"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            />
          </div>

          {/* Category */}
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

          {/* Excerpt */}
          <div className="mb-8">
            <label htmlFor="excerpt" className="block text-sm font-semibold text-gray-900 mb-3">
              Excerpt <span className="text-red-600">*</span>
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              placeholder="Write a compelling summary of your post"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition"
              required
            />
          </div>

          {/* Content */}
          <div className="mb-8">
            <label htmlFor="content" className="block text-sm font-semibold text-gray-900 mb-3">
              Content <span className="text-red-600">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write the full content of your post..."
              rows={10}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition"
              required
            />
          </div>

          {/* Author */}
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
              placeholder="Author name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <p className="text-sm text-gray-500 mt-2">Default: Satish Mehta</p>
          </div>

          {/* Image Upload Section */}
          <div className="mb-8 p-6 bg-linear-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-dashed border-blue-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Featured Image</h3>
            
            <div className="space-y-6">
              {/* Image Preview */}
              {imagePreview && (
                <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview('');
                      setUploadedFileName('');
                      setFormData((prev) => ({ ...prev, thumbnailFile: undefined }));
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Upload or URL Toggle */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Upload Image <span className="text-gray-500 text-xs">(max 10MB)</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition cursor-pointer relative">
                    <input
                      type="file"
                      onChange={handleImageFileChange}
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="pointer-events-none">
                      <p className="text-2xl mb-2">📤</p>
                      <p className="text-sm font-medium text-gray-700">
                        {uploadedFileName || 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF, WebP</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="text-sm text-gray-500">OR</span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>

                <div>
                  <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-3">
                    Image URL
                  </label>
                  <input
                    type="url"
                    id="thumbnail"
                    placeholder="https://example.com/image.jpg"
                    value={formData.thumbnail}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-linear-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              {loading ? '🔄 Publishing...' : '✨ Publish Post'}
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
