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
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100 px-4 py-3.5 font-sans shadow-sm">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2">
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
            className="flex items-center gap-3 border border-slate-200 hover:border-slate-300 rounded-2xl px-4 py-2 bg-white transition text-left focus:outline-none"
          >
            <div>
              <span className="block text-[8px] font-black uppercase tracking-wider text-slate-400">
                Explore Portal
              </span>
              <span className="block text-xs font-bold text-slate-800">
                {getActivePortalName()}
              </span>
            </div>
            <span className={`text-slate-400 text-[10px] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>

          {/* Interactive Dropdown List */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-slate-50 font-sans">
              
              {/* Member Section */}
              <div className="px-4 py-2 bg-slate-50/50">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Alumni Member Portal
                </span>
              </div>
              
              <Link
                href="/marketplace"
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-4 py-3 text-xs font-bold transition ${
                  pathname === '/marketplace'
                    ? 'text-emerald-600 bg-emerald-50/30'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>🛒 Browse Marketplace</span>
                {pathname === '/marketplace' && <span className="text-emerald-600 text-[10px]">●</span>}
              </Link>

              <Link
                href="/member/profile"
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-4 py-3 text-xs font-bold transition ${
                  pathname === '/member/profile'
                    ? 'text-emerald-600 bg-emerald-50/30'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>👤 My Member Profile</span>
                {pathname === '/member/profile' && <span className="text-emerald-600 text-[10px]">●</span>}
              </Link>

              {/* Vendor Section */}
              <div className="px-4 py-2 bg-slate-50/50">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Merchant Console
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
                href="/vendor/profile"
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-4 py-3 text-xs font-bold transition ${
                  pathname === '/vendor/profile'
                    ? 'text-emerald-600 bg-emerald-50/30'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>🏪 Vendor Business Profile</span>
                {pathname === '/vendor/profile' && <span className="text-emerald-600 text-[10px]">●</span>}
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
              }
