'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useCoOp } from './CoOpState';

export default function Header() {
  const context = useCoOp();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fallback safe checks if state context isn't fully loaded yet
  const isMember = context?.isMember ?? false;
  const memberBalance = context?.memberBalance ?? 0;
  const cart = context?.cart ?? [];
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

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
      <div className="max-w-5xl mx-auto flex items-center justify-between relative h-10">
        
        {/* Brand Logo / Home Trigger */}
        <Link href="/shop" className="flex items-center gap-2 shrink-0 group" title="Go to Home">
          <span className="text-3xl transition-transform group-hover:scale-105 duration-200">🐦</span>
          <div>
            <span className="block text-sm font-bold tracking-tight text-slate-900 leading-tight group-hover:text-emerald-600 transition-colors">
              Mighty Sparrow
            </span>
            <span className="block text-[9px] font-black tracking-widest text-emerald-600 uppercase leading-none">
              Alumni Co-Op
            </span>
          </div>
        </Link>

        {/* Dynamic Cart, Wallet Status, and Explore Dropdown Menu */}
        <div className="flex items-center gap-3">
          
          {/* Dynamic Wallet Balance Display (Visible if member) */}
          {isMember && (
            <div className="hidden sm:flex flex-col items-end bg-emerald-50/70 border border-emerald-100/50 px-3 py-1 rounded-xl">
              <span className="text-[8px] uppercase tracking-wider text-emerald-600 font-bold leading-tight">
                Co-Op Wallet
              </span>
              <span className="text-xs font-black text-emerald-800 leading-none mt-0.5">
                ₦{memberBalance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}

          {/* Cart Trigger Icon with Badge */}
          <Link 
            href="/cart" 
            className="relative p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition text-slate-700"
            aria-label="View Cart"
          >
            <span className="text-lg">🛒</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Explore Portal Dropdown Container */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-3 border border-slate-200 hover:border-slate-300 rounded-2xl px-4 py-2 bg-white transition text-left focus:outline-none select-none h-10"
            >
              <span className="text-xs font-bold text-slate-800 tracking-wide">
                Explore Portal
              </span>
              <span className={`text-slate-400 text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {/* Clean Dropdown List using your real file paths */}
            {isOpen && (
              <div className="absolute right-0 mt-3 w-80 max-h-[85vh] overflow-y-auto bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 divide-y divide-slate-100 font-sans">
                
                {/* SECTION 1: PERSONAL PORTAL */}
                <div className="py-2">
                  <div className="px-5 py-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Personal Portal
                    </span>
                  </div>

                  {/* ADDED: My Profile Link mapping directly to your vendor/profile path */}
                  <Link
                    href="/vendor/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-start gap-4 px-5 py-3 hover:bg-slate-50 transition"
                  >
                    <span className="text-2xl mt-0.5 shrink-0">👤</span>
                    <div>
                      <span className="block text-sm font-bold text-slate-800 leading-tight">
                        My Profile
                      </span>
                      <span className="block text-xs text-slate-500 mt-1 leading-snug">
                        Manage your profile details and settings
                      </span>
                    </div>
                  </Link>
                  
                  <Link
                    href="/dashboard"
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
                    href="/wallet"
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

                  {/* Marketplace Store / Home */}
                  <Link
                    href="/shop"
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
                    href="/orders"
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
                    href="/onboard/member"
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
                    href="/onboard/vendor"
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

      </div>
    </header>
  );
}
