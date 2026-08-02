'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 1. Check active session & user role on initial load
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
        
        // Fetch profile role from Supabase
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        setRole(profile?.role || 'member');
      } else {
        setUser(null);
        setRole(null);
      }

      setLoading(false);
    };

    checkUser();

    // 2. Listen for auth changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        checkUser();
      } else {
        setUser(null);
        setRole(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 font-sans">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo / Brand */}
        <Link href="/" className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <span className="text-lg">🦅</span>
          <span>Mighty Sparrow Coop</span>
        </Link>

        {/* Dynamic Navigation Links */}
        <nav className="flex items-center gap-4 text-xs font-semibold">
          {loading ? (
            <div className="w-16 h-4 bg-slate-100 animate-pulse rounded" />
          ) : user ? (
            <>
              {/* MEMBER LINKS */}
              {role !== 'vendor' && (
                <>
                  <Link href="/dashboard" className="text-slate-600 hover:text-slate-900 transition">
                    Dashboard
                  </Link>
                  <Link href="/shop" className="text-slate-600 hover:text-slate-900 transition">
                    Store
                  </Link>
                  <Link href="/wallet" className="text-slate-600 hover:text-slate-900 transition">
                    Wallet
                  </Link>
                  <Link href="/orders" className="text-slate-600 hover:text-slate-900 transition">
                    Orders
                  </Link>
                  <Link href="/profile" className="text-slate-600 hover:text-slate-900 transition">
                    Profile
                  </Link>
                </>
              )}

              {/* VENDOR LINKS */}
              {role === 'vendor' && (
                <>
                  <Link href="/vendor" className="text-slate-600 hover:text-slate-900 transition">
                    Vendor Portal
                  </Link>
                  <Link href="/shop" className="text-slate-600 hover:text-slate-900 transition">
                    Store
                  </Link>
                  <Link href="/vendor/products" className="text-slate-600 hover:text-slate-900 transition">
                    My Products
                  </Link>
                  <Link href="/vendor/orders" className="text-slate-600 hover:text-slate-900 transition">
                    Store Orders
                  </Link>
                </>
              )}
              
              <button
                onClick={handleSignOut}
                className="ml-2 px-3 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 rounded-lg transition"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              {/* LOGGED OUT / GUEST LINKS */}
              <Link href="/shop" className="text-slate-600 hover:text-slate-900 transition">
                Store
              </Link>
              <Link href="/login" className="text-slate-600 hover:text-slate-900 transition">
                Sign In
              </Link>
              <Link
                href="/login?tab=signup"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-sm transition"
              >
                Join Coop
              </Link>
            </>
          )}
        </nav>

      </div>
    </header>
  );
}
