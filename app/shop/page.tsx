'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCoOp } from '../CoOpState';
import { supabase } from '@/lib/supabase';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  member_price: number | null;
  category: string;
  image_url: string | null;
  stock?: number;
  vendor_id?: string | null;
}

function ShopPage() {
  const context = useCoOp();

  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [addedId, setAddedId] = useState<string | null>(null);

  // 1. Fetch Live Products from Supabase
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading Supabase products:', error.message);
      } else if (data) {
        setDbProducts(data);
      }
      setLoading(false);
    }

    loadProducts();
  }, []);

  if (!context) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 font-sans">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-500 font-medium">Loading Marketplace...</p>
      </div>
    );
  }

  const { isMember, memberBalance, addToCart } = context;

  // Categories extraction
  const categories = ['All', ...Array.from(new Set(dbProducts.map((p) => p.category || 'General')))];

  // Filter logic
  const filteredProducts = selectedCategory === 'All'
    ? dbProducts
    : dbProducts.filter((p) => (p.category || 'General') === selectedCategory);

  const handleAddToCart = (product: Product, finalPrice: number) => {
    addToCart({
      id: product.id,
      title: product.title,
      price: finalPrice,
      image_url: product.image_url,
      quantity: 1,
    });

    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-sans">
      
      {/* SHOP HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">
            Co-Op Marketplace
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-slate-950 mt-1">
            Direct Farm & Trade Goods
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Browse our catalog of general goods and premium products. Unlock co-op discounts on every item.
          </p>
        </div>

        {/* ACCOUNT STATUS BADGE */}
        <div className="bg-white border border-slate-200 p-2 rounded-2xl flex items-center gap-2 shadow-sm w-fit text-xs font-semibold">
          <span className="text-slate-400">Account Status:</span>
          {isMember ? (
            <span className="bg-emerald-600 text-white px-3 py-1 rounded-xl shadow-sm font-bold">
              Alumni Member
            </span>
          ) : (
            <span className="bg-slate-900 text-white px-3 py-1 rounded-xl shadow-sm font-bold">
              Guest (Retail)
            </span>
          )}
        </div>
      </div>

      {/* PRICING NOTIFICATION */}
      <div className={`p-4 rounded-2xl border mb-8 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
        isMember 
          ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900' 
          : 'bg-amber-50/60 border-amber-200 text-amber-900'
      }`}>
        <div className="flex items-center gap-2">
          <span className="text-base">{isMember ? '✨' : '🛍️'}</span>
          <span className="font-medium">
            {isMember 
              ? 'Active Member status detected! Exclusive member prices apply automatically across all stock.' 
              : 'Browsing as Guest. Register as an alumni member to unlock 15% co-op discounts.'}
          </span>
        </div>
        {isMember && (
          <div className="font-extrabold whitespace-nowrap bg-emerald-100/80 text-emerald-900 px-3 py-1.5 rounded-xl border border-emerald-200/50">
            Wallet Balance: ₦{memberBalance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
          </div>
        )}
      </div>

      {/* CATEGORY BAR */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* PRODUCT CATALOG GRID */}
      <div>
        <h2 className="text-lg font-black text-slate-950 mb-6">Featured Goods</h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl p-4 h-80 animate-pulse flex flex-col justify-between">
                <div className="w-full h-36 bg-slate-100 rounded-xl" />
                <div className="space-y-2 mt-4">
                  <div className="w-3/4 h-4 bg-slate-100 rounded" />
                  <div className="w-1/2 h-3 bg-slate-100 rounded" />
                </div>
                <div className="w-full h-9 bg-slate-100 rounded-xl mt-4" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-200/60">
            <span className="text-3xl">📦</span>
            <h3 className="text-sm font-bold text-slate-800 mt-2">No Products Available</h3>
            <p className="text-xs text-slate-500 mt-1">Check back soon for fresh inventory updates.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              // Calculate discount: if DB record has member_price, use it; otherwise auto-apply 15% discount for members
              const explicitMemberPrice = product.member_price;
              const calculatedMemberPrice = Math.round(product.price * 0.85);
              const finalMemberPrice = explicitMemberPrice || calculatedMemberPrice;

              const displayPrice = isMember ? finalMemberPrice : product.price;

              return (
                <div 
                  key={product.id} 
                  className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition group"
                >
                  <div>
                    {/* PRODUCT IMAGE CONTAINER */}
                    <div className="relative w-full h-40 bg-slate-50 rounded-xl overflow-hidden mb-3">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 text-3xl">
                          📦
                        </div>
                      )}
                      
                      {/* CATEGORY BADGE */}
                      <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-md text-[9px] font-bold text-slate-700 uppercase tracking-wider shadow-sm">
                        {product.category || 'General'}
                      </span>
                    </div>

                    {/* VENDOR ATTRIBUTION BADGE */}
                    <div className="mb-1.5">
                      {product.vendor_id ? (
                        <span className="inline-block bg-slate-100 text-slate-700 text-[9px] px-2 py-0.5 rounded-md font-bold">
                          Verified Merchant
                        </span>
                      ) : (
                        <span className="inline-block bg-emerald-100 text-emerald-800 text-[9px] px-2 py-0.5 rounded-md font-bold">
                          Direct Co-Op Bulk Stock 🦅
                        </span>
                      )}
                    </div>

                    {/* TITLE & DESCRIPTION */}
                    <h3 className="text-sm text-slate-950 font-bold line-clamp-1 group-hover:text-emerald-600 transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                  
                  {/* PRICING & ACTION */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                    <div>
                      {isMember && (
                        <span className="text-[10px] text-slate-400 line-through block font-medium">
                          ₦{product.price.toLocaleString('en-NG')}
                        </span>
                      )}
                      <span className="text-base font-black text-slate-900">
                        ₦{displayPrice.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(product, displayPrice)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-sm active:scale-95 ${
                        addedId === product.id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-900 hover:bg-emerald-600 text-white'
                      }`}
                    >
                      {addedId === product.id ? '✓ Added' : 'Add +'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}

export default dynamic(() => Promise.resolve(ShopPage), { ssr: false });
