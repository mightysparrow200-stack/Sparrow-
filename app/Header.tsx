'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
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

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100 px-4 py-3 font-sans shadow-sm">
      <div className="max-w-4xl mx-auto flex items-center justify-between relative">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-3xl">🐦</span>
          <div>
            <span className="block text-sm font-bold tracking-tight text-slate-900 leading-tight">
              Mighty Sparrow
            </span>
            <span className="block text-[9px] font-black tracking-widest text-emerald-600 uppercase leading-none">
              Alumni Co-Op
            </span>
          </div>
        </Link>

        {/* Explore Portal Dropdown Container */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-4 border border-slate-200 hover:border-slate-300 rounded-2xl px-5 py-2.5 bg-white transition text-left focus:outline-none select-none"
          >
            <span className="text-sm font-bold text-slate-800 tracking-wide">
              Explore Portal
            </span>
            <span className={`text-slate-400 text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>

          {/* Clean 6-Item Dropdown List */}
          {isOpen && (
            <div className="absolute right-0 mt-3 w-80 max-h-[85vh] overflow-y-auto bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 divide-y divide-slate-100 font-sans">
              
              {/* SECTION 1: PERSONAL PORTAL */}
              <div className="py-2">
                <div className="px-5 py-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Personal Portal
                  </span>
                </div>
                
                <Link
                  href="/member/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-start gap-4 px-5 py-3 hover:bg-slate-50 transition"
                >
                  <span className="text-2xl mt-0.5 shrink-0">📊</span>
                  <div>
                    <span className="block text-sm font-bold text-slate-800 leading-tight">
                      Member Dashboard
                    </span>
                    <span className="block text-xs text-slate-500 mt-1 leading-snug">
                      Manage savings & track rewards
                    </span>
                  </div>
                </Link>

                <Link
                  href="/member/wallet"
                  onClick={() => setIsOpen(false)}
                  className="flex items-start gap-4 px-5 py-3 hover:bg-slate-50 transition"
                >
                  <span className="text-2xl mt-0.5 shrink-0">💳</span>
                  <div>
                    <span className="block text-sm font-bold text-slate-800 leading-tight">
                      Co-op Wallet
                    </span>
                    <span className="block text-xs text-slate-500 mt-1 leading-snug">
                      Fund security account & view transactions
                    </span>
                  </div>
                </Link>
              </div>

              {/* SECTION 2: COMMERCE & BENEFITS */}
              <div className="py-2">
                <div className="px-5 py-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Commerce & Benefits
                  </span>
                </div>

                <Link
                  href="/marketplace"
                  onClick={() => setIsOpen(false)}
                  className="flex items-start gap-4 px-5 py-3 hover:bg-slate-50 transition"
                >
                  <span className="text-2xl mt-0.5 shrink-0">🛍️</span>
                  <div>
                    <span className="block text-sm font-bold text-slate-800 leading-tight">
                      Marketplace Store
                    </span>
                    <span className="block text-xs text-slate-500 mt-1 leading-snug">
                      Browse general merchandise & deals
                    </span>
                  </div>
                </Link>

                <Link
                  href="/member/orders"
                  onClick={() => setIsOpen(false)}
                  className="flex items-start gap-4 px-5 py-3 hover:bg-slate-50 transition"
                >
                  <span className="text-2xl mt-0.5 shrink-0">📦</span>
                  <div>
                    <span className="block text-sm font-bold text-slate-800 leading-tight">
                      My Orders
                    </span>
                    <span className="block text-xs text-slate-500 mt-1 leading-snug">
                      Track shipments & view invoices
                    </span>
                  </div>
                </Link>
              </div>

              {/* SECTION 3: JOIN OUR NETWORK */}
              <div className="py-2">
                <div className="px-5 py-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Join Our Network
                  </span>
                </div>

                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-start gap-4 px-5 py-3 hover:bg-slate-50 transition"
                >
                  <span className="text-2xl mt-0.5 shrink-0">🎓</span>
                  <div>
                    <span className="block text-sm font-bold text-slate-800 leading-tight">
                      Alumni Registration
                    </span>
                    <span className="block text-xs text-slate-500 mt-1 leading-snug">
                      Apply to become a cooperative member
                    </span>
                  </div>
                </Link>

                <Link
                  href="/vendor/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-start gap-4 px-5 py-3 hover:bg-slate-50 transition"
                >
                  <span className="text-2xl mt-0.5 shrink-0">🤝</span>
                  <div>
                    <span className="block text-sm font-bold text-slate-800 leading-tight">
                      Partner Vendor
                    </span>
                    <span className="block text-xs text-slate-500 mt-1 leading-snug">
                      Apply to sell on the cooperative marketplace
                    </span>
                  </div>
                </Link>
              </div>

            </div>
          )}
        </div>

      </div>
    </header>
  );
}
