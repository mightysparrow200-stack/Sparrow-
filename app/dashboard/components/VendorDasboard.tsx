'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import VendorDashboard from './components/VendorDasboard'; // Importing your existing component

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [isVendor, setIsVendor] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUserAndRole() {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          window.location.href = '/login';
          return;
        }

        // Fetch user profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        setProfile(profileData);

        // Check if user is a vendor
        const { data: vendorData } = await supabase
          .from('vendors')
          .select('id, status')
          .eq('user_id', user.id)
          .maybeSingle();

        if (vendorData) {
          setIsVendor(true);
        }
      } catch (err) {
        console.error('Error fetching dashboard status:', err);
      } finally {
        setLoading(false);
      }
    }

    checkUserAndRole();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-sans">
        <p className="text-xs font-bold text-slate-500">Loading Dashboard...</p>
      </div>
    );
  }

  // Render Vendor Dashboard if user is registered as a vendor
  if (isVendor) {
    return <VendorDashboard />;
  }

  // Render standard Member Dashboard for normal members
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-sans space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Alumni & Community Portal</h1>
        <p className="text-xs text-slate-500 mt-1">
          Access your personalized cooperative equity, track pool shares, and manage savings.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Active Member ({profile?.role || 'member'})
          </span>
          <h2 className="text-xl font-black text-slate-900 mt-2">{profile?.full_name || 'Member'}</h2>
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
    </div>
  );
}
