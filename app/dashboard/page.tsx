'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import VendorDashboard from '@/app/dashboard/components/VendorDasboard';
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
  const [isVendor, setIsVendor] = useState(false);
  const [viewMode, setViewMode] = useState<'vendor' | 'member'>('member');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          window.location.href = '/login';
          return;
        }

        // 1. Fetch User Profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileData) {
          setProfile({
            id: user.id,
            full_name: profileData.full_name || user.email?.split('@')[0] || 'Member',
            email: user.email || '',
            role: profileData.role || 'member',
            shares: profileData.shares || 0,
            equity_stake: profileData.equity_stake || 0,
            total_dividends: profileData.total_dividends || 0,
            savings_balance: profileData.savings_balance || 0,
            department: profileData.department,
            graduation_year: profileData.graduation_year,
          });
        }

        // 2. Check if logged-in user is registered as a Vendor
        const { data: vendorData } = await supabase
          .from('vendors')
          .select('id, status')
          .eq('user_id', user.id)
          .maybeSingle();

        if (vendorData) {
          setIsVendor(true);
          setViewMode('vendor'); // Default to Vendor View if account is a vendor
        }
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-500">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-sans space-y-6">
      {/* VENDOR / MEMBER ROLE TOGGLE SWITCH (Visible to Vendors) */}
      {isVendor && (
        <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center justify-between border border-slate-200">
          <span className="text-xs font-extrabold text-slate-600 pl-3">Switch Dashboard View:</span>
          <div className="flex gap-1">
            <button
              onClick={() => setViewMode('vendor')}
              className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition ${
                viewMode === 'vendor'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Vendor Merchant View
            </button>
            <button
              onClick={() => setViewMode('member')}
              className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition ${
                viewMode === 'member'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Member Equity View
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* VENDOR DASHBOARD VIEW                                               */}
      {/* ------------------------------------------------------------------- */}
      {viewMode === 'vendor' && isVendor ? (
        <div>
          <div className="border-b border-slate-200 pb-4 mb-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
              Vendor Merchant Portal
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-2">Vendor Control Center</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage listed products, track inventory levels, and process store orders.
            </p>
          </div>

          <VendorDashboard />
        </div>
      ) : (
        /* ------------------------------------------------------------------- */
        /* MEMBER DASHBOARD VIEW                                               */
        /* ------------------------------------------------------------------- */
        <div>
          <div className="border-b border-slate-200 pb-4 mb-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-800 bg-blue-100 px-3 py-1 rounded-full border border-blue-300">
              Member Equity & Savings Portal
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-2">Alumni & Community Portal</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Access your personalized cooperative equity, track pool shares, and manage savings.
            </p>
          </div>

          {/* MEMBER PROFILE CARD */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4 mb-6">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
      )}
    </div>
  );
}
