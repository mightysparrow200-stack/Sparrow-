'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [addedId, setAddedId] = useState<string | number | null>(null);

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

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const handleAddToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const updatedCart = [...existingCart, product];
      localStorage.setItem('cart', JSON.stringify(updatedCart));

      setAddedId(product.id);
      setTimeout(() => setAddedId(null), 1500);
    } catch (err) {
      console.error('Failed to save to local storage', err);
    }
  };

  const handleBuyNow = (product: Product) => {
    handleAddToCart(product);
    router.push('/cart');
  };

  return (
    <main className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header & Category Filters */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
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

          {/* Category Pills */}
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

        {/* Loading State */}
        {isLoading ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm">
            <div className="w-6 h-6 border-2 border-slate-300 border-t-emerald-600 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-500 font-medium">Loading marketplace products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm">
            <span className="text-4xl mb-3 block">🏪</span>
            <h3 className="text-sm font-bold text-slate-900 mb-1">No products available</h3>
            <p className="text-xs text-slate-400">There are no listings in this category right now.</p>
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
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

                  <div className="flex items-center justify-between border-t border-slate-50 pt-2 gap-2">
                    <span className="text-sm font-extrabold text-slate-900">
                      ₦{product.price.toLocaleString()}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(product, e)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition ${
                        addedId === product.id
                          ? 'bg-slate-900 text-white'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      {addedId === product.id ? 'Added! ✓' : '+ Cart'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Product Details Modal */}
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
                    onClick={() => handleAddToCart(selectedProduct)}
                    className="flex-1 py-3 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition"
                  >
                    Add to Cart
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBuyNow(selectedProduct)}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition active:scale-95"
                  >
                    Buy Now
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
