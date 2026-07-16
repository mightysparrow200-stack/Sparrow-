'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCoOp } from '../../CoOpState'; // Adjusted import path to reach your State hook

export default function VendorUploadPage() {
  const context = useCoOp();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '🌾 Groceries & Provisions',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!context) return null;
  const { addVendorProduct } = context;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess(false);

    // Call state context function to insert into active shop list
    addVendorProduct({
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      desc: formData.description,
      img: '📦' // Fallback emoji
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setFormData({ name: '', price: '', category: '🌾 Groceries & Provisions', description: '' });
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-slate-50/50 py-10 font-sans">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-1">
            <span className="text-slate-600">Vendor Portal</span>
            <span>/</span>
            <span className="text-slate-600">Upload Product</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Upload New Product</h1>
          <p className="text-xs text-slate-500">
            List your items to make them available to the cooperative marketplace.
          </p>
        </div>

        {/* --- DIRECT PORTAL NAVIGATION LINKS --- */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white border border-slate-100 p-2 rounded-2xl shadow-sm">
          <Link 
            href="/vendor/inventory" 
            className="flex-1 text-center py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition"
          >
            📦 My Inventory
          </Link>
          
          <button 
            disabled 
            className="flex-1 text-center py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-default"
          >
            ➕ Upload Product
          </button>
          
          <Link 
            href="/vendor/profile" 
            className="flex-1 text-center py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition"
          >
            👤 Profile & Payouts
          </Link>
        </div>

        {/* Upload Form Container */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm max-w-2xl">
          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3">
              <span className="text-xl">✅</span>
              <div>
                <h4 className="text-xs font-bold text-emerald-950">Product listed successfully!</h4>
                <p className="text-[10px] text-emerald-700">It is now live and available in the active shop list.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Product Name */}
            <div>
              <label htmlFor="name" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Product Title
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Cooperative Rice Scheme - 25kg"
                className="w-full text-xs font-semibold text-slate-900 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition"
              />
            </div>

            {/* Price & Category Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Selling Price (₦)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. 30000"
                  className="w-full text-xs font-semibold text-slate-900 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full text-xs font-semibold text-slate-900 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 bg-white transition"
                >
                  <option value="🌾 Groceries & Provisions">🌾 Groceries & Provisions</option>
                  <option value="👕 Merchandise & Apparel">👕 Merchandise & Apparel</option>
                  <option value="📦 General Household">📦 General Household</option>
                  <option value="🩺 Health & Personal Care">🩺 Health & Personal Care</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the product, benefits, and delivery timeline..."
                className="w-full text-xs font-medium text-slate-900 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition resize-none"
              />
            </div>

            {/* Submit Actions */}
            <div className="flex items-center gap-3 pt-2">
              <Link
                href="/vendor/inventory"
                className="flex-1 py-3 border border-slate-200 text-slate-750 text-center rounded-xl text-xs font-bold hover:bg-slate-50 transition"
              >
                View Inventory
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-xl text-xs font-bold shadow-sm transition"
              >
                {isSubmitting ? 'Uploading...' : 'Publish Product'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </main>
  );
}
