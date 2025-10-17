'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<'admin' | 'pharmacist'>('admin');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const email = role === 'admin' ? 'admin@pharmacy.com' : 'pharmacist@pharmacy.com';
      const password = role === 'admin' ? 'admin123' : 'pharm123';

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      router.push('/dashboard');
    } catch (err: unknown) {
      console.error(err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-50 to-blue-100 items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Pharmacy Lab</h2>
          <p className="text-gray-600 text-lg">Professional inventory management system</p>
        </div>
      </div>

      {/* Right side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Fireside Pharmacy</h1>
            <p className="text-gray-600 mt-2">Log in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div className="flex gap-4 mb-6">
              <button
                type="button"
                onClick={() => setRole('pharmacist')}
                className={`flex-1 py-2 px-4 rounded-full font-medium transition-all ${
                  role === 'pharmacist'
                    ? 'bg-orange-200 text-orange-900'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pharmacist
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`flex-1 py-2 px-4 rounded-full font-medium transition-all ${
                  role === 'admin'
                    ? 'bg-orange-400 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Admin
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Demo credentials info */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
              <p className="font-semibold mb-2">Demo Credentials:</p>
              <p>Admin: admin@pharmacy.com / admin123</p>
              <p>Pharmacist: pharmacist@pharmacy.com / pharm123</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-400 text-white font-semibold py-3 rounded-full hover:bg-orange-500 transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
