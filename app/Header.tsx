'use client';

import Link from 'next/link';
import OnboardDropdown from '../components/OnboardDropdown';

export default function Header() {
  return (
    <header className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Identity */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl">🐦</span>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-sm text-slate-950 tracking-tight leading-none">
              Mighty Sparrow
            </span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-600 mt-1">
              Alumni Co-op
            </span>
          </div>
        </Link>

        {/* Desktop Centered Secondary Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/shop" className="text-xs text-slate-500 hover:text-slate-950 font-semibold transition">
            Marketplace
          </Link>
          <Link href="/dashboard" className="text-xs text-slate-500 hover:text-slate-950 font-semibold transition">
            Savings
          </Link>
          <Link href="/wallet" className="text-xs text-slate-500 hover:text-slate-950 font-semibold transition">
            Wallet
          </Link>
        </nav>

        {/* Global Action Panel */}
        <div className="flex items-center gap-3">
          {/* Quick-Drop Navigation Menu containing all user/membership pages */}
          <OnboardDropdown />
          
          <Link
            href="/dashboard"
            className="bg-slate-950 text-white text-[11px] font-bold px-4 py-2 rounded-xl hover:bg-slate-800 transition hidden sm:inline-block"
          >
            My Account
          </Link>
        </div>

      </div>
    </header>
  );
}
