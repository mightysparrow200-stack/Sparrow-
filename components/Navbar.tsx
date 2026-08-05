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
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // Cart & Wallet context values
  const memberBalance = context?.memberBalance ?? 0;
  const cart = context?.cart ?? [];
  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // 1. Unified Session Sync
  useEffect(() => {
    let isMounted = true;

    const syncUser = async (sessionUser: any) => {
      if (!sessionUser) {
        if (isMounted) {
          setUser(null);
          setRole(null);
          setLoading(false);
        }
        return;
      }

      if (isMounted) setUser(sessionUser);

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', sessionUser.id)
        .single();

      if (isMounted) {
        setRole(profile?.role || 'member');
        setLoading(false);
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

  // 2. Click Outside & Esc Key Listener
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
    setIsOpen(false);
    // Hard refresh on sign out to clear cookies and server component cache
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
          
          {/* WALLET DISPLAY (LOGGED IN) */}
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
            /* GUEST LINKS */
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link 
                href="/shop" 
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-2 py-1.5 transition"
              >
                Store
              </Link>
              <Link 
                href="/login" 
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-2 py-1.5 transition"
              >
                Sign In
              </Link>
              <Link
                href="/login?tab=signup"
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition"
              >
                Join Coop
              </Link>
            </div>
          ) : (
            /* LOGGED-IN EXPLORE PORTAL DROPDOWN */
