'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCoOp } from './CoOpState';

export default function Header() {
  const context = useCoOp();
  const [isOpen, setIsOpen] = useState(false);
  const [vendorMenuOpen, setVendorMenuOpen] = useState(false);

  // Fallback safe checks if state context isn't fully loaded yet
  const isMember = context?.isMember ?? false;
  const memberBalance = context?.memberBalance ?? 0;
  const cart = context?.cart ?? [];
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm font-sans">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/shop" className="flex items-center gap-2">
          <span className="text-2xl">🐦</span>
          <div>
            <span className="block text-xs font-bold uppercase tracking-widest text-emerald-800">Mighty Sparrow</span>
            <span className="block text-[9px] font-black tracking-wider text-slate-400 -mt-0.5 uppercase">ALUMNI CO-OP</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/shop" className="text-xs font-bold text-slate-600 hover:text-emerald-600 transition">
            Marketplace
          </Link>
          
          {/* VENDOR CONTROL DROPDOWN */}
          <div className="relative">
            <button 
              onClick={() => setVendorMenuOpen(!vendorMenuOpen)}
              onBlur={() => setTimeout(() => setVendorMenuOpen(false), 200)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-600 transition focus:outline-none"
            >
              <span>Merchant Portal</span>
              <span className="text-[10px] text-slate-400">▼</span>
            </button>

            {vendorMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-lg py-2 z-50 animate-fade-in">
                <Link 
                  href="/vendor/products" 
                  className="block px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition"
                >
                  🏪 My producks
                </Link>
                <Link 
                  href="/vendor/upload-product" 
                  className="block px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition"
                >
                  ➕ Upload Product
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Dynamic Cart & Wallet Status Controls */}
        <div className="flex items-center gap-3">
          {isMember && (
            <div className="hidden sm:flex flex-col items-end bg-emerald-50/70 border border-emerald-100/50 px-3 py-1 rounded-xl">
              <span className="text-[8px] uppercase tracking-wider text-emerald-600 font-bold">Co-Op Wallet</span>
              <span className="text-xs font-black text-emerald-800">
                ₦{memberBalance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}

          {/* Cart Icon */}
          <Link href="/cart" className="relative p-2 bg-slate-50 hover:bg-slate-100 rounded-xl transition">
            <span className="text-base">🛒</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu Toggle button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
          >
            <span className="text-xl">{isOpen ? '✕' : '☰'}</span>
          </button>
        </div>

      </div>

      {/* Mobile Drawer (Pulls down dynamically on smaller screens) */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white py-4 px-4 space-y-4 animate-fade-in">
          
          {/* Dynamic Wallet Balance Display inside Mobile Menu */}
          {isMember && (
            <div className="bg-emerald-50 p-3 rounded-xl flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800">Your Co-Op Balance:</span>
              <span className="text-xs font-black text-emerald-950">
                ₦{memberBalance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}

          <div className="space-y-1">
            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">Navigation</span>
            <Link 
              href="/shop" 
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition"
            >
              🛍️ Shop Marketplace
            </Link>
          </div>

          <div className="space-y-1 pt-2 border-t border-slate-50">
            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">Vendor Tools</span>
            <Link 
              href="/vendor/products" 
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition"
            >
              🏪 View My products
            </Link>
            <Link 
              href="/vendor/upload-product" 
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition"
            >
              ➕ Upload New Product
            </Link>
          </div>

        </div>
      )}
    </header>
  );
}
