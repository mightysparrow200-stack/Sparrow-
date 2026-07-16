'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useCoOp } from '../CoOpState';
import { supabase } from '../utils/supabase';

function DashboardPage() {
  const context = useCoOp();
  const [depositAmount, setDepositAmount] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!context) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-gray-500 font-medium">Loading Alumni Portal...</p>
      </div>
    );
  }

  // FIXED: Destructured user, profile, isMember, and memberBalance instead of legacy manual state-setters
  const { user, profile, isMember, memberBalance } = context;

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    
    if (isNaN(amount) || amount <= 0) {
      setFeedback('Please enter a valid deposit amount.');
      return;
    }

    try {
      setIsSubmitting(true);
      setFeedback('');

      if (!user) {
        throw new Error('Please log in to manage your cooperative balance.');
      }

      // Calculate the updated balance
      const newBalance = memberBalance + amount;

      // Update the live balance in the Supabase wallets table
      const { error } = await supabase
        .from('wallets')
        .update({ balance: newBalance })
        .eq('user_id', user.id);

      if (error) throw error;

      setDepositAmount('');
      setFeedback(`Deposit of ₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })} submitted successfully!`);
      
      // Reload page to re-fetch context data from Supabase
      setTimeout(() => {
        setFeedback('');
        window.location.reload();
      }, 4000);

    } catch (err: any) {
      console.error('Deposit failed:', err);
      setFeedback(err.message || 'Deposit failed. Please check connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      
      {/* PORTAL HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-slate-950">Alumni Member Portal</h1>
          <p className="text-sm text-gray-500 mt-1">
            Access your personalized cooperative equity, track pool shares, and manage savings.
          </p>
        </div>

        {/* PROFILE STATUS DISPLAY */}
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center text-sm">
            🦅
          </div>
          <div className="text-left pr-2">
            <span className="block text-xs font-bold text-slate-900 leading-none">
              {profile?.full_name || 'Alumnus Account'}
            </span>
            {/* FIXED: Removed manual set-state trigger; now cleanly displays live database profile roles */}
            <span className="text-[10px] text-emerald-600 font-semibold block mt-1">
              Status: {isMember ? 'Active Member' : 'Guest Account'} ({profile?.role || 'Guest'})
            </span>
          </div>
        </div>
      </div>

      {/* BALANCES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* CARD 1: PORTAL WALLET */}
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Cooperative Savings Balance</span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-2">
            ₦{memberBalance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-gray-400 mt-3">Available for instant use inside the Cooperative Marketplace.</p>
        </div>

        {/* CARD 2: COOP EQUITY SHARES */}
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Your Equity Pool Ownership</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">1,250 <span className="text-xs font-medium text-gray-400">Shares</span></div>
          <p className="text-xs text-gray-400 mt-3">Representing an active 0.12% stake in community physical assets.</p>
        </div>

        {/* CARD 3: DIVIDENDS ACCRUED */}
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Total Dividends Received</span>
          <div className="text-2xl font-extrabold text-amber-500 mt-2">₦75,400.00</div>
          <p className="text-xs text-gray-400 mt-3">Calculated quarterly based on total marketplace external trade yields.</p>
        </div>

      </div>

      {/* PORTAL ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: REAL DEPOSIT TO SUPABASE */}
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
          <h3 className="font-serif text-base text-slate-950 font-bold mb-1">Inbound Capital Allocation</h3>
          <p className="text-xs text-gray-400 mb-4">Deposit capital into your secure cooperative wallet.</p>

          <form onSubmit={handleDeposit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Deposit Amount (₦)</label>
              <input
                type="number"
                placeholder="25000"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 bg-white text-sm transition text-slate-900"
                disabled={isSubmitting}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white text-xs font-bold py-2.5 rounded-xl hover:bg-emerald-700 transition"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Syncing with Ledger...' : 'Deposit Funds'}
            </button>
          </form>

          {feedback && (
            <div className={`mt-3 p-2.5 border text-xs rounded-xl ${
              feedback.includes('successfully')
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              {feedback}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: RECENT LEDGER TRANSACTIONS */}
        <div className="md:col-span-2 bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
          <h3 className="font-serif text-base text-slate-950 font-bold mb-1">Personal Ledger</h3>
          <p className="text-xs text-gray-400 mb-4">Real-time status tracking of all wallet activity.</p>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 border border-gray-150 rounded-xl text-xs">
              <div>
                <span className="font-bold text-slate-900 block">Co-Op Dividend Distribution</span>
                <span className="text-[10px] text-gray-400">Quarterly Yield payout • Authorized by Admin</span>
              </div>
              <span className="font-bold text-green-600">+₦10,500.00</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 border border-gray-150 rounded-xl text-xs">
              <div>
                <span className="font-bold text-slate-900 block">Initial Share Capital Transfer</span>
                <span className="text-[10px] text-gray-400">Verification complete • System Ledger</span>
              </div>
              <span className="font-bold text-slate-500">Completed</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default dynamic(() => Promise.resolve(DashboardPage), { ssr: false });
