'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function OnboardDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close the dropdown when clicking anywhere outside of it
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
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border border-gray-200 bg-white hover:bg-gray-50 text-slate-800 transition shadow-sm"
      >
        <span>Explore Portal</span>
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 text-gray-500 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu (All user-facing pages, excluding admin) */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 origin-top-right bg-white border border-gray-100 rounded-2xl shadow-xl ring-1 ring-black/5 z-50 divide-y divide-gray-100 overflow-hidden">
          
          {/* Section 1: Core Portal Dashboards */}
          <div className="p-2 space-y-1">
            <span className="block px-3 pt-1 pb-1 text-[9px] font-bold uppercase tracking-wider text-gray-400">
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
                <span className="block text-[10px] text-gray-400">Manage savings & track rewards</span>
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
                <span className="block text-[10px] text-gray-400">Fund accounts & view payments</span>
              </div>
            </Link>
          </div>

          {/* Section 2: Commerce & Shop */}
          <div className="p-2 space-y-1">
            <span className="block px-3 pt-1 pb-1 text-[9px] font-bold uppercase tracking-wider text-gray-400">
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
                <span className="block text-[10px] text-gray-400">Browse general goods & offers</span>
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
                <span className="block text-[10px] text-gray-400">Track purchases & payments</span>
              </div>
            </Link>
          </div>

          {/* Section 3: Onboarding & Partners */}
          <div className="p-2 space-y-1 bg-slate-50/50">
            <span className="block px-3 pt-1 pb-1 text-[9px] font-bold uppercase tracking-wider text-gray-400">
              Join Our Network
            </span>
            <Link
              href="/onboard/member"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white transition text-left group border border-transparent hover:border-gray-100"
            >
              <span className="text-base">🎓</span>
              <div>
                <span className="block text-xs font-bold text-slate-900 group-hover:text-emerald-600">
                  Alumni Registration
                </span>
                <span className="block text-[10px] text-gray-400">Apply to become a cooperative member</span>
              </div>
            </Link>
            <Link
              href="/onboard/vendor"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white transition text-left group border border-transparent hover:border-gray-100"
            >
              <span className="text-base">🤝</span>
              <div>
                <span className="block text-xs font-bold text-slate-900 group-hover:text-amber-500">
                  Partner Vendor
                </span>
                <span className="block text-[10px] text-gray-400">Apply to sell directly on our marketplace</span>
              </div>
            </Link>
          </div>

        </div>
      )}
    </div>
  );
                  }
