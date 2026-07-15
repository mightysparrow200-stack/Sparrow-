import Link from 'next/link';
import OnboardDropdown from './OnboardDropdown';

export default function Navbar() {
  return (
    <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo/Identity */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl">🐦</span>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-sm text-slate-950 tracking-tight leading-none">
              Sparrow
            </span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-600 mt-0.5">
              Cooperative
            </span>
          </div>
        </Link>

        {/* Regular Navbar Navigation Link (Fallback for desktop sizing) */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/shop" className="text-xs text-gray-500 hover:text-slate-950 font-medium transition">
            Marketplace
          </Link>
          <Link href="/dashboard" className="text-xs text-gray-500 hover:text-slate-950 font-medium transition">
            Savings
          </Link>
          <Link href="/wallet" className="text-xs text-gray-500 hover:text-slate-950 font-medium transition">
            Wallet
          </Link>
        </nav>

        {/* Quick Menu Trigger Action */}
        <div className="flex items-center gap-3">
          
          {/* --- FIXED: Robust SVG Cart Icon (Works on all mobile devices) --- */}
          <Link
            href="/cart"
            className="relative p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 text-slate-700 hover:text-emerald-600 transition flex items-center justify-center"
            aria-label="View Cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
            
            {/* Cart count badge */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[8px] font-bold text-white ring-2 ring-white">
              0
            </span>
          </Link>

          <OnboardDropdown />
          
          <Link
            href="/dashboard"
            className="bg-slate-950 text-white text-[11px] font-bold px-4 py-2 rounded-xl hover:bg-slate-800 transition hidden sm:block"
          >
            My Account
          </Link>
        </div>

      </div>
    </header>
  );
}
