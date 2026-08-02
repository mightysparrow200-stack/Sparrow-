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
    const fetchSessionAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
        
        // Fetch user profile role from Supabase
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

    fetchSessionAndProfile();

    // Listen to Auth State changes (Login / Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchSessionAndProfile();
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
        
        {/* Brand Logo */}
        <Link href="/" className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <span className="text-lg">🦅</span>
          <span>Mighty Sparrow</span>
        </Link>

        {/* Dynamic Navigation */}
        <nav className="flex items-center gap-4 text-xs font-semibold">
          {loading ? (
            <div className="w-20 h-4 bg-slate-100 animate-pulse rounded-md" />
          ) : user ? (
            <>
              {/* MEMBER SPECIFIC LINKS */}
              {role === 'member' && (
                <>
                  <Link href="/dashboard" className="text-slate-600 hover:text-slate-900 transition">
                    Dashboard
                  </Link>
                  <Link href="/wallet" className="text-slate-600 hover:text-slate-900 transition">
                    Wallet
                  </Link>
                  <Link href="/orders" className="text-slate-600 hover:text-slate-900 transition">
                    My Orders
                  </Link>
                </>
              )}

              {/* VENDOR SPECIFIC LINKS */}
              {role === 'vendor' && (
                <>
                  <Link href="/vendor" className="text-slate-600 hover:text-slate-900 transition">
                    Vendor Portal
                  </Link>
                  <Link href="/vendor/products" className="text-slate-600 hover:text-slate-900 transition">
                    Products
                  </Link>
                  <Link href="/vendor/orders" className="text-slate-600 hover:text-slate-900 transition">
                    Store Orders
                  </Link>
                </>
              )}

              <button
                onClick={handleSignOut}
                className="ml-2 px-3 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 rounded-xl transition"
              >
                Sign Out
              </button>
            </>
          ) : (
            /* GUEST LINKS */
            <>
              <Link href="/store" className="text-slate-600 hover:text-slate-900 transition">
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
