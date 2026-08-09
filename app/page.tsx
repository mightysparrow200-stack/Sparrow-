'use client';

import { useState } from 'react';
import Link from 'next/link';

// Sample category shortcuts matching Jumia's circular category layout
const QUICK_CATEGORIES = [
  { id: 1, title: 'New Arrival', icon: '✨', bg: 'bg-amber-100' },
  { id: 2, title: 'Beauty deals', icon: '🧴', bg: 'bg-rose-100' },
  { id: 3, title: 'Computing deals', icon: '💻', bg: 'bg-blue-100' },
  { id: 4, title: 'Mobile Accessories', icon: '🎧', bg: 'bg-purple-100' },
  { id: 5, title: 'Gaming', icon: '🎮', bg: 'bg-emerald-100' },
  { id: 6, title: 'Fitness', icon: '🚴', bg: 'bg-orange-100' },
  { id: 7, title: 'Home & Living', icon: '🪑', bg: 'bg-indigo-100' },
  { id: 8, title: 'Call to Order', icon: '📞', bg: 'bg-red-100' },
];

// Sample flash deal items matching top scroll ticker
const FLASH_DEALS = [
  {
    id: 1,
    title: 'EASYPIE 20000mAh Ultra Slim Power Bank',
    price: 7805,
    originalPrice: 12500,
    discount: 37,
    image: '🔋',
  },
  {
    id: 2,
    title: 'Ace Elec 20000 mAh Ultra Slim Portable',
    price: 7650,
    originalPrice: 11000,
    discount: 30,
    image: '⚡',
  },
  {
    id: 3,
    title: 'SILVER CREST 2L Industrial Blender',
    price: 23981,
    originalPrice: 35000,
    discount: 31,
    image: '🍹',
  },
  {
    id: 4,
    title: 'Smart Watch Fitness Tracker Band',
    price: 6400,
    originalPrice: 9500,
    discount: 32,
    image: '⌚',
  },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-slate-100 font-sans pb-12">
      {/* 1. JUMIA-STYLE TOP APP BAR */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-3 py-2.5">
        <div className="max-w-md mx-auto space-y-2">
          
          {/* Top Brand & Actions Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                type="button" 
                className="text-slate-800 text-xl font-bold p-1 focus:outline-hidden"
                aria-label="Open menu"
              >
                ☰
              </button>
              <Link href="/" className="flex items-center gap-1">
                <span className="text-xl font-black text-slate-900 tracking-tight">
                  MIGHTY<span className="text-amber-500">SPARROW</span>
                </span>
                <span className="text-xs bg-amber-500 text-white rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  ★
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/profile" className="text-slate-700 text-lg p-1" aria-label="Account">
                👤
              </Link>
              <Link href="/cart" className="relative text-slate-700 text-lg p-1" aria-label="Cart">
                🛒
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                  0
                </span>
              </Link>
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-400 text-sm">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, brands and categories"
              className="w-full bg-slate-100 border border-transparent focus:border-amber-500 focus:bg-white text-xs font-medium text-slate-800 rounded-full pl-9 pr-4 py-2 transition outline-hidden"
            />
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto space-y-3 pt-2">
        
        {/* 2. HORIZONTAL FLASH DEALS TICKER */}
        <section className="bg-white p-3 border-y border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-amber-500 font-black text-sm">⚡</span>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Top Deals
              </h2>
            </div>
            <Link href="/shop" className="text-[11px] font-bold text-amber-600 hover:underline">
              SEE ALL &gt;
            </Link>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {FLASH_DEALS.map((deal) => (
              <div
                key={deal.id}
                className="shrink-0 w-32 bg-white rounded-lg border border-slate-100 p-2 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="w-full aspect-square bg-slate-50 rounded-md flex items-center justify-center text-3xl mb-1.5">
                    {deal.image}
                  </div>
                  <p className="text-[10px] font-medium text-slate-700 line-clamp-2 leading-tight">
                    {deal.title}
                  </p>
                </div>
                <div className="mt-2">
                  <p className="text-xs font-extrabold text-slate-900">
                    ₦{deal.price.toLocaleString()}
                  </p>
                  <p className="text-[9px] text-slate-400 line-through">
                    ₦{deal.originalPrice.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. CIRCULAR CATEGORY GRID */}
        <section className="bg-white p-4 border-y border-slate-200">
          <div className="grid grid-cols-4 gap-y-4 gap-x-2">
            {QUICK_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${encodeURIComponent(cat.title)}`}
                className="flex flex-col items-center text-center group"
              >
                <div
                  className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full ${cat.bg} border-2 border-amber-400/80 flex items-center justify-center text-2xl shadow-xs group-hover:scale-105 transition`}
                >
                  {cat.icon}
                </div>
                <span className="text-[10px] font-bold text-slate-700 mt-1.5 leading-tight group-hover:text-amber-600 transition">
                  {cat.title}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* 4. PROMOTIONAL HERO BANNER */}
        <section className="px-3">
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-4 text-white shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[9px] font-extrabold bg-black/20 px-2 py-0.5 rounded uppercase tracking-wider">
                Official Deals
              </span>
              <h3 className="text-base font-extrabold mt-1">Co-Op Alumni Store</h3>
              <p className="text-[11px] text-amber-100 font-medium mt-0.5">
                Up to 40% discount for verified members
              </p>
            </div>
            <Link
              href="/shop"
              className="bg-white text-amber-700 font-bold text-xs px-3 py-2 rounded-xl shadow-xs hover:bg-amber-50 transition whitespace-nowrap"
            >
              Shop Now
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}
