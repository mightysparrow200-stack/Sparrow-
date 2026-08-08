'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Product {
  id: string | number;
  title: string;
  category: string;
  price: number;
  description: string;
  image_url: string;
  vendor_name?: string;
  vendor_rating?: number;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchShopProducts() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const formattedProducts: Product[] = (data || []).map((item) => ({
          id: item.id,
          title: item.title || item.name || 'Untitled Product',
          category: item.category || 'General',
          price: item.price || 0,
          description: item.description || '',
          image_url: item.image_url || '📦',
          vendor_name: item.vendor_name || 'CoOp Partner Vendor',
          vendor_rating: item.vendor_rating || 4.8,
        }));

        setProducts(formattedProducts);
      } catch (err) {
        console.error('Failed to load marketplace products:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchShopProducts();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider block mb-1">
            Cooperative Marketplace
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Explore Member Products
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Buy quality items direct from verified cooperative vendors.
          </p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm">
            <div className="w-6 h-6 border-2 border-slate-300 border-t-emerald-600 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-500 font-medium">Loading marketplace products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm">
            <span className="text-4xl mb-3 block">🏪</span>
            <h3 className="text-sm font-bold text-slate-900 mb-1">No products available yet</h3>
            <p className="text-xs text-slate-400">Check back soon for new listings from vendors.</p>
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="group bg-white border border-slate-100 rounded-2xl p-3 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-50 mb-2.5">
                    {product.image_url?.startsWith('http') ? (
                      <img
                        src={product.image_url}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">
                        {product.image_url || '📦'}
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                    {product.category}
                  </span>
                  <h3 className="text-xs font-bold text-slate-800 line-clamp-2 mb-2 group-hover:text-emerald-700 transition">
                    {product.title}
                  </h3>
                </div>

                <div>
                  <div className="flex items-center gap-1 mb-2 text-[11px] font-semibold text-slate-600">
                    <span className="text-amber-400">★</span>
                    <span>{product.vendor_rating || 4.8}</span>
                    <span className="text-slate-400 text-[10px]">
                      ({product.vendor_name || 'Vendor'})
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-50 pt-2">
                    <span className="text-sm font-extrabold text-slate-900">
                      ₦{product.price.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      View
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {selectedProduct && (
          <div 
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedProduct(null)}
          >
            <div 
              className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col md:flex-row max-h-[90vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="md:w-1/2 bg-slate-50 relative min-h-[240px] md:min-h-full flex items-center justify-center">
                {selectedProduct.image_url?.startsWith('http') ? (
                  <img
                    src={selectedProduct.image_url}
                    alt={selectedProduct.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-6xl">{selectedProduct.image_url || '📦'}</span>
                )}
                
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="md:hidden absolute top-3 right-3 bg-slate-900/70 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
                <div>
                  <div className="hidden md:flex justify-between items-center mb-4">
                    <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full">
                      {selectedProduct.category}
                    </span>
                    <button
                      onClick={() => setSelectedProduct(null)}
                      className="text-slate-400 hover:text-slate-700 text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-100 transition"
                    >
                      ✕
                    </button>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 leading-tight mb-2">
                    {selectedProduct.title}
                  </h2>

                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400">Listed By</p>
                      <p className="text-xs font-bold text-slate-800">
                        {selectedProduct.vendor_name || 'CoOp Partner Vendor'}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-xs font-bold text-slate-900">
                        <span className="text-amber-400 text-sm">★</span>
                        <span>{selectedProduct.vendor_rating || 4.8} / 5.0</span>
                      </div>
                      <p className="text-[9px] text-emerald-600 font-semibold">Verified Vendor</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-[10px] font-bold uppercase text-slate-400">Price</p>
                    <p className="text-2xl font-black text-slate-900">
                      ₦{selectedProduct.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="mb-6">
                    <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Description</p>
                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                      {selectedProduct.description || 'No detailed description provided for this product.'}
                    </p>
                  </div>
                </div>

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
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
                  >
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
