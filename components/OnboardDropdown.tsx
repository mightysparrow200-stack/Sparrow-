'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function OnboardDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close the dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left font-sans" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 transition shadow-sm"
      >
        <span>Explore Portal</span>
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 text-slate-500 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu (Floats cleanly over content) */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 origin-top-right bg-white border border-slate-100 rounded-2xl shadow-xl ring-1 ring-black/5 z-50 divide-y divide-slate-100 overflow-hidden">
          
          {/* Section 1: Core Portal Dashboards */}
          <div className="p-2 space-y-1">
            <span className="block px-3 pt-1 pb-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
              Personal Portal
            </span>
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition text-left group"
            >
              <span className="text-base">📊</span>
              <div>
                <span className="block text-xs font-bold text-slate-900 group-hover:text-slate-950">
                  Member Dashboard
                </span>
                <span className="block text-[10px] text-slate-400">Manage savings & track rewards</span>
              </div>
            </Link>
            <Link
              href="/wallet"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition text-left group"
            >
              <span className="text-base">💳</span>
              <div>
                <span className="block text-xs font-bold text-slate-900 group-hover:text-slate-950">
                  Co-op Wallet
                </span>
                <span className="block text-[10px] text-slate-400">Fund security account & view transactions</span>
              </div>
            </Link>
          </div>

          {/* Section 2: Commerce & Shop */}
          <div className="p-2 space-y-1">
            <span className="block px-3 pt-1 pb-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
              Commerce & Benefits
            </span>
            <Link
              href="/shop"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition text-left group"
            >
              <span className="text-base">🛍️</span>
              <div>
                <span className="block text-xs font-bold text-slate-900 group-hover:text-slate-950">
                  Marketplace Store
                </span>
                <span className="block text-[10px] text-slate-400">Browse general merchandise & deals</span>
              </div>
            </Link>
            <Link
              href="/orders"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition text-left group"
            >
              <span className="text-base">📦</span>
              <div>
                <span className="block text-xs font-bold text-slate-900 group-hover:text-slate-950">
                  My Orders
                </span>
                <span className="block text-[10px] text-slate-400">Track shipments & view invoices</span>
              </div>
            </Link>
          </div>

          {/* Section 3: Onboarding & Partners */}
          <div className="p-2 space-y-1 bg-slate-50/50">
            <span className="block px-3 pt-1 pb-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
              Join Our Network
            </span>
            <Link
              href="/onboard/member"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white transition text-left group border border-transparent hover:border-slate-100"
            >
              <span className="text-base">🎓</span>
              <div>
                <span className="block text-xs font-bold text-slate-900 group-hover:text-emerald-600">
                  Alumni Registration
                </span>
                <span className="block text-[10px] text-slate-400">Apply to become a cooperative member</span>
              </div>
            </Link>
            <Link
              href="/onboard/vendor"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white transition text-left group border border-transparent hover:border-slate-100"
            >
              <span className="text-base">🤝</span>
              <div>
                <span className="block text-xs font-bold text-slate-900 group-hover:text-amber-500">
                  Partner Vendor
                </span>
                <span className="block text-[10px] text-slate-400">Apply to sell general goods to members</span>
              </div>
            </Link>
          </div>

          {/* Section 4: Vendor Dashboard Options */}
          <div className="p-2 space-y-1 bg-emerald-50/30">
            <span className="block px-3 pt-1 pb-1 text-[9px] font-bold uppercase tracking-wider text-emerald-600/80">
              Vendor Management
            </span>
            <Link
              href="/vendor/products"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white transition text-left group border border-transparent hover:border-slate-100"
            >
              <span className="text-base">🏪</span>
              <div>
                <span className="block text-xs font-bold text-slate-900 group-hover:text-emerald-600">
                  My Uploaded Products
                </span>
                <span className="block text-[10px] text-slate-400">Manage, edit, or remove your listings</span>
              </div>
            </Link>
            <Link
              href="/vendor/upload-product"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white transition text-left group border border-transparent hover:border-slate-100"
            >
              <span className="text-base">➕</span>
              <div>
                <span className="block text-xs font-bold text-slate-900 group-hover:text-emerald-600">
                  Upload New Product
                </span>
                <span className="block text-[10px] text-slate-400">Add a new deal to the marketplace</span>
              </div>
            </Link>
          </div>

        </div>
      )}
    </div>
  );
}
