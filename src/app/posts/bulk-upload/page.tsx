'use client';

import { FormEvent, useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface UploadResult {
  successCount: number;
  errors: string[];
}

export default function BulkUpload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [result, setResult] = useState<UploadResult | null>(null);
  const [fileName, setFileName] = useState('');
  const [filePreview, setFilePreview] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    const fileName = file.name.toLowerCase();
    const isValidType = validTypes.some(type => file.type.includes(type.split('/')[1])) || 
                        fileName.endsWith('.csv') || 
                        fileName.endsWith('.xlsx') || 
                        fileName.endsWith('.xls');

    if (!isValidType) {
      setError('Please upload a valid CSV or Excel file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setFileName(file.name);
    setError('');
    setSuccess('');
    setResult(null);

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').slice(0, 6);
      setFilePreview(lines);
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setResult(null);

    try {
      const fileInput = (e.target as HTMLFormElement).querySelector('input[type="file"]') as HTMLInputElement;
      const file = fileInput?.files?.[0];

      if (!file) {
        setError('Please select a file to upload');
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/bulk-upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload posts');
      }

      const data = await response.json();
      setResult({
        successCount: data.successCount,
        errors: data.errors || [],
      });
      
      if (data.successCount > 0) {
        setSuccess(`✅ Successfully imported ${data.successCount} posts!`);
      }
      
      // Reset form
      fileInput.value = '';
      setFileName('');
      setFilePreview([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload posts');
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      <Navigation />

      <main className="grow max-w-6xl mx-auto px-4 w-full py-12">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <div className="inline-block mb-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-blue-500 to-purple-500">
              <span className="text-3xl">📦</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-3 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Bulk Upload Posts
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Import multiple posts from CSV or Excel file in seconds
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-white/10 space-y-8">
              {error && (
                <div className="bg-red-500/10 border-2 border-red-500/30 rounded-xl p-4 flex gap-3 backdrop-blur-sm">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <h3 className="font-semibold text-red-400">Error</h3>
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {success && (
                <div className="bg-green-500/10 border-2 border-green-500/30 rounded-xl p-4 flex gap-3 backdrop-blur-sm">
                  <span className="text-2xl">✅</span>
                  <div>
                    <h3 className="font-semibold text-green-400">Success</h3>
                    <p className="text-green-300 text-sm">{success}</p>
                  </div>
                </div>
              )}

              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-4">
                  Choose File <span className="text-red-400">*</span>
                </label>
                <div className="border-2 border-dashed border-blue-500/50 rounded-2xl p-8 text-center hover:border-blue-400 transition cursor-pointer relative bg-linear-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".csv,.xlsx,.xls"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    required
                  />
                  <div className="pointer-events-none">
                    <p className="text-5xl mb-4">📁</p>
                    <p className="text-sm font-medium text-gray-200 mb-2">
                      {fileName || 'Click to select or drag and drop'}
                    </p>
                    <p className="text-xs text-gray-400">CSV or Excel (.csv, .xlsx, .xls) - Max 5MB</p>
                  </div>
                </div>
              </div>

              {/* File Format Help */}
              <div className="bg-blue-500/10 rounded-2xl p-6 border border-blue-500/30 backdrop-blur-sm">
                <h3 className="font-semibold text-blue-300 mb-3 flex items-center gap-2">
                  <span className="text-xl">📋</span> Required CSV Format
                </h3>
                <p className="text-sm text-blue-200 mb-4">Your file must have these columns in the first row:</p>
                <div className="bg-white/10 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto border border-white/10 mb-4">
                  <code>title,excerpt,content,author,category,thumbnail</code>
                </div>
                <div className="space-y-2 text-sm text-blue-200">
                  <p>• <strong>title</strong>: Post title (required)</p>
                  <p>• <strong>excerpt</strong>: Short summary (required)</p>
                  <p>• <strong>content</strong>: Full post content (required)</p>
                  <p>• <strong>author</strong>: Author name (optional, default: Satish Mehta)</p>
                  <p>• <strong>category</strong>: Category name (required)</p>
                  <p>• <strong>thumbnail</strong>: Image URL (optional)</p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-600 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl disabled:shadow-none transform hover:scale-105 disabled:scale-100 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⏳</span> Uploading...
                  </>
                ) : (
                  <>
                    <span>📤</span> Upload Posts
                  </>
                )}
              </button>
            </form>
          </div>

          {/* File Preview & Results */}
          <div className="space-y-6">
            {/* File Preview */}
            {filePreview.length > 0 && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <span>📄</span> File Preview
                </h3>
                <div className="bg-white/5 rounded-lg p-4 max-h-64 overflow-y-auto border border-white/10">
                  {filePreview.map((line, idx) => (
                    <p key={idx} className="text-xs text-gray-300 font-mono mb-2 truncate">
                      {line || '(empty line)'}
                    </p>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-3">Showing first 6 rows...</p>
              </div>
            )}

            {/* Upload Results */}
            {result && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-green-500/30 p-6">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <span>📊</span> Upload Results
                </h3>
                
                <div className="mb-4 p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                  <p className="text-3xl font-bold text-green-400 mb-1">{result.successCount}</p>
                  <p className="text-sm text-green-300">posts imported successfully</p>
                </div>

                {result.errors.length > 0 && (
                  <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                    <p className="text-sm font-semibold text-yellow-300 mb-2">⚠️ Issues ({result.errors.length})</p>
                    <ul className="text-xs text-yellow-300 space-y-1 max-h-48 overflow-y-auto">
                      {result.errors.map((err, idx) => (
                        <li key={idx}>• {err}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Example Box */}
            <div className="bg-linear-to-br from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/30 p-6 backdrop-blur-sm">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <span>💡</span> Example CSV Row
              </h3>
              <div className="text-xs font-mono text-gray-300 space-y-2 overflow-x-auto">
                <p className="text-purple-300 font-semibold">CSV Header:</p>
                <code className="block bg-white/5 p-2 rounded border border-white/10">title,excerpt,content,author,category,thumbnail</code>
                <p className="text-purple-300 font-semibold mt-3">Example Data:</p>
                <code className="block bg-white/5 p-2 rounded border border-white/10 break-all">AI Revolution,AI is changing the world,Full article content here...,Satish Mehta,AI & Future,https://example.com/img.jpg</code>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
