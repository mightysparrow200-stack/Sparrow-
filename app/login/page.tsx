'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Tab state (signin or signup)
  const initialTab = searchParams.get('tab') === 'signup' ? 'signup' : 'signin';
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>(initialTab);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'member' | 'vendor'>('member');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    // Keep tab in sync with URL query param if present
    const tabParam = searchParams.get('tab');
    if (tabParam === 'signup') {
      setActiveTab('signup');
    } else if (tabParam === 'signin') {
      setActiveTab('signin');
    }
  }, [searchParams]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (activeTab === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          const msg =
            error.message && error.message !== '{}'
              ? error.message
              : 'Invalid login credentials or network issue.';
          setErrorMsg(msg);
          setLoading(false);
          return;
        }

        // Hard redirect on login to sync server session cookies
        window.location.href = '/dashboard';
      } else {
        // Sign up logic
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone: phone,
              role: role,
            },
          },
        });

        if (signUpError) {
          const msg =
            signUpError.message && signUpError.message !== '{}'
              ? signUpError.message
              : 'Registration failed. Check if your account already exists or verify connection.';
          setErrorMsg(msg);
          setLoading(false);
          return;
        }

        if (authData.user) {
          // Sync profile to database table
          const { error: profileError } = await supabase.from('profiles').upsert({
            id: authData.user.id,
            full_name: fullName,
            phone: phone,
            role: role,
          });

          if (profileError) console.error('Profile sync notice:', profileError.message);
        }

        setSuccessMsg('Account created successfully! Redirecting...');

        // Force browser redirect immediately to destination route
        const targetUrl = role === 'vendor' ? '/vendor' : '/dashboard';
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 800);
      }
    } catch (err: any) {
      const fallbackMsg =
        err?.message && err.message !== '{}'
          ? err.message
          : 'An unexpected authentication error occurred.';
      setErrorMsg(fallbackMsg);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden font-sans">
      
      {/* TABS */}
      <div className="flex border-b border-slate-100 bg-slate-50/50 p-1.5">
        <button
          type="button"
          onClick={() => {
            setActiveTab('signin');
            setErrorMsg(null);
          }}
          className={`flex-1 py-2.5 text-xs font-bold rounded-2xl transition ${
            activeTab === 'signin'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('signup');
            setErrorMsg(null);
          }}
          className={`flex-1 py-2.5 text-xs font-bold rounded-2xl transition ${
            activeTab === 'signup'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Join Co-Op
        </button>
      </div>

      {/* FORM BODY */}
      <div className="p-6 sm:p-8">
        <div className="text-center mb-6">
          <h1 className="text-xl font-black text-slate-900">
            {activeTab === 'signin' ? 'Welcome Back' : 'Member Registration'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {activeTab === 'signin'
              ? 'Access your alumni co-op portal and wallet'
              : 'Join the community to unlock member prices and benefits'}
          </p>
        </div>

        {/* ERROR DISPLAY */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-medium text-rose-700">
            {typeof errorMsg === 'string' && errorMsg !== '{}'
              ? errorMsg
              : 'Unable to complete registration. Please check your details and try again.'}
          </div>
        )}

        {/* SUCCESS BANNER */}
        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs font-medium text-emerald-700">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {activeTab === 'signup' && (
            <>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Joseph Peter"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+234..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('member')}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition ${
                      role === 'member'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Co-op Member
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('vendor')}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition ${
                      role === 'vendor'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Vendor / Merchant
                  </button>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span className="inline-block animate-pulse">Processing...</span>
            ) : activeTab === 'signin' ? (
              'Sign In to Account'
            ) : (
              'Complete Registration'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/shop"
            className="text-xs font-bold text-slate-500 hover:text-slate-800 transition"
          >
            ← Back to Marketplace Store
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-slate-50">
      <Suspense fallback={<div className="w-full max-w-md h-96 bg-white animate-pulse rounded-3xl" />}>
        <AuthForm />
      </Suspense>
    </div>
  );
              }
