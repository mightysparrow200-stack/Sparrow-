'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { addToCart } from '@/lib/cart';

export interface Product {
  id: string | number;
  title: string;
  category: string;
  price: number;
  original_price?: number;
  discount_percentage?: number;
  description: string;
  image_url: string;
  vendor_name?: string;
  vendor_rating?: number;
  rating_count?: number;
  shipping_fee?: number;
  location?: string;
  is_verified?: boolean;
}

// Fixed pinned circular category shortcuts
const PINNED_CATEGORIES = [
  { id: 1, title: 'Supermarket', icon: '🛒', bg: 'bg-emerald-50' },
  { id: 2, title: 'Fashion', icon: '👕', bg: 'bg-rose-50' },
  { id: 3, title: 'Computing', icon: '💻', bg: 'bg-blue-50' },
  { id: 4, title: 'Phones & Tabs', icon: '📱', bg: 'bg-purple-50' },
  { id: 5, title: 'Electronics', icon: '📺', bg: 'bg-emerald-100' },
  { id: 6, title: 'Home & Office', icon: '🏠', bg: 'bg-orange-50' },
  { id: 7, title: 'Beauty', icon: '🧴', bg: 'bg-pink-50' },
  { id: 8, title: 'Official Store', icon: '🏪', bg: 'bg-indigo-50' },
];

export default function MarketplaceHomePage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedId, setAddedId] = useState<string | number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const formattedProducts: Product[] = (data || []).map((item) => {
          const price = Number(item.price) || 0;
          const originalPrice = item.original_price ? Number(item.original_price) : Math.round(price * 1.25);
          const discount = item.discount_percentage || Math.round(((originalPrice - price) / originalPrice) * 100);

          return {
            id: item.id,
            title: item.title || item.name || 'Untitled Product',
            category: item.category || 'General Household',
            price,
            original_price: originalPrice,
            discount_percentage: discount,
            description: item.description || '',
            image_url: item.image_url || '📦',
            vendor_name: item.vendor_name || 'Mighty Sparrow Verified',
            vendor_rating: item.vendor_rating || 4.8,
            rating_count: item.rating_count || 120,
            shipping_fee: item.shipping_fee || 750,
            location: item.location || 'LEKKI-AJAH (SANGOTEDO)',
            is_verified: true,
          };
        });

        setProducts(formattedProducts);
      } catch (err) {
        console.error('Failed to load marketplace products:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Dynamically extract distinct categories from Supabase data
  const dynamicCategories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  // Filter products based on search query and category selection
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      addToCart(product);

      setAddedId(product.id);
      setTimeout(() => setAddedId(null), 1500);

      setToastMessage(`"${product.title}" added to cart!`);
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      console.error('Failed to save to cart:', err);
    }
  };

  const handleBuyNow = (product: Product) => {
    handleAddToCart(product);
    router.push('/cart');
  };

  return (
    <main className="min-h-screen bg-slate-100 font-sans pb-12 relative">
      
      {/* 1. SEARCH BAR - FIXED NON-OVERLAPPING RELATIVE POSITIONING */}
      <section className="bg-emerald-700 p-3 shadow-sm relative z-10">
        <div className="max-w-5xl mx-auto flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-2.5 text-slate-400 text-xs">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, brands and categories..."
              className="w-full bg-white text-xs font-medium text-slate-900 rounded-full pl-9 pr-4 py-2.5 border-0 shadow-inner focus:outline-hidden"
            />
          </div>
          <button
            type="button"
            className="bg-amber-500 hover:bg-amber-600 text-slate-900 text-xs font-black px-4 py-2.5 rounded-full transition cursor-pointer shadow-xs"
          >
            Search
          </button>
        </div>
      </section>

      <div className="max-w-5xl mx-auto space-y-4 px-3 sm:px-6 pt-4">

        {/* 2. PROMOTIONAL HERO DEAL BANNER */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-900 text-white rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-emerald-600/30">
          <div>
            <span className="text-[10px] font-extrabold text-amber-900 bg-amber-400 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
              CoOp Official Store
            </span>
            <h1 className="text-xl sm:text-2xl font-black mt-1.5 leading-snug">
              Marketplace Deals & Alumni Specials
            </h1>
            <p className="text-xs text-emerald-100 mt-1">
              Verified quality products with fast nationwide shipping.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs transition whitespace-nowrap cursor-pointer"
          >
            Explore All Deals
          </button>
        </div>

        {/* 3. PINNED CIRCULAR CATEGORIES */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-3">
            Quick Categories
          </h2>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 text-center">
            {PINNED_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  if (cat.title === 'Official Store') {
                    setSelectedCategory('All');
                  } else {
                    setSelectedCategory(cat.title);
                  }
                }}
                className="flex flex-col items-center group focus:outline-hidden cursor-pointer"
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full ${cat.bg} border-2 border-emerald-200 flex items-center justify-center text-xl sm:text-2xl shadow-2xs group-hover:scale-105 group-hover:border-emerald-500 transition`}>
                  {cat.icon}
                </div>
                <span className="text-[10px] font-bold text-slate-700 mt-1.5 line-clamp-1 group-hover:text-emerald-700">
                  {cat.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 4. DYNAMIC CATEGORY FILTER CHIPS */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {dynamicCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-bold px-3.5 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 5. PRODUCT MARKETPLACE GRID */}
        {isLoading ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-xs">
            <div className="w-6 h-6 border-2 border-slate-300 border-t-emerald-600 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-500 font-medium">Loading marketplace products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-xs">
            <span className="text-4xl mb-3 block">🏪</span>
            <h3 className="text-sm font-bold text-slate-900 mb-1">No products found</h3>
            <p className="text-xs text-slate-400">Try selecting a different category or adjusting your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="group bg-white rounded-xl p-2.5 border border-slate-200/80 shadow-2xs hover:shadow-md transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-slate-50 mb-2">
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

                  <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded inline-block mb-1">
                    Official Store
                  </span>
                  <h3 className="text-xs font-semibold text-slate-800 line-clamp-2 mb-1 group-hover:text-emerald-700 transition">
                    {product.title}
                  </h3>
                </div>

                <div>
                  <div className="mt-1">
                    <p className="text-sm font-extrabold text-slate-900">
                      ₦{product.price.toLocaleString()}
                    </p>
                    {product.original_price && (
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <span className="text-slate-400 line-through">
                          ₦{product.original_price.toLocaleString()}
                        </span>
                        {product.discount_percentage && (
                          <span className="text-amber-700 bg-amber-50 font-bold px-1 rounded">
                            -{product.discount_percentage}%
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-2 mt-2">
                    <div className="flex items-center gap-0.5 text-[10px] font-bold text-slate-600">
                      <span className="text-amber-400">★</span>
                      <span>{product.vendor_rating}</span>
                      <span className="text-slate-400 text-[9px]">({product.rating_count})</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(product, e)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded transition cursor-pointer ${
                        addedId === product.id
                          ? 'bg-slate-900 text-white'
                          : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                      }`}
                    >
                      {addedId === product.id ? 'Added ✓' : 'Add'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FLOATING TOAST NOTIFICATION */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900/90 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-2 border border-slate-700/50 animate-bounce">
            <span>🛒</span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* EXPANDED PRODUCT MODAL */}
        {selectedProduct && (
          <div 
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
            onClick={() => setSelectedProduct(null)}
          >
            <div 
              className="bg-white w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Top Bar */}
              <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Product Details
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="text-slate-400 hover:text-slate-700 font-bold w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-200 transition"
                >
                  ✕
                </button>
              </div>

              <div className="overflow-y-auto p-4 space-y-4">
                {/* Product Image Display */}
                <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-center min-h-[220px]">
                  {selectedProduct.image_url?.startsWith('http') ? (
                    <img
                      src={selectedProduct.image_url}
                      alt={selectedProduct.title}
                      className="max-h-56 object-contain rounded-lg"
                    />
                  ) : (
                    <span className="text-7xl">{selectedProduct.image_url || '📦'}</span>
                  )}
                </div>

                {/* Badge & Title */}
                <div>
                  <span className="bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider inline-block mb-1.5">
                    Official Store
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {selectedProduct.title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Brand: <span className="text-emerald-700 font-semibold">{selectedProduct.vendor_name}</span>
                  </p>
                </div>

                {/* Pricing Details */}
                <div className="border-t border-b border-slate-100 py-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-slate-900">
                      ₦{selectedProduct.price.toLocaleString()}
                    </span>
                    {selectedProduct.original_price && (
                      <span className="text-xs text-slate-400 line-through font-medium">
                        ₦{selectedProduct.original_price.toLocaleString()}
                      </span>
                    )}
                    {selectedProduct.discount_percentage && (
                      <span className="bg-amber-100 text-amber-800 text-[11px] font-extrabold px-1.5 py-0.5 rounded">
                        -{selectedProduct.discount_percentage}%
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-emerald-600 font-bold mt-1">In stock</p>
                </div>

                {/* Shipping & Delivery Info */}
                <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1">
                  <p className="text-slate-700 font-medium">
                    + shipping from <span className="font-bold">₦{selectedProduct.shipping_fee?.toLocaleString()}</span> to <span className="font-bold">{selectedProduct.location}</span>
                  </p>
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-[11px] mt-1">
                    <span>★ ★ ★ ★ ★</span>
                    <span className="text-slate-600 font-normal">({selectedProduct.rating_count} verified ratings)</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-xs font-bold text-slate-800 mb-1">Product Description</h4>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 whitespace-pre-line">
                    {selectedProduct.description || 'No additional specifications provided for this product item.'}
                  </p>
                </div>
              </div>

              {/* Bottom Action Buttons */}
              <div className="p-3 bg-white border-t border-slate-200 flex gap-2 items-center">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="w-12 h-11 border border-slate-300 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-50 text-lg"
                  title="Close"
                >
                  📞
                </button>
                <button
                  type="button"
                  onClick={() => handleBuyNow(selectedProduct)}
                  className="flex-1 h-11 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  🛒 {addedId === selectedProduct.id ? 'Added to Cart!' : 'Add to cart'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
