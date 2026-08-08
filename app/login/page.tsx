'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialTab = searchParams.get('tab') === 'signup' ? 'signup' : 'signin';
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>(initialTab);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'member' | 'vendor'>('member');

  // Vendor-Specific Fields
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('General');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
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
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.error('Sign In Error:', error);
          setErrorMsg(error.message || 'Invalid login credentials.');
          setLoading(false);
          return;
        }

        if (data.session) {
          setSuccessMsg('Signed in successfully! Redirecting...');
          window.location.href = '/dashboard';
        }
      } else {
        // Validation for Vendor
        if (role === 'vendor' && !businessName.trim()) {
          setErrorMsg('Please enter your Business / Store Name.');
          setLoading(false);
          return;
        }

        // 1. Register Auth User
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
          console.error('SignUp Error:', signUpError);
          setErrorMsg(signUpError.message || 'Registration failed.');
          setLoading(false);
          return;
        }

        if (authData.user) {
          // 2. Insert/Upsert into Profiles Table
          const { error: profileError } = await supabase.from('profiles').upsert({
            id: authData.user.id,
            full_name: fullName,
            phone: phone,
            role: role,
          });

          if (profileError) {
            console.error('Profile sync notice:', profileError.message);
          }

          // 3. Insert into Vendors Table if Role is 'vendor'
          if (role === 'vendor') {
            const { error: vendorError } = await supabase.from('vendors').upsert({
              user_id: authData.user.id,
              business_name: businessName,
              category: category,
              status: 'approved', // Auto-approve or set to 'pending' based on preference
            });

            if (vendorError) {
              console.error('Vendor setup notice:', vendorError.message);
            }
          }
        }

        if (authData.session) {
          setSuccessMsg('Account created successfully! Redirecting...');
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 800);
        } else {
          setSuccessMsg('Account registered! Please sign in below.');
          setActiveTab('signin');
          setLoading(false);
        }
      }
    } catch (err: any) {
      console.error('Caught Exception:', err);
      setErrorMsg(err?.message || 'An unexpected authentication error occurred.');
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
            setSuccessMsg(null);
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
            setSuccessMsg(null);
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
            {activeTab === 'signin' ? 'Welcome Back' : 'Registration Portal'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {activeTab === 'signin'
              ? 'Access your alumni co-op portal and store'
              : 'Join as a co-op member or register your business'}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-medium text-rose-700">
            {errorMsg}
          </div>
        )}

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

              {/* DYNAMIC VENDOR FIELDS */}
              {role === 'vendor' && (
                <div className="p-3.5 bg-emerald-50/50 border border-emerald-200 rounded-2xl space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-emerald-900 mb-1">
                      Business / Store Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mighty Sparrow Agro"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-emerald-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-emerald-900 mb-1">
                      Store Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-emerald-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                    >
                      <option value="General">General Marketplace</option>
                      <option value="Agriculture">Agriculture & Food</option>
                      <option value="Electronics">Electronics & Gadgets</option>
                      <option value="Apparel">Apparel & Fashion</option>
                      <option value="Services">Services & Logistics</option>
                    </select>
                  </div>
                </div>
              )}
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
