'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { addToCart, getCart } from '@/lib/cart';
import Link from 'next/link';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = () => {
    const items = getCart();
    const total = items.reduce((acc, item) => acc + item.quantity, 0);
    setCartCount(total);
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
    updateCartCount();

    window.addEventListener('cart_updated', updateCartCount);
    return () => window.removeEventListener('cart_updated', updateCartCount);
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-500">Loading Shop...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Co-Op Shop</h1>
          <p className="text-xs text-slate-500 mt-1">Exclusive products and agricultural supplies for members.</p>
        </div>

        <Link
          href="/cart"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition w-fit"
        >
          <span>🛒 View Cart</span>
          {cartCount > 0 && (
            <span className="bg-white text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-black">
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
            <div className="h-48 bg-slate-100 relative">
              <img
                src={product.image_url || 'https://via.placeholder.com/400'}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 right-3 px-2.5 py-1 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-wider rounded-full">
                {product.category}
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900 leading-snug">{product.title}</h2>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{product.description}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400">Price</p>
                  <p className="text-sm font-black text-slate-900">₦{product.price.toLocaleString()}</p>
                </div>

                <button
                  onClick={() => addToCart(product)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
