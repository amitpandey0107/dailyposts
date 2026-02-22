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

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push('/auth/login');
    }
  }, [isLoggedIn, loading, router]);

  useEffect(() => {
    const fetchStats = async () => {
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
    };

    if (!loading && isLoggedIn && user?.id) {
      fetchStats();
    }
  }, [user?.id, loading, isLoggedIn]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gradient-to-r from-blue-500/20 to-orange-500/20 rounded-lg w-64"></div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <Navigation />

      <main className="grow relative z-10">
        {/* Dashboard Header */}
        <section className="py-16 md:py-24 border-b border-blue-500/20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-orange-500 rounded-2xl flex items-center justify-center text-3xl">
                  👤
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">
                    Welcome, {user?.username}!
                  </h1>
                  <p className="text-gray-400 text-lg mt-2">
                    Manage all your content from one place
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 border-b border-blue-500/20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
                <p className="text-gray-400 text-sm mb-2">Total Posts</p>
                <p className="text-3xl font-bold text-blue-400">{statsLoading ? '-' : stats.total}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
                <p className="text-gray-400 text-sm mb-2">This Month</p>
                <p className="text-3xl font-bold text-orange-400">{statsLoading ? '-' : stats.thisMonth}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
                <p className="text-gray-400 text-sm mb-2">This Week</p>
                <p className="text-3xl font-bold text-green-400">{statsLoading ? '-' : stats.thisWeek}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
                <p className="text-gray-400 text-sm mb-2">Today</p>
                <p className="text-3xl font-bold text-cyan-400">{statsLoading ? '-' : stats.today}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Actions Grid */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-12">Quick Actions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dashboardItems.map((item, index) => (
                <Link key={index} href={item.href}>
                  <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-lg hover:border-white/20 hover:bg-white/10 transition-all h-full cursor-pointer">
                    {/* Background gradient on hover */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${item.color} transition-opacity duration-300`}></div>

                    {/* Content */}
                    <div className="relative p-6 h-full flex flex-col justify-between">
                      {/* Icon */}
                      <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all`}>
                        {item.icon}
                      </div>

                      {/* Text */}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                          {item.description}
                        </p>
                      </div>

                      {/* Arrow */}
                      <div className="mt-4 text-blue-400 group-hover:text-blue-300 group-hover:translate-x-2 transition-transform">
                        → Open
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Tips Section */}
        <section className="py-12 border-t border-blue-500/20">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-white mb-8">Quick Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-300 mb-2">💡 Create Post</h3>
                <p className="text-gray-400 text-sm">
                  Write engaging articles with a rich text editor. Add images, format text, and preview before publishing.
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-orange-300 mb-2">📝 Edit Posts</h3>
                <p className="text-gray-400 text-sm">
                  Update your published articles anytime. Modify content, thumbnails, and metadata with ease.
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-300 mb-2">📤 Bulk Upload</h3>
                <p className="text-gray-400 text-sm">
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
