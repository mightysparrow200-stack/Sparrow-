'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getCart } from '@/lib/cart';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);
  const pathname = usePathname();

  // Check if current route belongs to vendor portal
  const isVendorPage = pathname?.startsWith('/vendor');

  // Sync cart count from local storage
  const updateCartCount = () => {
    try {
      const items = getCart();
      const total = items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
      setCartCount(total);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();

    // Listen for custom cart events & window focus to update badge dynamically
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdated', updateCartCount);

    // Fetch user auth session from Supabase
    async function getUserSession() {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    }
    getUserSession();

    // Listen for real-time auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
      authListener.subscription.unsubscribe();
    };
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100 px-4 py-3 font-sans shadow-2xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🦅</span>
          <div>
            <h1 className="text-sm font-bold text-slate-900 leading-tight">Mighty Sparrow</h1>
            <p className="text-[9px] font-semibold text-emerald-600 uppercase tracking-wider">
              {isVendorPage ? 'Vendor Portal' : 'Alumni Co-Op'}
            </p>
          </div>
        </Link>

        {/* Right Section Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Cart Icon with Live Count Badge */}
          {!isVendorPage && (
            <Link
              href="/cart"
              className="relative p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-700 transition flex items-center justify-center gap-1.5 px-3 py-2 border border-slate-200/60"
              aria-label="View Cart"
            >
              <span className="text-base">🛒</span>
              <span className="text-xs font-bold hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="bg-amber-500 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
          )}

          {/* Direct Sign In or Profile Nav Item */}
          {user ? (
            <Link
              href="/profile"
              className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-2 rounded-xl border border-emerald-200 transition"
            >
              <span className="text-sm">👤</span>
              <span className="max-w-[80px] sm:max-w-[120px] truncate">
                {user.user_metadata?.full_name || 'Profile'}
              </span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-2xs"
            >
              <span className="text-sm">🔑</span>
              <span>Sign In</span>
            </Link>
          )}

        </div>
      </div>
    </header>
  );
}
