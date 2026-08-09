'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function VendorDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [vendorName, setVendorName] = useState('');
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    async function checkVendorAuth() {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push('/login');
          return;
        }

        // Fetch user profile to verify vendor status
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!profile || profile.role !== 'vendor') {
          // If not a vendor, redirect back to profile page
          router.push('/profile');
          return;
        }

        setVendorName(profile.full_name || user.email || 'Vendor');

        // Fetch vendor product count (adjust table name if needed)
        const { count, error } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('vendor_id', user.id);

        if (!error && count !== null) {
          setProductCount(count);
        }
      } catch (err) {
        console.error('Error loading vendor dashboard:', err);
      } finally {
        setLoading(false);
      }
    }

    checkVendorAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-500">Loading Vendor Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 font-sans">
      {/* HEADER SECTION */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🏪</span>
            <h1 className="text-2xl font-black text-slate-900">Vendor Dashboard</h1>
          </div>
          <p className="text-xs text-slate-500">
            Welcome back, <span className="font-bold text-slate-700">{vendorName}</span>! Manage your products and store operations.
          </p>
        </div>

        <Link
          href="/vendor/upload-product"
          className="inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs w-fit"
        >
          <span>➕</span>
          <span>Add New Product</span>
        </Link>
      </div>

      {/* QUICK STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Listed Products</p>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">{productCount}</span>
            <span className="text-xl">📦</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Account Status</p>
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-black text-emerald-600 uppercase bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Active Vendor
            </span>
            <span className="text-xl">✅</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Marketplace</p>
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-black text-slate-700 uppercase bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
              Alumni Co-Op
            </span>
            <span className="text-xl">🎓</span>
          </div>
        </div>
      </div>

      {/* NAVIGATION / MODULE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CARD 1: PRODUCTS LIST */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-amber-300 transition group">
          <div>
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition">
              📦
            </div>
            <h3 className="text-base font-extrabold text-slate-900 mb-1">Manage Products</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              View, edit, or delete items you have listed for sale in the marketplace.
            </p>
          </div>
          <Link
            href="/vendor/products"
            className="block text-center py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
          >
            View Products →
          </Link>
        </div>

        {/* CARD 2: UPLOAD PRODUCT */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-amber-300 transition group">
          <div>
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition">
              📤
            </div>
            <h3 className="text-base font-extrabold text-slate-900 mb-1">Add New Item</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Upload images, prices, descriptions, and stock quantities for new inventory.
            </p>
          </div>
          <Link
            href="/vendor/upload-product"
            className="block text-center py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition"
          >
            Upload Product →
          </Link>
        </div>

        {/* CARD 3: VENDOR PROFILE */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-amber-300 transition group">
          <div>
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition">
              ⚙️
            </div>
            <h3 className="text-base font-extrabold text-slate-900 mb-1">Vendor Settings</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Manage your business branding, contact preferences, and public vendor profile.
            </p>
          </div>
          <Link
            href="/vendor/profile"
            className="block text-center py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition border border-slate-200"
          >
            Edit Settings →
          </Link>
        </div>
      </div>
    </div>
  );
}
