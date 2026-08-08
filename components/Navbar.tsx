'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isPortalOpen, setIsPortalOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100 px-4 py-3">
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
          {/* Wallet Badge */}
          <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50/80 border border-emerald-100 px-3 py-1.5 rounded-xl">
            <span className="text-[9px] font-bold text-emerald-800 uppercase tracking-wider">Co-Op Wallet</span>
            <span className="text-xs font-bold text-emerald-600">₦0.00</span>
          </div>

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
              <span className={`text-[10px] transition-transform ${isPortalOpen ? 'rotate-180' : ''}`}>▲</span>
            </button>

            {isPortalOpen && (
              <>
                {/* Backdrop overlay to close on tap outside */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsPortalOpen(false)} 
                />

                {/* Dropdown Menu Box */}
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 p-3 space-y-3">
                  
                  {/* Section 1: Personal Portal (Member) */}
                  <div>
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">
                      Personal Portal (Member)
                    </span>
                    <nav className="space-y-0.5">
                      <Link
                        href="/dashboard"
                        onClick={() => setIsPortalOpen(false)}
                        className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition"
                      >
                        📊 Member Dashboard
                      </Link>
                      <Link
                        href="/wallet"
                        onClick={() => setIsPortalOpen(false)}
                        className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition"
                      >
                        💳 Co-Op Wallet
                      </Link>
                      <Link
                        href="/orders"
                        onClick={() => setIsPortalOpen(false)}
                        className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition"
                      >
                        📦 My Orders
                      </Link>
                    </nav>
                  </div>

                  <hr className="border-slate-100" />

                  {/* Section 2: Marketplace */}
                  <div>
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">
                      Marketplace
                    </span>
                    <nav className="space-y-0.5">
                      <Link
                        href="/marketplace"
                        onClick={() => setIsPortalOpen(false)}
                        className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition"
                      >
                        🛍️ Marketplace Store
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setIsPortalOpen(false)}
                        className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition"
                      >
                        👤 Profile Settings
                      </Link>
                    </nav>
                  </div>

                  <hr className="border-slate-100" />

                  {/* Section 3: Vendor Portal (NEW) */}
                  <div>
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">
                      Vendor Portal
                    </span>
                    <nav className="space-y-0.5">
                      <Link
                        href="/vendor/products"
                        onClick={() => setIsPortalOpen(false)}
                        className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition"
                      >
                        📦 My Products
                      </Link>
                      <Link
                        href="/vendor/upload-product"
                        onClick={() => setIsPortalOpen(false)}
                        className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition"
                      >
                        ➕ Upload Product
                      </Link>
                    </nav>
                  </div>

                  <hr className="border-slate-100" />

                  {/* Section 4: Authentication */}
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsPortalOpen(false);
                        // handle sign out logic here
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition"
                    >
                      🚪 Sign Out
                    </button>
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
