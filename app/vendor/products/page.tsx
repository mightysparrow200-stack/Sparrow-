'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Product {
  id: string;
  title?: string;
  name?: string;
  category: string;
  price: number;
  stock?: number;
  status?: string;
  sales?: number;
  description?: string;
  image_url?: string;
  vendor_name?: string;
  vendor_rating?: number;
}

export default function VendorProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Selected product state for expanded modal view
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Fetch products from Supabase on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProducts(data || []);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent opening modal when clicking delete
    if (!confirm('Are you sure you want to delete this product listing?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update UI optimistically after deletion
      setProducts((prev) => prev.filter((p) => p.id !== id));
      if (selectedProduct?.id === id) setSelectedProduct(null);
    } catch (err: any) {
      alert(`Delete failed: ${err.message || err}`);
    }
  };

  // Helper to render image or fallback icon
  const renderProductMedia = (url?: string) => {
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      return (
        <img
          src={url}
          alt="Product thumbnail"
          className="w-10 h-10 object-cover rounded-lg border border-slate-100"
        />
      );
    }
    return (
      <span className="text-2xl bg-slate-50 p-1.5 rounded-lg border border-slate-100 flex items-center justify-center w-10 h-10">
        {url || '📦'}
      </span>
    );
  };

  // Helper for status badge formatting
  const getStatusBadge = (stock: number = 0, statusOverride?: string) => {
    if (statusOverride) {
      if (statusOverride === 'Pending Review') {
        return (
          <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded-full border text-amber-600 bg-amber-50 border-amber-100">
            Pending Review
          </span>
        );
      }
    }

    if (stock === 0) {
      return (
        <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded-full border text-rose-600 bg-rose-50 border-rose-100">
          Out of Stock
        </span>
      );
    }

    return (
      <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded-full border text-emerald-600 bg-emerald-50 border-emerald-100">
        Active
      </span>
    );
  };

  return (
    <main className="min-h-screen bg-slate-50/50 py-10 font-sans">
      <div className="max-w-4xl mx-auto px-4">

        {/* Dashboard Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-1">
              <span className="text-slate-600">Vendor Portal</span>
              <span>/</span>
              <span className="text-slate-600">My Products</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Your Uploaded Products</h1>
            <p className="text-xs text-slate-500">
              Manage your active listings, track total sales, and click any item to view details.
            </p>
          </div>
          
          <Link
            href="/vendor/upload-product"
            className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-3 rounded-xl transition shadow-sm self-start sm:self-auto"
          >
            + Upload New Product
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white border border-slate-100 p-2 rounded-2xl shadow-sm">
          <button 
            type="button"
            disabled 
            className="flex-1 text-center py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-default"
          >
            📦 My Products
          </button>
          
          <Link 
            href="/vendor/upload-product" 
            className="flex-1 text-center py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition"
          >
            ➕ Upload Product
          </Link>
          
          <Link 
            href="/vendor/profile" 
            className="flex-1 text-center py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition"
          >
            👤 Profile & Payouts
          </Link>
        </div>

        {/* Error State Banner */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <h4 className="text-xs font-bold text-rose-950">Database Error</h4>
                <p className="text-[10px] text-rose-700">{errorMsg}</p>
              </div>
            </div>
            <button 
              onClick={fetchProducts}
              className="text-xs font-bold text-rose-700 underline hover:text-rose-900"
            >
              Retry
            </button>
          </div>
        )}

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Items</span>
            <span className="text-lg font-bold text-slate-900">{products.length}</span>
          </div>
          <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Deals</span>
            <span className="text-lg font-bold text-emerald-600">
              {products.filter((p) => (p.stock === undefined || p.stock > 0) && p.status !== 'Pending Review').length}
            </span>
          </div>
          <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Units Sold</span>
            <span className="text-lg font-bold text-slate-950">
              {products.reduce((acc, curr) => acc + (curr.sales || 0), 0)}
            </span>
          </div>
        </div>

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm">
            <div className="w-6 h-6 border-2 border-slate-300 border-t-emerald-600 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-500 font-medium">Loading inventory from Supabase...</p>
          </div>
        ) : products.length === 0 ? (
          /* Empty State */
          <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm">
            <div className="text-4xl mb-4">🏪</div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">No products uploaded yet</h3>
            <p className="text-xs text-slate-400 mb-6">Get started by listing your first product for the cooperative community.</p>
            <Link 
              href="/vendor/upload-product" 
              className="inline-block bg-emerald-600 text-white text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition"
            >
              Upload Product
            </Link>
          </div>
        ) : (
          /* Inventory Table */
          <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100">
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Product</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Price</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">Rating</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">Sales</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((product) => (
                    <tr 
                      key={product.id} 
                      onClick={() => setSelectedProduct(product)}
                      className="hover:bg-slate-50/50 cursor-pointer transition group"
                    >
                      
                      {/* Product Name & Category */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {renderProductMedia(product.image_url)}
                          <div>
                            <span className="block text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition">
                              {product.title || product.name}
                            </span>
                            <span className="block text-[10px] text-slate-400">{product.category}</span>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        {getStatusBadge(product.stock ?? 1, product.status)}
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 text-xs font-bold text-slate-900">
                        ₦{product.price?.toLocaleString()}
                      </td>

                      {/* Vendor Rating */}
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                          <span className="text-amber-400">★</span>
                          <span>{product.vendor_rating || 4.8}</span>
                        </span>
                      </td>

                      {/* Units Sold */}
                      <td className="px-6 py-4 text-xs font-bold text-slate-900 text-center">
                        {product.sales ?? 0}
                      </td>

                      {/* Management Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button 
                            type="button"
                            className="text-emerald-600 hover:text-emerald-800 text-xs font-semibold transition"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProduct(product);
                            }}
                          >
                            Expand
                          </button>
                          <span className="text-slate-200">|</span>
                          <button 
                            type="button"
                            onClick={(e) => handleDelete(e, product.id)}
                            className="text-rose-400 hover:text-rose-600 text-xs font-semibold transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Expanded Product Detail Modal */}
      {selectedProduct && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div 
            className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col md:flex-row max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Area */}
            <div className="md:w-1/2 bg-slate-50 relative min-h-[220px] md:min-h-full flex items-center justify-center p-4">
              {selectedProduct.image_url?.startsWith('http') ? (
                <img
                  src={selectedProduct.image_url}
                  alt={selectedProduct.title || selectedProduct.name}
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <span className="text-6xl">{selectedProduct.image_url || '📦'}</span>
              )}
              
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                aria-label="Close product view"
                className="md:hidden absolute top-3 right-3 bg-slate-900/70 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
              <div>
                {/* Header Actions */}
                <div className="hidden md:flex justify-between items-center mb-4">
                  <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full">
                    {selectedProduct.category}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(null)}
                    aria-label="Close dialog"
                    className="text-slate-400 hover:text-slate-700 text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-100 transition"
                  >
                    ✕
                  </button>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-slate-900 leading-tight mb-2">
                  {selectedProduct.title || selectedProduct.name}
                </h2>

                {/* Vendor Rating Box */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-400">Vendor</p>
                    <p className="text-xs font-bold text-slate-800">
                      {selectedProduct.vendor_name || 'Verified Cooperative Vendor'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-900">
                      <span className="text-amber-400 text-sm">★</span>
                      <span>{selectedProduct.vendor_rating || 4.8} / 5.0</span>
                    </div>
                    <p className="text-[9px] text-emerald-600 font-semibold">Top Rated</p>
                  </div>
                </div>

                {/* Price & Stock Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-slate-50/60 p-3 rounded-xl">
                    <p className="text-[10px] font-bold uppercase text-slate-400">Price</p>
                    <p className="text-lg font-black text-slate-900">
                      ₦{selectedProduct.price?.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-slate-50/60 p-3 rounded-xl">
                    <p className="text-[10px] font-bold uppercase text-slate-400">Total Sold</p>
                    <p className="text-lg font-black text-slate-900">
                      {selectedProduct.sales || 0} units
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Description</p>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                    {selectedProduct.description || 'No description provided for this product.'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="flex-1 py-3 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={(e) => handleDelete(e, selectedProduct.id)}
                  className="py-3 px-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-100 transition"
                >
                  Delete Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
