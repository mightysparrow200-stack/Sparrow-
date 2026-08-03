'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  shares: number;
  equity_stake: number;
  total_dividends: number;
  savings_balance: number;
  department?: string;
  graduation_year?: string;
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          window.location.href = '/login';
          return;
        }

        // Fetch real user profile data
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        setProfile({
          id: user.id,
          full_name: data?.full_name || user.email?.split('@')[0] || 'Member',
          email: user.email || '',
          role: data?.role || 'member',
          shares: data?.shares || 0,
          equity_stake: data?.equity_stake || 0,
          total_dividends: data?.total_dividends || 0,
          savings_balance: data?.savings_balance || 0,
          department: data?.department,
          graduation_year: data?.graduation_year,
        });
      } catch (err) {
        console.error('Error fetching dashboard profile:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-500">Loading Portal Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-sans space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-black text-slate-900">Alumni & Community Portal</h1>
        <p className="text-xs text-slate-500 mt-1">
          Access your personalized cooperative equity, track pool shares, and manage savings.
        </p>
      </div>

      {/* MEMBER CARD */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Active Member ({profile?.role})
          </span>
          <h2 className="text-xl font-black text-slate-900 mt-2">{profile?.full_name}</h2>
          <p className="text-xs text-slate-500">{profile?.email}</p>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Cooperative Savings
          </span>
          <span className="text-2xl font-black text-slate-900">
            ₦{(profile?.savings_balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* SHARES & DIVIDENDS STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SHARES CARD */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Pool Shares Owned
          </span>
          <div className="text-3xl font-black text-slate-900">
            {(profile?.shares || 0).toLocaleString()} <span className="text-sm font-bold text-slate-400">Shares</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Representing an active {profile?.equity_stake || 0}% stake in community physical assets.
          </p>
        </div>

        {/* DIVIDENDS CARD */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Total Dividends Received
          </span>
          <div className="text-3xl font-black text-amber-600">
            ₦{(profile?.total_dividends || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Calculated quarterly based on total marketplace external trade yields.
          </p>
        </div>
      </div>

      {/* ACCOUNT DETAILS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
          Account Identifiers
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block">Account Email</span>
            <span className="font-bold text-slate-800">{profile?.email}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Department / Year</span>
            <span className="font-bold text-slate-800">
              {profile?.department || 'N/A'} {profile?.graduation_year ? `('${profile?.graduation_year.slice(-2)})` : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
