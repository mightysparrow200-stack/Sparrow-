'use client';

import Link from 'next/link';
import { useCoOp } from './CoOpState';

export default function Header() {
  const context = useCoOp();
  
  // Calculate total items in cart (sum of quantities)
  const cartItemCount = context?.cart.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-150 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        
        {/* Logo Group */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="bg-coopGreen text-coopGold w-8 h-8 rounded-lg flex items-center justify-center font-serif font-bold text-sm shadow-sm group-hover:scale-105 transition">
            MS
          </span>
          <div className="leading-tight">
            <span className="block text-xs font-bold text-slate-900 tracking-tight">Mighty Sparrow Co-op</span>
            <span className="block text-[10px] text-gray-400">Alumni Society</span>
          </div>
        </Link>

        {/* Navigation & Cart Badge */}
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link 
              href="/" 
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg text-gray-600 hover:text-coopGreen hover:bg-gray-100 transition"
            >
              Home
            </Link>
            <Link 
              href="/shop" 
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg text-gray-600 hover:text-coopGreen hover:bg-gray-100 transition"
            >
              Marketplace
            </Link>
            <Link 
              href="/dashboard" 
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg text-gray-600 hover:text-coopGreen hover:bg-gray-100 transition"
            >
              Portal
            </Link>
          </nav>

          {/* 🛒 Dynamic Cart Icon Link */}
          <Link 
            href="/cart" 
            className="relative p-2 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition active:scale-95"
            aria-label="Shopping Cart"
          >
            <span className="text-base">🛒</span>
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1.5 bg-red-500 text-white font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>

      </div>
    </header>
  );
}
