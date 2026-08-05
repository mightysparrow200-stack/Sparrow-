'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface VendorInfo {
  id: string;
  business_name: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface Product {
  id: string;
  title: string;
  price: number;
  stock: number;
  category?: string;
  image_url?: string;
}

export default function VendorDashboard() {
  const [vendor, setVendor] = useState<VendorInfo | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // New Product Modal/Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('1');
  const [category, setCategory] = useState('General');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchVendorData();
  }, []);

  async function fetchVendorData() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      const { data: vendorData } = await supabase
        .from('vendors')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (vendorData) {
        setVendor(vendorData);

        if (vendorData.status === 'approved') {
          const { data: prodData } = await supabase
            .from('products')
            .select('*')
            .eq('vendor_id', vendorData.id)
            .order('created_at', { ascending: false });

          setProducts(prodData || []);
        }
      }
    } catch (err) {
      console.error('Error fetching vendor data:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor) return;

    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('products')
        .insert({
          vendor_id: vendor.id,
          user_id: user?.id,
          title: title,
          price: parseFloat(price),
          stock: parseInt(stock, 10),
          category: category,
          description: description,
          image_url: imageUrl || 'https://via.placeholder.com/300',
          is_published: true, // Visible on the marketplace immediately
        })
        .select()
        .single();

      if (error) throw error;

      alert('Product listed successfully! It is now live on the marketplace.');
      
      // Reset form
      setTitle('');
      setPrice('');
      setStock('1');
      setDescription('');
      setImageUrl('');
      setShowAddForm(false);

      // Refresh product list
      fetchVendorData();
    } catch (err: any) {
      alert(err.message || 'Failed to publish product.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center font-sans">
        <p className="text-xs font-bold text-slate-500">Loading Alumni Vendor Dashboard...</p>
      </div>
    );
  }

  if (!vendor) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-sans space-y-6">
      {/* ALUMNI VENDOR HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border tracking-wide ${
            vendor.status === 'approved' 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}>
            Alumni Vendor Account ({vendor.status})
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-2">Alumni Vendor Control Center</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Store: <strong className="text-slate-800">{vendor.business_name}</strong> | Category: {vendor.category}
          </p>
        </div>

        {vendor.status === 'approved' && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow hover:bg-emerald-700 transition"
          >
            {showAddForm ? '✕ Close Form' : '+ Upload New Product'}
          </button>
        )}
      </div>

      {vendor.status === 'pending' ? (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center text-amber-900">
          <h3 className="font-bold text-sm mb-1">Application Pending Review</h3>
          <p className="text-xs text-amber-700">
            Your vendor application is currently under review by administrators. Once approved, you will be able to upload products directly to the community marketplace.
          </p>
        </div>
      ) : (
        <>
          {/* UPLOAD PRODUCT FORM MODAL / PANEL */}
          {showAddForm && (
            <div className="bg-slate-50 border border-emerald-200 rounded-2xl p-6 shadow-sm animate-fadeIn">
              <h2 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">
                Publish Product to Marketplace
              </h2>

              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Product Title
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Premium Honey (500ml)"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full text-xs font-semibold border border-slate-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full text-xs font-semibold border border-slate-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    >
                      <option value="General">General Marketplace</option>
                      <option value="Agriculture">Agriculture & Food</option>
                      <option value="Electronics">Electronics & Gadgets</option>
                      <option value="Apparel">Apparel & Fashion</option>
                      <option value="Services">Services & Logistics</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Price (₦)
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="e.g. 5000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full text-xs font-semibold border border-slate-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Available Stock
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="1"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      className="w-full text-xs font-semibold border border-slate-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full text-xs font-semibold border border-slate-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide details about your product..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full text-xs font-semibold border border-slate-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition"
                  >
                    {submitting ? 'Publishing Item...' : 'Publish to Marketplace'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* VENDOR METRICS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Active Products</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{products.length}</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Store Sales</span>
              <div className="text-2xl font-black text-emerald-700 mt-1">₦0.00</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Pending Orders</span>
              <div className="text-2xl font-black text-amber-600 mt-1">0</div>
            </div>
          </div>

          {/* INVENTORY TABLE */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">
                Live Marketplace Inventory
              </h2>
              <Link href="/shop" className="text-xs font-bold text-emerald-600 hover:underline">
                View Marketplace &rarr;
              </Link>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-xs text-slate-400 mb-3">You haven't listed any products yet.</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="text-xs font-bold text-emerald-600 hover:underline"
                >
                  Upload Your First Listing &rarr;
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {products.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <h3 className="font-bold text-slate-900">{item.title}</h3>
                      <p className="text-slate-400">Stock: {item.stock} available {item.category ? `• ${item.category}` : ''}</p>
                    </div>
                    <span className="font-black text-slate-900">₦{item.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
