'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCoOp } from '../../CoOpState'; // Adjusted import path to reach your State hook
import { supabase } from '@/lib/supabase'; // Connected directly to your lib/supabase.ts file

export default function VendorUploadPage() {
  const context = useCoOp();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '🌾 Groceries & Provisions',
    description: '',
  });
  
  // Image Upload State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!context) return null;
  const { addVendorProduct } = context;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle local image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Remove selected image preview
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess(false);

    let imageUrl = '📦'; // Fallback if no photo is selected

    // 1. Upload Image to Supabase Storage (if selected)
    if (imageFile) {
      try {
        const filePath = `products/${Date.now()}_${imageFile.name.replace(/\s+/g, '_')}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images') // Make sure this bucket exists in your Supabase Dashboard
          .upload(filePath, imageFile);

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        // Retrieve public URL for rendered output
        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        imageUrl = urlData.publicUrl;
      } catch (err: any) {
        alert(`Image upload failed: ${err.message || err}`);
        setIsSubmitting(false);
        return;
      }
    }

    // 2. Add product to context state
    addVendorProduct({
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      desc: formData.description,
      img: imageUrl,
    });

    setIsSubmitting(false);
    setSuccess(true);
    
    // Reset Form & Image State
    setFormData({ name: '', price: '', category: '🌾 Groceries & Provisions', description: '' });
    setImageFile(null);
    setImagePreview(null);
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
            href="/vendor/products" 
            className="flex-1 text-center py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition"
          >
            📦 My Products
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
            {/* Product Title */}
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

            {/* Product Image Field */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Product Image
              </label>
              
              <div className="flex items-center gap-4">
                {imagePreview ? (
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 group">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-1 right-1 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] transition"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 transition">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <span className="text-2xl mb-1">📸</span>
                      <p className="text-xs text-slate-600 font-medium">Click to upload product photo</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, or WEBP (MAX. 5MB)</p>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange} 
                      className="hidden" 
                    />
                  </label>
                )}
              </div>
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
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  'Publish Product'
                )}
              </button>
            </div>
          </form>
        </div>

      </div>
    </main>
  );
          }
