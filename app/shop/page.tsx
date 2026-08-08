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

  // Selected product state for modal view/edit
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Edit mode state & form inputs
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState<{
    price: number;
    stock: number;
    category: string;
    description: string;
  }>({
    price: 0,
    stock: 0,
    category: '',
    description: '',
  });

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

  // Open modal and initialize edit form values
  const handleOpenModal = (product: Product) => {
    setSelectedProduct(product);
    setIsEditing(false);
    setEditForm({
      price: product.price || 0,
      stock: product.stock ?? 1,
      category: product.category || '',
      description: product.description || '',
    });
  };

  // Close modal and reset edit state
  const handleCloseModal = () => {
    setSelectedProduct(null);
    setIsEditing(false);
  };

  // Handle saving product changes to Supabase
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      setIsSaving(true);

      const updates = {
        price: Number(editForm.price),
        stock: Number(editForm.stock),
        category: editForm.category,
        description: editForm.description,
      };

      const { error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', selectedProduct.id);

      if (error) throw error;

      // Update state locally
      const updatedProduct = { ...selectedProduct, ...updates };
      setProducts((prev) =>
        prev.map((p) => (p.id === selectedProduct.id ? updatedProduct : p))
      );
      setSelectedProduct(updatedProduct);
      setIsEditing(false);
    } catch (err: any) {
      alert(`Failed to save changes: ${err.message || err}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this product listing?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProducts((prev) => prev.filter((p) => p.id !== id));
      if (selectedProduct?.id === id) handleCloseModal();
    } catch (err: any) {
      alert(`Delete failed: ${err.message || err}`);
    }
  };

  const renderProductMedia = (url?: string) => {
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      return (
        <img
          src={url}
          alt="Product thumbnail"
          className="w-10 h-10 object-cover rounded-lg border border-slate-100 shrink-0"
        />
      );
    }
    return (
      <span className="text-2xl bg-slate-50 p-1.5 rounded-lg border border-slate-100 flex items-center justify-center w-10 h-10 shrink-0">
        {url || '📦'}
      </span>
    );
  };

  const getStatusBadge = (stock: number = 0, statusOverride?: string) => {
    if (statusOverride && statusOverride === 'Pending Review') {
      return (
        <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded-full border text-amber-600 bg-amber-50 border-amber-100">
          Pending Review
        </span>
      );
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
    <main className="min-h-screen bg-slate-50/50 py-10 font-sans relative">
      <div className="max-w-5xl mx-auto px-4">

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
              Manage your active listings, update stock levels, and edit prices seamlessly.
            </p>
          </div>
          
          <Link
            href="/vendor/upload-product"
            className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-3 rounded-xl transition shadow-sm self-start sm:self-auto"
          >
            + Upload New Product
          </Link>
        </div>

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
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">Stock</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">Sales</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((product) => (
                    <tr 
                      key={product.id} 
                      onClick={() => handleOpenModal(product)}
                      className="hover:bg-slate-50 cursor-pointer transition group"
                    >
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
                      <td className="px-6 py-4">{getStatusBadge(product.stock ?? 1, product.status)}</td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-900">₦{product.price?.toLocaleString()}</td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-700 text-center">{product.stock ?? 1}</td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-900 text-center">{product.sales ?? 0}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            type="button"
                            className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-lg transition"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenModal(product);
                            }}
                          >
                            👁️ View / Edit
                          </button>
                          <button 
                            type="button"
                            onClick={(e) => handleDelete(e, product.id)}
                            className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 text-xs font-bold px-3 py-1.5 rounded-lg transition"
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

      {/* Expanded Interactive Product Modal */}
      {selectedProduct && (
        <div 
          className="fixed inset-0 z-[999] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-white w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col md:flex-row my-auto max-h-[90vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Section */}
            <div className="md:w-1/2 bg-slate-950 relative min-h-[280px] md:min-h-[480px] flex items-center justify-center p-6 shrink-0">
              {selectedProduct.image_url?.startsWith('http') ? (
                <img
                  src={selectedProduct.image_url}
                  alt={selectedProduct.title || selectedProduct.name}
                  className="w-full h-full max-h-[420px] object-contain rounded-2xl"
                />
              ) : (
                <span className="text-8xl">{selectedProduct.image_url || '📦'}</span>
              )}

              <button
                type="button"
                onClick={handleCloseModal}
                className="md:hidden absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold backdrop-blur-sm transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Content Details / Edit Form */}
            <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto bg-white">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                      {selectedProduct.category}
                    </span>
                    {isEditing && (
                      <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                        Editing Mode
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {!isEditing && (
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg transition"
                      >
                        ✏️ Edit Item
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="hidden md:flex text-slate-400 hover:text-slate-900 text-sm font-bold w-8 h-8 items-center justify-center rounded-full hover:bg-slate-100 transition"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <h2 className="text-2xl font-black text-slate-900 leading-tight mb-4">
                  {selectedProduct.title || selectedProduct.name}
                </h2>

                {/* EDIT FORM VIEW */}
                {isEditing ? (
                  <form id="edit-product-form" onSubmit={handleSaveProduct} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      {/* Price Field */}
                      <div>
                        <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">
                          Price (₦)
                        </label>
                        <input
                          type="number"
                          required
                          min="0"
                          value={editForm.price}
                          onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                          className="w-full text-sm font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      {/* Stock Field */}
                      <div>
                        <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">
                          Available Stock
                        </label>
                        <input
                          type="number"
                          required
                          min="0"
                          value={editForm.stock}
                          onChange={(e) => setEditForm({ ...editForm, stock: Number(e.target.value) })}
                          className="w-full text-sm font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    {/* Category Selection */}
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">
                        Category
                      </label>
                      <input
                        type="text"
                        required
                        value={editForm.category}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                        className="w-full text-xs font-semibold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">
                        Description
                      </label>
                      <textarea
                        rows={4}
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </form>
                ) : (
                  /* READ ONLY VIEW */
                  <>
                    <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4 mb-5 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-extrabold uppercase text-slate-400">Vendor</p>
                        <p className="text-xs font-bold text-slate-800">
                          {selectedProduct.vendor_name || 'Verified Cooperative Partner'}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-1 text-xs font-black text-slate-900">
                          <span className="text-amber-400 text-base">★</span>
                          <span>{selectedProduct.vendor_rating || 4.8} / 5.0</span>
                        </div>
                        <span className="text-[9px] font-bold text-emerald-600">Top Rated Seller</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl">
                        <p className="text-[10px] font-extrabold uppercase text-emerald-800">Selling Price</p>
                        <p className="text-2xl font-black text-emerald-950">
                          ₦{selectedProduct.price?.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                        <p className="text-[10px] font-extrabold uppercase text-slate-400">In Stock</p>
                        <p className="text-2xl font-black text-slate-900">
                          {selectedProduct.stock ?? 1} units
                        </p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <p className="text-[10px] font-extrabold uppercase text-slate-400 mb-1.5">Description</p>
                      <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50/50 p-4 rounded-2xl border border-slate-100 max-h-48 overflow-y-auto">
                        {selectedProduct.description || 'No detailed description provided for this product.'}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      form="edit-product-form"
                      disabled={isSaving}
                      className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDelete(e, selectedProduct.id)}
                      className="py-3 px-5 bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 rounded-xl text-xs font-bold transition"
                    >
                      Delete Item
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
