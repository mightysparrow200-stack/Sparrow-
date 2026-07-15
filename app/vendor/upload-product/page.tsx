'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function VendorUploadPage() {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'General',
    quantity: '',
    description: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Handle text inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image selection & preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API database save
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      // Reset form
      setFormData({ name: '', price: '', category: 'General', quantity: '', description: '' });
      setImage(null);
      setPreviewUrl(null);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-slate-50/50 py-10 font-sans">
      <div className="max-w-2xl mx-auto px-4">
        
        {/* Breadcrumb & Navigation */}
        <div className="mb-6">
          <Link href="/dashboard" className="text-xs font-bold text-emerald-600 hover:underline">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-2">Upload New Product</h1>
          <p className="text-xs text-slate-500">
            List a new product or deal on the Mighty Sparrow Alumni Cooperative marketplace.
          </p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center justify-between">
            <span>🎉 Product uploaded successfully and is now live on the marketplace!</span>
            <button onClick={() => setSuccess(false)} className="underline hover:text-emerald-950">Dismiss</button>
          </div>
        )}

        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
          
          {/* Product Image Dropzone */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Product Image
            </label>
            <div className="border-2 border-dashed border-slate-200 hover:border-emerald-500 transition rounded-2xl p-6 text-center cursor-pointer relative bg-slate-50/50">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                required={!previewUrl}
              />
              {previewUrl ? (
                <div className="flex flex-col items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt="Preview" className="h-32 w-32 object-cover rounded-xl mb-2 border border-slate-100" />
                  <span className="text-[10px] text-slate-500 font-semibold">Tap to change image</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="text-2xl block">📸</span>
                  <span className="block text-xs font-bold text-slate-700">Upload Product Photo</span>
                  <span className="block text-[10px] text-slate-400">Supports PNG, JPG, or WEBP up to 5MB</span>
                </div>
              )}
            </div>
          </div>

          {/* Grid fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product Name */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Premium Co-op Rice Bag"
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="Groceries">🌾 Groceries & Provisions</option>
                <option value="Apparel">👕 Merchandise & Apparel</option>
                <option value="Electronics">📱 Electronics & Devices</option>
                <option value="General">📦 General Household</option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Price (₦)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g. 35000"
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                required
              />
            </div>

            {/* Available Quantity */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Available Stock Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="e.g. 50"
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Product Description & Specifications
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Provide a detailed description of the product, terms of delivery, and member benefit discounts..."
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              required
            ></textarea>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Link
              href="/dashboard"
              className="px-5 py-3 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-3 rounded-xl transition shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? 'Uploading...' : 'Publish Product'}
            </button>
          </div>

        </form>

      </div>
    </main>
  );
}
