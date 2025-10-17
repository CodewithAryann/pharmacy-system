'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  productName: string;
  ndc: string;
  supplierName: string;
  quantity: number;
  store: string;
  total: number;
  productGroup?: string;
  dispensed?: number;
  storage?: number;
  overage?: number;
  return?: number;
}

interface User {
  name: string;
  email: string;
  role: string;
}

export default function InventoryPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    productName: '',
    ndc: '',
    supplierName: '',
    quantity: '',
    store: '',
    total: '',
    productGroup: '',
    dispensed: '',
    storage: '',
    overage: '',
    return: '',
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/auth/login');
      return;
    }
    setUser(JSON.parse(storedUser));
    fetchProducts();
  }, [router, currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`/api/products?page=${currentPage}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('auth_token');
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/products/${editingId}` : '/api/products';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowAddModal(false);
        setEditingId(null);
        setFormData({
          productName: '',
          ndc: '',
          supplierName: '',
          quantity: '',
          store: '',
          total: '',
          productGroup: '',
          dispensed: '',
          storage: '',
          overage: '',
          return: '',
        });
        fetchProducts();
      }
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      productName: product.productName,
      ndc: product.ndc,
      supplierName: product.supplierName,
      quantity: product.quantity.toString(),
      store: product.store,
      total: product.total.toString(),
      productGroup: product.productGroup || '',
      dispensed: (product.dispensed || 0).toString(),
      storage: (product.storage || 0).toString(),
      overage: (product.overage || 0).toString(),
      return: (product.return || 0).toString(),
    });
    setEditingId(product.id);
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

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
          <div className="w-8 h-8 bg-orange-400 rounded-lg flex items-center justify-center text-white font-bold">F</div>
          <span className="font-bold text-gray-900 text-sm">FIRESIDE PHARMACY</span>
        </div>

        <nav className="space-y-2 mb-8">
          <a href="/dashboard" className="block px-4 py-3 rounded-full text-gray-700 hover:bg-gray-100">
            📊 Overview
          </a>
          <a href="/inventory" className="block px-4 py-3 rounded-full bg-orange-100 text-orange-900 font-medium">
            📦 Inventory
          </a>
          <a href="#" className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-full">
            🤝 Suppliers
          </a>
          <a href="#" className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-full">
            👨‍⚕️ Pharmacists
          </a>
          <a href="#" className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-full">
            🏪 Manage Stores
          </a>
        </nav>

        <div className="border-t border-gray-200 pt-4">
          <button onClick={handleLogout} className="w-full px-4 py-3 bg-orange-100 text-orange-900 rounded-full font-medium hover:bg-orange-200">
            Log Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search Product, Supplier, Order"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50"
            />
            {user && (
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center text-white font-semibold">
                  {user.name?.charAt(0) || 'U'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Groups</p>
                  <p className="text-2xl font-bold text-gray-900">14</p>
                  <a href="#" className="text-blue-600 text-xs hover:underline">View Inventory →</a>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">📦</div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Medicines</p>
                  <p className="text-2xl font-bold text-gray-900">868</p>
                  <a href="#" className="text-blue-600 text-xs hover:underline">View Inventory →</a>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">💊</div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Medicines Expired</p>
                  <p className="text-2xl font-bold text-gray-900">50</p>
                  <a href="#" className="text-blue-600 text-xs hover:underline">View Inventory →</a>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">❌</div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Dispensed</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                  <a href="#" className="text-blue-600 text-xs hover:underline">View Inventory →</a>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">📋</div>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Quick Report</h3>
              <button
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    productName: '',
                    ndc: '',
                    supplierName: '',
                    quantity: '',
                    store: '',
                    total: '',
                    productGroup: '',
                    dispensed: '',
                    storage: '',
                    overage: '',
                    return: '',
                  });
                  setShowAddModal(true);
                }}
                className="px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500"
              >
                + Add Product
              </button>
            </div>

            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading products...</div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">ID No.</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Product Name</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">NDC</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Supplier</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Quantity</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Store</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Total</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {products.map((product, index) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">#37{String(index + 1).padStart(3, '0')}</td>
                          <td className="px-6 py-4 text-sm text-gray-900 font-medium">{product.productName}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{product.ndc}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{product.supplierName}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{product.quantity}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{product.store}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{product.total}</td>
                          <td className="px-6 py-4 text-sm flex gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="text-blue-600 hover:text-blue-900 font-medium"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="text-red-600 hover:text-red-900 font-medium"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingId ? 'Edit Product' : 'Add Product'}
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-600 hover:text-gray-900 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                />
                <input
                  type="text"
                  placeholder="NDC"
                  value={formData.ndc}
                  onChange={(e) => setFormData({ ...formData, ndc: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                />
                <input
                  type="text"
                  placeholder="Supplier Name"
                  value={formData.supplierName}
                  onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                />
                <input
                  type="text"
                  placeholder="Store"
                  value={formData.store}
                  onChange={(e) => setFormData({ ...formData, store: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                />
                <input
                  type="number"
                  placeholder="Total"
                  value={formData.total}
                  onChange={(e) => setFormData({ ...formData, total: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500"
                >
                  {editingId ? 'Update' : 'Add'} Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}