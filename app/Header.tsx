'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function GlobalHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown if user clicks outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determine active portal name to display on the button
  const getActivePortalName = () => {
    if (pathname.includes('/vendor/products')) return 'My Inventory';
    if (pathname.includes('/vendor/upload-product')) return 'Upload Product';
    if (pathname.includes('/vendor/profile')) return 'Vendor Profile';
    return 'Explore Portal';
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100 px-4 py-3.5 font-sans shadow-sm">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center gap-3">
          <span className="text-3xl">🐦</span>
          <div>
            <span className="block text-sm font-bold tracking-tight text-slate-900">
              Mighty Sparrow
            </span>
            <span className="block text-[9px] font-black tracking-widest text-emerald-600 uppercase">
              Alumni Co-Op
            </span>
          </div>
        </Link>

        {/* Global Navigation Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 border border-slate-200 hover:border-slate-300 rounded-2xl px-4 py-2.5 bg-white transition text-left"
          >
            <div>
              <span className="block text-[8px] font-black uppercase tracking-wider text-slate-400">
                Explore Portal
              </span>
              <span className="block text-xs font-bold text-slate-800">
                {getActivePortalName()}
              </span>
            </div>
            <span className={`text-slate-400 text-[10px] transition-transform duration-200 ml-1 ${isOpen ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>

          {/* Dropdown Options */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-slate-50">
              <div className="px-4 py-2 bg-slate-50/50">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Vendor Actions
                </span>
              </div>
              
              <Link
                href="/vendor/products"
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-4 py-3 text-xs font-bold transition ${
                  pathname === '/vendor/products'
                    ? 'text-emerald-600 bg-emerald-50/30'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>📦 My Inventory</span>
                {pathname === '/vendor/products' && <span className="text-emerald-600 text-[10px]">●</span>}
              </Link>

              <Link
                href="/vendor/upload-product"
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-4 py-3 text-xs font-bold transition ${
                  pathname === '/vendor/upload-product'
                    ? 'text-emerald-600 bg-emerald-50/30'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>➕ Upload Product</span>
                {pathname === '/vendor/upload-product' && <span className="text-emerald-600 text-[10px]">●</span>}
              </Link>

              <Link
                href="/vendor/profile"
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-4 py-3 text-xs font-bold transition ${
                  pathname === '/vendor/profile'
                    ? 'text-emerald-600 bg-emerald-50/30'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>👤 Profile & Payouts</span>
                {pathname === '/vendor/profile' && <span className="text-emerald-600 text-[10px]">●</span>}
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
