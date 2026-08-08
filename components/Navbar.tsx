'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isPortalOpen, setIsPortalOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100 px-4 py-3 font-sans">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🦅</span>
          <div>
            <h1 className="text-sm font-bold text-slate-900 leading-tight">Mighty Sparrow</h1>
            <p className="text-[9px] font-semibold text-emerald-600 uppercase tracking-wider">Alumni Co-Op</p>
          </div>
        </Link>

        {/* Right Section Controls */}
        <div className="flex items-center gap-3">
          
          {/* Cart Icon */}
          <Link 
            href="/cart" 
            className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-600 transition"
            aria-label="View Cart"
          >
            🛒
          </Link>

          {/* Portal Dropdown Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsPortalOpen(!isPortalOpen)}
              className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-900 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200/80 transition"
            >
              <span>Portal</span>
              <span className={`text-[10px] transition-transform ${isPortalOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {isPortalOpen && (
              <>
                {/* Backdrop overlay to close on click outside */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsPortalOpen(false)} 
                />

                {/* Dropdown Menu matching exact original style */}
                <div className="absolute right-0 mt-2 w-60 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 p-4 space-y-4 text-left">
                  
                  {/* Category 1: Personal Portal */}
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      PERSONAL PORTAL (MEMBER)
                    </span>
                    <nav className="space-y-2">
                      <Link
                        href="/dashboard"
                        onClick={() => setIsPortalOpen(false)}
                        className="flex items-center gap-2 text-xs font-bold text-slate-800 hover:text-emerald-600 transition"
                      >
                        <span>📊</span>
                        <span>Member Dashboard</span>
                      </Link>
                      <Link
                        href="/wallet"
                        onClick={() => setIsPortalOpen(false)}
                        className="flex items-center gap-2 text-xs font-bold text-slate-800 hover:text-emerald-600 transition"
                      >
                        <span>💳</span>
                        <span>Co-Op Wallet</span>
                      </Link>
                      <Link
                        href="/orders"
                        onClick={() => setIsPortalOpen(false)}
                        className="flex items-center gap-2 text-xs font-bold text-slate-800 hover:text-emerald-600 transition"
                      >
                        <span>📦</span>
                        <span>My Orders</span>
                      </Link>
                    </nav>
                  </div>

                  {/* Category 2: Marketplace */}
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      MARKETPLACE
                    </span>
                    <nav className="space-y-2">
                      <Link
                        href="/marketplace"
                        onClick={() => setIsPortalOpen(false)}
                        className="flex items-center gap-2 text-xs font-bold text-slate-800 hover:text-emerald-600 transition"
                      >
                        <span>🛍️</span>
                        <span>Marketplace Store</span>
                      </Link>
                      <Link
                        href="/profile"
                        onClick={() => setIsPortalOpen(false)}
                        className="flex items-center gap-2 text-xs font-bold text-slate-800 hover:text-emerald-600 transition"
                      >
                        <span>👤</span>
                        <span>Profile Settings</span>
                      </Link>
                    </nav>
                  </div>

                  {/* Category 3: Vendor Portal */}
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      VENDOR PORTAL
                    </span>
                    <nav className="space-y-2">
                      <Link
                        href="/vendor/products"
                        onClick={() => setIsPortalOpen(false)}
                        className="flex items-center gap-2 text-xs font-bold text-slate-800 hover:text-emerald-600 transition"
                      >
                        <span>📦</span>
                        <span>My Products</span>
                      </Link>
                      <Link
                        href="/vendor/upload-product"
                        onClick={() => setIsPortalOpen(false)}
                        className="flex items-center gap-2 text-xs font-bold text-slate-800 hover:text-emerald-600 transition"
                      >
                        <span>➕</span>
                        <span>Upload Product</span>
                      </Link>
                    </nav>
                  </div>

                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
