'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { name: 'Overage', value: 1389 },
  { name: 'Dispensed', value: 2598 },
  { name: 'Returned', value: 872 },
  { name: 'Shortage', value: 4589 },
  { name: 'Total Item', value: 3456 },
  { name: 'Stock Item', value: 1055 },
];

interface User {
  name: string;
  email: string;
}

interface Stats {
  dispensed: number;
  medicineShotage: number;
  medicineOverage: number;
  medicineExpired: number;
}

export default function DashboardPage() {
  const router = useRouter();

  // Only keep state variables you actually use
  const [user, setUser] = useState<User | null>(null);
  const [stats, _setStats] = useState<Stats>({
    dispensed: 58,
    medicineShotage: 62,
    medicineOverage: 28,
    medicineExpired: 22,
  });

  useEffect(() => {
    // Example of updating stats after fetching data
    const fetchData = async () => {
      const newStats: Stats = {
        dispensed: 60,
        medicineShotage: 50,
        medicineOverage: 30,
        medicineExpired: 20,
      };
      _setStats(newStats);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/auth/login');
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 w-64 h-screen bg-white border-r border-gray-200 p-6 overflow-y-auto">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-orange-400 rounded-lg flex items-center justify-center text-white font-bold">
            F
          </div>
          <span className="font-bold text-gray-900 text-sm">FIRESIDE PHARMACY</span>
        </div>

        <nav className="space-y-2 mb-8">
          <a
            href="/dashboard"
            className="block px-4 py-3 rounded-full bg-orange-100 text-orange-900 font-medium"
          >
            📊 Overview
          </a>
          <a
            href="/inventory"
            className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-full"
          >
            📦 Inventory
          </a>
          <a
            href="#"
            className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-full"
          >
            🤝 Suppliers
          </a>
          <a
            href="#"
            className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-full"
          >
            👨‍⚕️ Pharmacists
          </a>
          <a
            href="#"
            className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-full"
          >
            🏪 Manage Stores
          </a>
        </nav>

        <div className="border-t border-gray-200 pt-4">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 bg-orange-100 text-orange-900 rounded-full font-medium hover:bg-orange-200"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
          <div className="flex items-center gap-4">
            {user && (
              <>
                <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center text-white font-semibold">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl p-8 text-white mb-6">
            <h2 className="text-2xl font-bold mb-2">Welcome To Our Inventory</h2>
            <p className="opacity-90 mb-4">
              Explore The Latest Trends, Shop our curated collections, and enjoy exclusive discounts and Offers
            </p>
            <button className="px-6 py-2 bg-white text-orange-500 rounded-full font-semibold hover:bg-gray-100">
              Start Organizing Now →
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Dispensed</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.dispensed}</p>
                  <a href="/inventory" className="text-blue-600 text-xs hover:underline mt-2">
                    View Detailed Report →
                  </a>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-2xl">
                  💊
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Medicines Shortage</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.medicineShotage}</p>
                  <a href="#" className="text-blue-600 text-xs hover:underline mt-2">
                    Resolved Now →
                  </a>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-2xl">
                  ⚠️
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Medicines Overage</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.medicineOverage}</p>
                  <a href="#" className="text-blue-600 text-xs hover:underline mt-2">
                    Resolved Now →
                  </a>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-2xl">
                  📈
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Medicines Expired</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.medicineExpired}</p>
                  <a href="#" className="text-blue-600 text-xs hover:underline mt-2">
                    Resolved Now →
                  </a>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-2xl">
                  ❌
                </div>
              </div>
            </div>
          </div>

          {/* Quick Report Chart */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Quick Report</h3>
              <a href="/inventory" className="text-blue-600 hover:underline text-sm">
                View All →
              </a>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#fb923c" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
