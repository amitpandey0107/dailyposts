'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const router = useRouter();
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await register(username, email, password, confirmPassword);
      } else {
        await login(username, password);
      }
      router.push('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center relative p-4">
      {/* Back to Home Link */}
      <div className="absolute top-6 left-6 z-20">
        <Link href="/" className="flex items-center gap-2 text-red-700 hover:text-red-800 transition-colors font-medium">
          <span>←</span> Back to Home
        </Link>
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white border border-gray-300 rounded-xl shadow-lg p-8">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="text-4xl font-bold text-red-700 mb-4">📝</div>
            <h1 className="text-3xl font-bold text-gray-900 text-center font-serif">
              Daily Post
            </h1>
            <p className="text-gray-600 text-sm text-center mt-1">
              {isRegister ? 'Create your account' : 'Welcome back'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                {isRegister ? 'Username' : 'Username or Email'}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={isRegister ? 'Choose a username' : 'Enter your username'}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-red-700 focus:ring-2 focus:ring-red-200 transition-colors"
                required
              />
            </div>

            {/* Email Field (Register Only) */}
            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-red-700 focus:ring-2 focus:ring-red-200 transition-colors"
                  required
                />
              </div>
            )}

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isRegister ? 'Choose a strong password' : 'Enter your password'}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-red-700 focus:ring-2 focus:ring-red-200 transition-colors"
                required
              />
            </div>

            {/* Confirm Password Field (Register Only) */}
            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-red-700 focus:ring-2 focus:ring-red-200 transition-colors"
                  required
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3 bg-red-700 hover:bg-red-800 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-all transform hover:scale-105 active:scale-95 disabled:scale-100 shadow-md"
            >
              {loading ? 'Processing...' : (isRegister ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          {/* Toggle Register/Login */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError('');
                  setUsername('');
                  setEmail('');
                  setPassword('');
                  setConfirmPassword('');
                }}
                className="ml-1 text-red-700 hover:text-red-800 font-semibold transition-colors"
              >
                {isRegister ? 'Sign In' : 'Create Account'}
              </button>
            </p>
          </div>

          {/* Footer Info */}
          <div className="mt-8 pt-6 border-t border-gray-300 text-center">
            <p className="text-gray-600 text-xs">
              This is a secure login page. Your credentials are encrypted.
            </p>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-6 p-4 bg-red-50 border border-red-300 rounded-lg">
          <p className="text-red-700 text-sm text-center">
            Demo credentials: <br/>
            <strong>Username:</strong> demo | <strong>Password:</strong> password123
          </p>
        </div>
      </div>
    </div>
  );
}
