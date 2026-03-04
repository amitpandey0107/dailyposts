'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';

const ITEMS_PER_PAGE = 10;

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

export default function EditPosts() {
  const router = useRouter();
  const { isLoggedIn, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'title'>('latest');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push('/auth/login');
    }
  }, [isLoggedIn, authLoading, router]);

  // Fetch posts
  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const response = await fetch('/api/posts');
        const data = await response.json();
        setPosts(Array.isArray(data) ? data : []);
        setError('');
      } catch (err) {
        setError('Failed to fetch posts');
        setPosts([]);
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading && isLoggedIn) {
      fetchPosts();
    }
  }, []);

  // Filter posts based on search term
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort posts
  const sortedPosts = [...filteredPosts];
  if (sortBy === 'latest') {
    sortedPosts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } else if (sortBy === 'oldest') {
    sortedPosts.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  } else if (sortBy === 'title') {
    sortedPosts.sort((a, b) => a.title.localeCompare(b.title));
  }

  // Pagination
  const totalPages = Math.ceil(sortedPosts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPosts = sortedPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Handle delete
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      setPosts(posts.filter((post) => post.id !== id));
      setSuccess('Post deleted successfully');
      setDeleteConfirm(null);

      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete post');
    }
  };

  // Format date
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

  // Format time
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
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />

      <main className="grow max-w-7xl mx-auto px-4 w-full py-12">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-50">
              <span className="text-2xl">📝</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 font-serif">Manage Posts</h1>
          </div>
          <p className="text-gray-700">Edit, delete, or view your published posts</p>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 mb-6 flex gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-semibold text-red-700">Error</h3>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4 mb-6 flex gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <h3 className="font-semibold text-green-700">Success</h3>
              <p className="text-green-600 text-sm">{success}</p>
            </div>
          </div>
        )}

        {/* Controls Section */}
        <div className="bg-white border border-gray-300 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search by title or author..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-red-700 focus:border-transparent transition"
              />
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as 'latest' | 'oldest' | 'title');
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 focus:ring-2 focus:ring-red-700 focus:border-transparent transition cursor-pointer"
              >
                <option value="latest" className="bg-gray-800">
                  Latest First
                </option>
                <option value="oldest" className="bg-gray-800">
                  Oldest First
                </option>
                <option value="title" className="bg-gray-800">
                  Title (A-Z)
                </option>
              </select>
            </div>

            {/* Total Posts */}
            <div className="flex items-end">
              <div className="text-sm text-gray-700">
                Total: <span className="font-bold text-red-700">{filteredPosts.length}</span> post{filteredPosts.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>

        {/* Posts Table */}
        {loading ? (
          <div className="bg-white border border-gray-300 rounded-xl p-12 text-center">
            <div className="animate-pulse">
              <p className="text-gray-700 text-lg">Loading posts...</p>
            </div>
          </div>
        ) : paginatedPosts.length === 0 ? (
          <div className="bg-white border border-gray-300 rounded-xl p-12 text-center">
            <p className="text-gray-700 text-lg">
              {posts.length === 0 ? 'No posts yet. Create one to get started!' : 'No posts match your search.'}
            </p>
          </div>
        ) : (
          <div className="bg-white border border-gray-300 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-300 bg-gray-50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Post #</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Title</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Author</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Published</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Time</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPosts.map((post, index) => (
                    <tr
                      key={post.id}
                      className={`border-b border-gray-300 transition hover:bg-gray-50 ${
                        index % 2 === 0 ? 'bg-gray-50' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-300">
                          #{post.post_number}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900 truncate max-w-xs">{post.title}</p>
                          <p className="text-xs text-gray-600 mt-1">{post.slug}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{post.author}</td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-300">
                          {post.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{formatDate(post.created_at)}</td>
                      <td className="px-6 py-4 text-sm text-gray-700" suppressHydrationWarning>{formatDateTime(post.created_at)}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => router.push(`/posts/edit/${post.id}`)}
                            className="px-3 py-1 rounded-lg text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100 transition border border-red-300"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(post.id)}
                            className="px-3 py-1 rounded-lg text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100 transition border border-red-300"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg bg-red-50 text-red-700 disabled:opacity-50 disabled:cursor-not-allowed border border-red-300 hover:bg-red-100 transition"
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg bg-red-50 text-red-700 disabled:opacity-50 disabled:cursor-not-allowed border border-red-300 hover:bg-red-100 transition"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm !== null && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl border border-gray-300 p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-serif">Delete Post?</h3>
              <p className="text-gray-700 mb-8">
                Are you sure you want to delete this post? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-200 text-gray-900 hover:bg-gray-300 transition border border-gray-400 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-700 text-white hover:bg-red-800 transition font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
