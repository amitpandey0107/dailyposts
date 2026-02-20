'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

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
}

export default function EditPosts() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'title'>('latest');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
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
    };

    fetchPosts();
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

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      <Navigation />

      <main className="grow max-w-7xl mx-auto px-4 w-full py-12">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-purple-500">
              <span className="text-2xl">📝</span>
            </div>
            <h1 className="text-4xl font-bold text-white">Manage Posts</h1>
          </div>
          <p className="text-gray-300">Edit, delete, or view your published posts</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border-2 border-red-500/30 rounded-xl p-4 mb-6 flex gap-3 backdrop-blur-sm">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-semibold text-red-400">Error</h3>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border-2 border-green-500/30 rounded-xl p-4 mb-6 flex gap-3 backdrop-blur-sm">
            <span className="text-2xl">✅</span>
            <div>
              <h3 className="font-semibold text-green-400">Success</h3>
              <p className="text-green-300 text-sm">{success}</p>
            </div>
          </div>
        )}

        {/* Controls Section */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search by title or author..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as 'latest' | 'oldest' | 'title');
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition cursor-pointer"
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
              <div className="text-sm text-gray-300">
                Total: <span className="font-bold text-blue-400">{filteredPosts.length}</span> post{filteredPosts.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>

        {/* Posts Table */}
        {loading ? (
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-12 text-center">
            <div className="animate-pulse">
              <p className="text-gray-300 text-lg">Loading posts...</p>
            </div>
          </div>
        ) : paginatedPosts.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-12 text-center">
            <p className="text-gray-300 text-lg">
              {posts.length === 0 ? 'No posts yet. Create one to get started!' : 'No posts match your search.'}
            </p>
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Title</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Author</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Published</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPosts.map((post, index) => (
                    <tr
                      key={post.id}
                      className={`border-b border-white/5 transition hover:bg-white/5 ${
                        index % 2 === 0 ? 'bg-white/2' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-white truncate max-w-xs">{post.title}</p>
                          <p className="text-xs text-gray-400 mt-1">{post.slug}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{post.author}</td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {post.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">{formatDate(post.created_at)}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => router.push(`/posts/edit/${post.id}`)}
                            className="px-3 py-1 rounded-lg text-xs font-medium bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition border border-blue-500/30"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(post.id)}
                            className="px-3 py-1 rounded-lg text-xs font-medium bg-red-500/20 text-red-300 hover:bg-red-500/30 transition border border-red-500/30"
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
              <div className="px-6 py-4 border-t border-white/10 bg-white/5 flex items-center justify-between">
                <div className="text-sm text-gray-300">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed border border-blue-500/30 hover:bg-blue-500/30 transition"
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed border border-blue-500/30 hover:bg-blue-500/30 transition"
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-gray-900 rounded-2xl border border-white/10 p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-white mb-4">Delete Post?</h3>
              <p className="text-gray-300 mb-8">
                Are you sure you want to delete this post? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition border border-white/20"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition font-semibold"
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
