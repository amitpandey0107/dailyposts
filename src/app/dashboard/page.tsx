'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';

interface Statistics {
  total: number;
  thisMonth: number;
  thisWeek: number;
  today: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  emoji: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { isLoggedIn, user, loading } = useAuth();
  const [stats, setStats] = useState<Statistics>({
    total: 0,
    thisMonth: 0,
    thisWeek: 0,
    today: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryEmoji, setCategoryEmoji] = useState('📌');
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push('/auth/login');
    }
  }, [isLoggedIn, loading, router]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchStats() {
      if (user?.id) {
        try {
          const response = await fetch(`/api/stats/user/${user.id}`);
          if (response.ok) {
            const data = await response.json();
            setStats(data);
          }
        } catch (error) {
          console.error('Error fetching statistics:', error);
        } finally {
          setStatsLoading(false);
        }
      }
    }

    if (!loading && isLoggedIn && user?.id) {
      fetchStats();
    }
  }, [user?.id, loading, isLoggedIn]);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setCategoryLoading(true);
    setCategoryError(null);

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: categoryName,
          emoji: categoryEmoji,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        setCategoryError(error.error || 'Failed to add category');
        return;
      }

      const newCategory = await response.json();
      setCategories([...categories, newCategory]);
      setCategoryName('');
      setCategoryEmoji('📌');
      setShowAddCategory(false);
    } catch (error) {
      console.error('Error adding category:', error);
      setCategoryError('Failed to add category');
    } finally {
      setCategoryLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-300 rounded-lg w-64"></div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  const dashboardItems = [
    {
      title: 'Create New Post',
      description: 'Write and publish a new article with rich content',
      icon: '✨',
      href: '/posts/new',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'blue',
    },
    {
      title: 'Edit Posts',
      description: 'Modify and update your existing articles',
      icon: '✏️',
      href: '/posts/edit',
      color: 'from-orange-500 to-amber-500',
      bgColor: 'orange',
    },
    {
      title: 'Bulk Upload',
      description: 'Upload multiple posts using a CSV file',
      icon: '📤',
      href: '/posts/bulk-upload',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'green',
    },
    {
      title: 'View All Posts',
      description: 'Browse and read all published articles',
      icon: '📚',
      href: '/',
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'cyan',
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      <Navigation />

      <main className="grow relative z-10">
        {/* Dashboard Header */}
        <section className="py-16 md:py-24 border-b border-gray-300">
          <div className="max-w-7xl mx-auto px-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-red-700 rounded-2xl flex items-center justify-center text-3xl text-white">
                  👤
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-serif">
                    Welcome, {user?.username}!
                  </h1>
                  <p className="text-gray-700 text-lg mt-2">
                    Manage all your content from one place
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 border-b border-gray-300">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white border border-gray-300 rounded-xl p-6 hover:shadow-md transition-all">
                <p className="text-gray-600 text-sm mb-2">Total Posts</p>
                <p className="text-3xl font-bold text-red-700">{statsLoading ? '-' : stats.total}</p>
              </div>
              <div className="bg-white border border-gray-300 rounded-xl p-6 hover:shadow-md transition-all">
                <p className="text-gray-600 text-sm mb-2">This Month</p>
                <p className="text-3xl font-bold text-red-700">{statsLoading ? '-' : stats.thisMonth}</p>
              </div>
              <div className="bg-white border border-gray-300 rounded-xl p-6 hover:shadow-md transition-all">
                <p className="text-gray-600 text-sm mb-2">This Week</p>
                <p className="text-3xl font-bold text-red-700">{statsLoading ? '-' : stats.thisWeek}</p>
              </div>
              <div className="bg-white border border-gray-300 rounded-xl p-6 hover:shadow-md transition-all">
                <p className="text-gray-600 text-sm mb-2">Today</p>
                <p className="text-3xl font-bold text-red-700">{statsLoading ? '-' : stats.today}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions Section */}
        <section className="py-12 border-b border-gray-300">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 font-serif">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link
                href="/posts/new"
                className="bg-white border border-gray-300 rounded-xl p-8 hover:shadow-lg transition-all text-center"
              >
                <div className="w-16 h-16 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-2xl">
                  ✍️
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Create Post</h3>
                <p className="text-sm text-gray-600">Write a new blog post</p>
              </Link>

              <Link
                href="/posts/edit"
                className="bg-white border border-gray-300 rounded-xl p-8 hover:shadow-lg transition-all text-center"
              >
                <div className="w-16 h-16 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-2xl">
                  📝
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Edit Posts</h3>
                <p className="text-sm text-gray-600">Manage existing posts</p>
              </Link>

              <Link
                href="/posts/bulk-upload"
                className="bg-white border border-gray-300 rounded-xl p-8 hover:shadow-lg transition-all text-center"
              >
                <div className="w-16 h-16 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-2xl">
                  📤
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Bulk Upload</h3>
                <p className="text-sm text-gray-600">Upload multiple posts</p>
              </Link>

              <Link
                href="/posts"
                className="bg-white border border-gray-300 rounded-xl p-8 hover:shadow-lg transition-all text-center"
              >
                <div className="w-16 h-16 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-2xl">
                  📚
                </div>
                <h3 className="font-bold text-gray-900 mb-2">View All Posts</h3>
                <p className="text-sm text-gray-600">See all published posts</p>
              </Link>
            </div>
          </div>
        </section>

        {/* Category Management Section */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-serif">Manage Categories</h2>
              <button
                onClick={() => setShowAddCategory(!showAddCategory)}
                className="bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded-lg font-bold transition-all"
              >
                {showAddCategory ? '✕ Cancel' : '+ Add Category'}
              </button>
            </div>

            {showAddCategory && (
              <div className="mb-8 bg-white border border-gray-300 rounded-xl p-6">
                <form onSubmit={handleAddCategory} className="space-y-4">
                  <div>
                    <label className="block text-gray-900 mb-2 font-semibold">Category Name</label>
                    <input
                      type="text"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      placeholder="e.g., AI & Machine Learning"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:border-red-700 focus:outline-none transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-900 mb-2 font-semibold">Emoji</label>
                    <input
                      type="text"
                      value={categoryEmoji}
                      onChange={(e) => setCategoryEmoji(e.target.value)}
                      placeholder="e.g., 🤖"
                      maxLength={2}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:border-red-700 focus:outline-none transition"
                    />
                  </div>
                  {categoryError && (
                    <div className="text-red-700 text-sm bg-red-50 border border-red-300 rounded-lg p-3">
                      {categoryError}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={categoryLoading}
                    className="w-full bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-bold transition-all"
                  >
                    {categoryLoading ? 'Adding...' : 'Add Category'}
                  </button>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500">
                  <p className="text-lg">No categories yet. Create one to get started!</p>
                </div>
              ) : (
                categories.map((category) => (
                  <div
                    key={category.id}
                    className="bg-white border border-gray-300 rounded-lg p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{category.emoji}</span>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-600">{category.slug}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
        <section className="py-12 border-t border-gray-300">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 font-serif">Quick Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-300 rounded-lg p-6 hover:shadow-md transition-all">
                <h3 className="text-lg font-semibold text-red-700 mb-2">💡 Create Post</h3>
                <p className="text-gray-600 text-sm">
                  Write engaging articles with a rich text editor. Add images, format text, and preview before publishing.
                </p>
              </div>
              <div className="bg-white border border-gray-300 rounded-lg p-6 hover:shadow-md transition-all">
                <h3 className="text-lg font-semibold text-red-700 mb-2">📝 Edit Posts</h3>
                <p className="text-gray-600 text-sm">
                  Update your published articles anytime. Modify content, thumbnails, and metadata with ease.
                </p>
              </div>
              <div className="bg-white border border-gray-300 rounded-lg p-6 hover:shadow-md transition-all">
                <h3 className="text-lg font-semibold text-red-700 mb-2">📤 Bulk Upload</h3>
                <p className="text-gray-600 text-sm">
                  Import multiple posts at once using CSV. Perfect for migrating content or batch uploads.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
