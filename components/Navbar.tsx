'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useCoOp } from '@/app/CoOpState';

export default function Navbar() {
  const context = useCoOp();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isVendor, setIsVendor] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // Cart & Wallet context values
  const memberBalance = context?.memberBalance ?? 0;
  const cart = context?.cart ?? [];
  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  useEffect(() => {
    let isMounted = true;

    const syncUser = async (sessionUser: any) => {
      if (!sessionUser) {
        if (isMounted) {
          setUser(null);
          setRole(null);
          setIsVendor(false);
          setLoading(false);
        }
        return;
      }

      if (isMounted) setUser(sessionUser);

      try {
        // Fetch profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', sessionUser.id)
          .maybeSingle();

        // Check vendors table
        const { data: vendorData } = await supabase
          .from('vendors')
          .select('id')
          .eq('user_id', sessionUser.id)
          .maybeSingle();

        if (isMounted) {
          const userRole = profile?.role || 'member';
          setRole(userRole);
          // Set vendor to true if vendor record exists OR role is vendor
          setIsVendor(!!vendorData || userRole === 'vendor');
        }
      } catch (err) {
        console.error('Navbar sync error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      syncUser(session?.user || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      syncUser(session?.user || null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    setIsVendor(false);
    setIsOpen(false);
    window.location.href = '/login';
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 py-3 font-sans shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between relative h-10">
        
        {/* BRAND LOGO */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <span className="text-2xl transition-transform group-hover:scale-105 duration-200">🦅</span>
          <div>
            <span className="block text-sm font-bold text-slate-900 leading-tight group-hover:text-emerald-600 transition-colors">
              Mighty Sparrow
            </span>
            <span className="block text-[9px] font-black tracking-widest text-emerald-600 uppercase leading-none">
              Alumni Co-Op
            </span>
          </div>
        </Link>

        {/* RIGHT CONTROLS */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* WALLET DISPLAY */}
          {user && (
            <div className="flex flex-col items-end bg-emerald-50/70 border border-emerald-100/50 px-2.5 py-1 rounded-xl">
              <span className="text-[8px] uppercase tracking-wider text-emerald-600 font-bold leading-tight">
                Co-Op Wallet
              </span>
              <span className="text-xs font-black text-emerald-800 leading-none mt-0.5">
                ₦{memberBalance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}

          {/* CART BUTTON */}
          <Link 
            href="/cart" 
            className="relative p-2 bg-slate-50 hover:bg-slate-100 rounded-xl transition text-slate-700"
            aria-label="View Cart"
          >
            <span className="text-base">🛒</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                {cartCount}
              </span>
            )}
          </Link>

          {/* AUTH & DROPDOWN PORTAL */}
          {loading ? (
            <div className="w-20 h-9 bg-slate-100 animate-pulse rounded-xl" />
          ) : !user ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link href="/shop" className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-2 py-1.5 transition">
                Store
              </Link>
              <Link href="/login" className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-2 py-1.5 transition">
                Sign In
              </Link>
              <Link href="/login?tab=signup" className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition">
                Join Coop
              </Link>
            </div>
          ) : (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex items-center gap-1.5 sm:gap-2 border border-slate-200 hover:border-slate-300 rounded-xl px-2.5 sm:px-3 py-2 bg-white transition focus:outline-none select-none h-9 text-xs font-bold text-slate-800"
              >
                <span>Portal</span>
                <span className={`text-slate-400 text-[10px] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>

              {isOpen && (
                <div className="absolute right-0 mt-3 w-72 max-h-[85vh] overflow-y-auto bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 divide-y divide-slate-100 font-sans">
                  
                  {/* ROLE SPECIFIC PORTAL LINKS */}
                  <div className="py-2">
                    <span className="block px-4 py-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      Personal Portal ({isVendor ? 'Vendor' : role || 'Member'})
                    </span>

                    <Link
                      href="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50"
                    >
                      <span>📊</span> Dashboard
                    </Link>

                    {/* ALWAYS VISIBLE VENDOR PORTAL OPTION OR FOR VENDORS */}
                    <Link
                      href="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                    >
                      <span>🏪</span> Vendor Control Center
                    </Link>

                    <Link
                      href="/wallet"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50"
                    >
                      <span>💳</span> Co-Op Wallet
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50"
                    >
                      <span>📦</span> My Orders
                    </Link>
                  </div>

                  {/* MARKETPLACE LINKS */}
                  <div className="py-2">
                    <span className="block px-4 py-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      Marketplace
                    </span>
                    <Link
                      href="/shop"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50"
                    >
                      <span>🛍️</span> Marketplace Store
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50"
                    >
                      <span>👤</span> Profile Settings
                    </Link>
                  </div>

                  {/* SIGN OUT */}
                  <div className="p-2 bg-slate-50">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full text-left flex items-center gap-3 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    >
                      <span>🚪</span> Sign Out
                    </button>
                  </div>

                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </header>
  );
}
