'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

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
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('products').select('*');

      if (error) {
        console.error('Error fetching products:', error);
      } else if (data && data.length > 0) {
        setProducts(data);
      } else {
        // Fallback demo data if DB table is empty
        setProducts([
          {
            id: 1,
            title: 'Premium Agricultural Bag (50kg)',
            category: 'Agriculture',
            price: 45000,
            description: 'High quality grain bag directly sourced from partner farms within the cooperative network.',
            image_url: '🌾',
            vendor_name: 'GreenField Agri',
            vendor_rating: 4.9,
          },
          {
            id: 2,
            title: 'Solar Inverter Battery 200Ah',
            category: 'Electronics',
            price: 280000,
            description: 'Deep cycle gel battery designed for reliable off-grid clean energy systems.',
            image_url: '🔋',
            vendor_name: 'PowerTech CoOp',
            vendor_rating: 4.8,
          },
        ]);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const handleOrderNow = (product: Product) => {
    try {
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const updatedCart = [...existingCart, product];
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } catch (e) {
      console.error('Failed to save to local storage', e);
    }

    // Redirect directly to cart / checkout
    router.push('/cart');
  };

  return (
    <main className="min-h-screen bg-slate-50/50 p-4 sm:p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">
              Member Marketplace
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-2">Co-Op Store</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified products and services supplied by alumni & partner vendors.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-bold px-3.5 py-2 rounded-xl transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white border border-slate-100 rounded-2xl p-4 h-64 animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center">
            <p className="text-4xl mb-2">📦</p>
            <h3 className="text-sm font-bold text-slate-800">No products found</h3>
            <p className="text-xs text-slate-400 mt-1">There are no items listed in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="group bg-white border border-slate-100 rounded-2xl p-3 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-50 mb-2.5 flex items-center justify-center">
                    {product.image_url?.startsWith('http') ? (
                      <img
                        src={product.image_url}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <span className="text-4xl">{product.image_url || '📦'}</span>
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
                      ({product.vendor_name || 'Verified Vendor'})
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-50 pt-2">
                    <span className="text-sm font-extrabold text-slate-900">
                      ₦{product.price?.toLocaleString()}
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

        {/* Modal Window */}
        {selectedProduct && (
          <div
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedProduct(null)}
          >
            <div
              className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col md:flex-row max-h-[90vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="md:w-1/2 bg-slate-50 relative min-h-[220px] md:min-h-full flex items-center justify-center">
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
                  type="button"
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
                      type="button"
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
                      ₦{selectedProduct.price?.toLocaleString()}
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
                    onClick={() => handleOrderNow(selectedProduct)}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition active:scale-95"
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
