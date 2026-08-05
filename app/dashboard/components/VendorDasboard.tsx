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
}

export default function VendorDashboard() {
  const [vendor, setVendor] = useState<VendorInfo | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
              .select('id, title, price, stock')
              .eq('vendor_id', vendorData.id);

            setProducts(prodData || []);
          }
        }
      } catch (err) {
        console.error('Error fetching vendor data:', err);
      } font-sans
        setLoading(false);
      }
    }

    fetchVendorData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center font-sans">
        <p className="text-xs font-bold text-slate-500">Loading Vendor Dashboard...</p>
      </div>
    );
  }

  if (!vendor) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-sans space-y-6">
      {/* VENDOR HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${
            vendor.status === 'approved' 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}>
            Vendor Account ({vendor.status})
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-2">{vendor.business_name}</h1>
          <p className="text-xs text-slate-500">Category: {vendor.category}</p>
        </div>

        {vendor.status === 'approved' && (
          <Link
            href="/shop/add-product"
            className="px-4 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow hover:bg-emerald-700 transition"
          >
            + Add New Product
          </Link>
        )}
      </div>

      {vendor.status === 'pending' ? (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center text-amber-900">
          <h3 className="font-bold text-sm mb-1">Application Pending Review</h3>
          <p className="text-xs text-amber-700">
            Your vendor application is currently under review by administrators. Once approved, you will be able to list products and manage orders here.
          </p>
        </div>
      ) : (
        <>
          {/* METRICS */}
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
            <h2 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              Listed Inventory
            </h2>

            {products.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-xs text-slate-400 mb-3">You haven't listed any products yet.</p>
                <Link
                  href="/shop/add-product"
                  className="text-xs font-bold text-emerald-600 hover:underline"
                >
                  Create Your First Listing &rarr;
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {products.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <h3 className="font-bold text-slate-900">{item.title}</h3>
                      <p className="text-slate-400">Stock: {item.stock} available</p>
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
