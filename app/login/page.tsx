'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

type AuthMode = 'login' | 'signup' | 'forgot_password';

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (mode === 'login') {
        // 1. SIGN IN LOGIC
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        // Redirect on successful login
        window.location.href = '/profile';

      } else if (mode === 'signup') {
        // 2. CREATE ACCOUNT LOGIC
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });

        if (error) throw error;

        // If email confirmation is required by Supabase setup
        if (data?.user && !data.session) {
          setMessage({
            type: 'success',
            text: 'Account created! Please check your email to confirm registration before logging in.',
          });
        } else {
          setMessage({
            type: 'success',
            text: 'Account created successfully! Redirecting...',
          });
          setTimeout(() => {
            window.location.href = '/profile';
          }, 1500);
        }

      } else if (mode === 'forgot_password') {
        // 3. FORGOT PASSWORD LOGIC
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) throw error;

        setMessage({
          type: 'success',
          text: 'Password reset link sent! Check your email inbox.',
        });
      }
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.message || 'An error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[85vh] flex items-center justify-center px-4 py-12 font-sans bg-slate-50">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        
        {/* TAB TOGGLES FOR SIGN IN / CREATE ACCOUNT */}
        {mode !== 'forgot_password' && (
          <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setMessage(null);
              }}
              className={`py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setMessage(null);
              }}
              className={`py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* HEADER TITLE */}
        <div className="mb-6 text-center">
          <h1 className="text-xl font-black text-slate-900">
            {mode === 'login' && 'Welcome Back'}
            {mode === 'signup' && 'Create Your Account'}
            {mode === 'forgot_password' && 'Reset Password'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {mode === 'login' && 'Sign in to access your alumni co-op portal'}
            {mode === 'signup' && 'Join the Alumni Co-Op marketplace'}
            {mode === 'forgot_password' && 'Enter your email to receive a password reset link'}
          </p>
        </div>

        {/* STATUS ALERT */}
        {message && (
          <div
            className={`mb-5 p-3 rounded-xl text-xs font-semibold ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* AUTH FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* FULL NAME (Only for Create Account) */}
          {mode === 'signup' && (
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
              />
            </div>
          )}

          {/* EMAIL ADDRESS */}
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
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
            />
          </div>

          {/* PASSWORD FIELD (Sign In & Create Account) */}
          {mode !== 'forgot_password' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot_password');
                      setMessage(null);
                    }}
                    className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 transition cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
              />
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition disabled:opacity-50 cursor-pointer mt-2"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {mode === 'login' && 'Sign In to Account'}
                {mode === 'signup' && 'Create Account'}
                {mode === 'forgot_password' && 'Send Reset Link'}
              </>
            )}
          </button>
        </form>

        {/* BACK BUTTON FOR FORGOT PASSWORD */}
        {mode === 'forgot_password' && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setMessage(null);
              }}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer"
            >
              ← Back to Sign In
            </button>
          </div>
        )}

        {/* BACK TO STORE LINK */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <Link
            href="/"
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
          >
            ← Back to Marketplace Store
          </Link>
        </div>

      </div>
    </main>
  );
}
