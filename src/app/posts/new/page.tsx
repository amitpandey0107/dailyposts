'use client';

import { FormEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';

interface Category {
  id: number;
  name: string;
  slug: string;
}

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
  const { isLoggedIn, loading: authLoading, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [imageSource, setImageSource] = useState<'upload' | 'url'>('upload');
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    excerpt: '',
    content: '',
    author: 'Satish Mehta',
    category: '',
    thumbnail: '',
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push('/auth/login');
    }
  }, [isLoggedIn, authLoading, router]);

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(Array.isArray(data) ? data : []);
          // Set the first category as default
          if (Array.isArray(data) && data.length > 0) {
            setFormData((prev) => ({
              ...prev,
              category: data[0].name,
            }));
          }
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setCategoriesLoading(false);
      }
    }

    fetchCategories();
  }, []);

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
    } catch {
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
          user_id: user?.id || null,
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
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />

      {/* Main Content */}
      <main className="grow max-w-5xl mx-auto px-4 w-full py-12">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <div className="inline-block mb-6 p-4 bg-red-50 rounded-2xl border border-red-300">
            <span className="text-4xl">✨</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gray-900 font-serif">
            Create Your Story
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Share your insights and ideas with readers around the world. Make an impact today.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 mb-8 flex gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-semibold text-red-700">Error</h3>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4 mb-8 flex gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <h3 className="font-semibold text-green-700">Success</h3>
              <p className="text-green-600 text-sm">{success}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white border border-gray-300 rounded-xl shadow-lg p-8 md:p-12 space-y-8">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-3">
              Post Title <span className="text-red-700">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="What's on your mind? Make it compelling..."
              className="w-full px-5 py-4 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-red-700 focus:border-red-700 transition text-lg"
              required
            />
          </div>

          {/* Author and Category Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Author */}
            <div>
              <label htmlFor="author" className="block text-sm font-semibold text-gray-900 mb-3">
                Author <span className="text-gray-500 text-xs">(default: Satish Mehta)</span>
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Enter author name"
                className="w-full px-5 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-red-700 focus:border-red-700 transition"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-gray-900 mb-3">
                Category <span className="text-red-700">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:ring-2 focus:ring-red-700 focus:border-red-700 transition cursor-pointer"
                required
                disabled={categoriesLoading}
              >
                {categoriesLoading ? (
                  <option value="">Loading categories...</option>
                ) : categories.length === 0 ? (
                  <option value="">No categories available</option>
                ) : (
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.name} className="bg-gray-800">
                      {cat.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label htmlFor="excerpt" className="block text-sm font-semibold text-gray-900 mb-3">
              Excerpt <span className="text-red-700">*</span>
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              placeholder="Write a compelling summary (50-150 characters)"
              rows={3}
              className="w-full px-5 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-red-700 focus:border-red-700 resize-none transition"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-semibold text-gray-900 mb-3">
              Content <span className="text-red-700">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write the full content of your post..."
              rows={12}
              className="w-full px-5 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-red-700 focus:border-red-700 resize-none transition"
              required
            />
          </div>

          {/* Image Upload Section */}
          <div className="p-8 bg-red-50 rounded-xl border-2 border-dashed border-red-300 hover:border-red-500 transition">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-2xl">🖼️</span> Featured Image <span className="text-red-700">*</span>
            </h3>
            
            <div className="space-y-6">
              {/* Image Preview */}
              {imagePreview && (
                <div className="relative w-full h-64 bg-gray-100 rounded-xl overflow-hidden border border-gray-300 shadow-lg group">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    fill
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview('');
                      setUploadedFileName('');
                      setFormData((prev) => ({ ...prev, thumbnailFile: undefined }));
                      setError('');
                    }}
                    className="absolute top-3 right-3 bg-red-700 hover:bg-red-800 text-white rounded-full w-10 h-10 flex items-center justify-center transition shadow-lg opacity-0 group-hover:opacity-100"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Upload or URL Toggle */}
              <div className="space-y-4">
                {/* Image Source Toggle */}
                <div className="flex gap-3 bg-white p-1 rounded-lg border border-gray-300">
                  <button
                    type="button"
                    onClick={() => setImageSource('upload')}
                    className={`flex-1 py-3 px-4 rounded-md transition font-semibold text-sm ${
                      imageSource === 'upload'
                        ? 'bg-red-700 text-white shadow-lg'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    📤 Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageSource('url')}
                    className={`flex-1 py-3 px-4 rounded-md transition font-semibold text-sm ${
                      imageSource === 'url'
                        ? 'bg-red-700 text-white shadow-lg'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    🔗 URL
                  </button>
                </div>

                {imageSource === 'upload' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Upload Image <span className="text-gray-500 text-xs">(max 10MB)</span>
                    </label>
                    <div className="border-2 border-dashed border-red-400 rounded-xl p-8 text-center hover:border-red-600 hover:bg-red-100/50 transition cursor-pointer relative bg-white">
                      <input
                        type="file"
                        onChange={handleImageFileChange}
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="pointer-events-none">
                        <p className="text-5xl mb-3">📸</p>
                        <p className="text-sm font-medium text-gray-700">
                          {uploadedFileName || 'Click to upload or drag & drop'}
                        </p>
                        <p className="text-xs text-gray-600 mt-2">PNG, JPG, GIF, WebP up to 10MB</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-900 mb-3">
                      Image URL
                    </label>
                    <input
                      type="url"
                      id="thumbnail"
                      placeholder="https://example.com/image.jpg"
                      value={formData.thumbnail}
                      onChange={(e) => {
                        handleImageUrlChange(e.target.value);
                      }}
                      className="w-full px-5 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-red-700 focus:border-red-700 transition"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-8 border-t border-gray-300">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-red-700 hover:bg-red-800 disabled:bg-gray-400 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl disabled:shadow-none transform hover:scale-105 disabled:scale-100 flex items-center justify-center gap-3 text-lg"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⏳</span> Publishing...
                </>
              ) : (
                <>
                  <span>🚀</span> Publish Post
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 px-8 py-4 rounded-xl font-bold transition border border-gray-400"
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
