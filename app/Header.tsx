'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Dynamically change the subtitle under "Explore Portal" based on path
  const getActivePortalName = () => {
    if (pathname.includes('/vendor/products')) return 'My Inventory';
    if (pathname.includes('/vendor/upload-product')) return 'Upload Product';
    if (pathname.includes('/vendor/profile')) return 'Vendor Profile';
    if (pathname.includes('/member/profile')) return 'My Profile';
    if (pathname.includes('/marketplace')) return 'Marketplace';
    return 'Select Portal';
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100 px-4 py-3 font-sans shadow-sm">
      <div className="max-w-4xl mx-auto flex items-center justify-between relative">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-2xl sm:text-3xl">🐦</span>
          <div>
            <span className="block text-xs sm:text-sm font-bold tracking-tight text-slate-900 leading-tight">
              Mighty Sparrow
            </span>
            <span className="block text-[8px] sm:text-[9px] font-black tracking-widest text-emerald-600 uppercase leading-none">
              Alumni Co-Op
            </span>
          </div>
        </Link>

        {/* Global Navigation Dropdown Container */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-1.5 bg-white transition text-left focus:outline-none select-none"
          >
            <div>
              <span className="block text-[7px] font-black uppercase tracking-wider text-slate-400">
                Explore Portal
              </span>
              <span className="block text-[11px] font-bold text-slate-800 leading-tight">
                {getActivePortalName()}
              </span>
            </div>
            <span className={`text-slate-400 text-[8px] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>

          {/* Interactive Dropdown List - Positioned cleanly right-0 relative to the button wrapper */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-52 sm:w-56 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-slate-50 font-sans">
              
              {/* Member Section */}
              <div className="px-4 py-2 bg-slate-50/50">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                  Alumni Member Portal
                </span>
              </div>
              
              <Link
                href="/marketplace"
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-4 py-2.5 text-xs font-semibold transition ${
                  pathname === '/marketplace'
                    ? 'text-emerald-600 bg-emerald-50/30 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>🛒 Browse Marketplace</span>
                {pathname === '/marketplace' && <span className="text-emerald-600 text-[10px]">●</span>}
              </Link>

              <Link
                href="/member/profile"
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-4 py-2.5 text-xs font-semibold transition ${
                  pathname === '/member/profile'
                    ? 'text-emerald-600 bg-emerald-50/30 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>👤 My Member Profile</span>
                {pathname === '/member/profile' && <span className="text-emerald-600 text-[10px]">●</span>}
              </Link>

              {/* Vendor Section */}
              <div className="px-4 py-2 bg-slate-50/50">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                  Merchant Console
                </span>
              </div>

              <Link
                href="/vendor/products"
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-4 py-2.5 text-xs font-semibold transition ${
                  pathname === '/vendor/products'
                    ? 'text-emerald-600 bg-emerald-50/30 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>📦 My Inventory</span>
                {pathname === '/vendor/products' && <span className="text-emerald-600 text-[10px]">●</span>}
              </Link>

              <Link
                href="/vendor/profile"
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-4 py-2.5 text-xs font-semibold transition ${
                  pathname === '/vendor/profile'
                    ? 'text-emerald-600 bg-emerald-50/30 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>🏪 Vendor Profile</span>
                {pathname === '/vendor/profile' && <span className="text-emerald-600 text-[10px]">●</span>}
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
