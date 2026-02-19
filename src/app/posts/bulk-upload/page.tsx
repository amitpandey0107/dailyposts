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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />

      <main className="grow max-w-4xl mx-auto px-4 w-full py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Bulk Upload Posts</h1>
          <p className="text-gray-600">Import multiple posts from CSV or Excel file</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
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

              {/* File Upload */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-900 mb-4">
                  Choose File <span className="text-red-600">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition cursor-pointer relative bg-linear-to-br from-blue-50 to-purple-50">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".csv,.xlsx,.xls"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    required
                  />
                  <div className="pointer-events-none">
                    <p className="text-4xl mb-2">📁</p>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      {fileName || 'Click to select or drag and drop'}
                    </p>
                    <p className="text-xs text-gray-500">CSV or Excel (.csv, .xlsx, .xls) - Max 5MB</p>
                  </div>
                </div>
              </div>

              {/* File Format Help */}
              <div className="bg-blue-50 rounded-lg p-6 mb-8 border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-3">📋 Required CSV Format</h3>
                <p className="text-sm text-blue-800 mb-3">Your file must have these columns in the first row:</p>
                <div className="bg-white p-3 rounded font-mono text-xs text-gray-700 overflow-x-auto">
                  <code>title,excerpt,content,author,category,thumbnail</code>
                </div>
                <p className="text-sm text-blue-800 mt-3">• <strong>title</strong>: Post title (required)</p>
                <p className="text-sm text-blue-800">• <strong>excerpt</strong>: Short summary (required)</p>
                <p className="text-sm text-blue-800">• <strong>content</strong>: Full post content (required)</p>
                <p className="text-sm text-blue-800">• <strong>author</strong>: Author name (optional, default: Satish Mehta)</p>
                <p className="text-sm text-blue-800">• <strong>category</strong>: Category name (required)</p>
                <p className="text-sm text-blue-800">• <strong>thumbnail</strong>: Image URL (optional)</p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 font-semibold transition-all shadow-lg"
              >
                {loading ? '🔄 Uploading...' : '📤 Upload Posts'}
              </button>
            </form>
          </div>

          {/* File Preview & Results */}
          <div className="space-y-6">
            {/* File Preview */}
            {filePreview.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">📄 File Preview</h3>
                <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                  {filePreview.map((line, idx) => (
                    <p key={idx} className="text-xs text-gray-700 font-mono mb-2 truncate">
                      {line || '(empty line)'}
                    </p>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-3">Showing first 6 rows...</p>
              </div>
            )}

            {/* Upload Results */}
            {result && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-600">
                <h3 className="font-semibold text-gray-900 mb-4">📊 Upload Results</h3>
                
                <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-2xl font-bold text-green-600 mb-1">{result.successCount}</p>
                  <p className="text-sm text-green-800">posts imported successfully</p>
                </div>

                {result.errors.length > 0 && (
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm font-semibold text-yellow-900 mb-2">⚠️ Issues ({result.errors.length})</p>
                    <ul className="text-xs text-yellow-800 space-y-1 max-h-48 overflow-y-auto">
                      {result.errors.map((err, idx) => (
                        <li key={idx}>• {err}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Example Box */}
            <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-6 border border-purple-200">
              <h3 className="font-semibold text-gray-900 mb-4">💡 Example CSV Row</h3>
              <div className="text-xs font-mono text-gray-700 space-y-1 overflow-x-auto">
                <p className="text-purple-600 font-semibold">CSV Header:</p>
                <code className="block">title,excerpt,content,author,category,thumbnail</code>
                <p className="text-purple-600 font-semibold mt-3">Example Data:</p>
                <code className="block">AI Revolution,AI is changing the world,Full article content here...,Satish Mehta,AI & Future,https://example.com/img.jpg</code>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
