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
          
          {/* --- ADDED: Mobile & Desktop Friendly Cart Icon --- */}
          <Link
            href="/cart"
            className="relative p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 text-slate-700 hover:text-emerald-600 transition"
            aria-label="View Cart"
          >
            <span className="text-base flex items-center">🛒</span>
            
            {/* Optional: Cart count badge indicator (e.g. if items > 0) */}
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
