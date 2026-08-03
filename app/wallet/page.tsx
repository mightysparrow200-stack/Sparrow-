'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'credit' | 'debit';
  status: string;
  created_at: string;
}

export default function WalletPage() {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [fundingAmount, setFundingAmount] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchWalletDetails();
  }, []);

  async function fetchWalletDetails() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = '/login';
        return;
      }

      // 1. Fetch balance
      const { data: walletData } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', user.id)
        .single();

      if (walletData) setBalance(walletData.balance);

      // 2. Fetch transactions
      const { data: txData } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (txData) setTransactions(txData);
    } catch (err) {
      console.error('Error fetching wallet:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleFundWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(fundingAmount);
    if (isNaN(amountNum) || amountNum <= 0) return alert('Enter a valid amount');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newBalance = balance + amountNum;

      // Update balance
      await supabase
        .from('wallets')
        .upsert({ user_id: user.id, balance: newBalance }, { onConflict: 'user_id' });

      // Record transaction
      await supabase.from('wallet_transactions').insert({
        user_id: user.id,
        title: 'Wallet Funding via Bank',
        amount: amountNum,
        type: 'credit',
        status: 'Completed',
      });

      setBalance(newBalance);
      setFundingAmount('');
      setIsModalOpen(false);
      fetchWalletDetails();
    } catch (err: any) {
      alert(`Funding failed: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-500">Loading Co-Op Wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 font-sans">
      {/* HEADER */}
      <div className="mb-6">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2 font-medium">
          <Link href="/" className="hover:text-emerald-600 transition">Home</Link>
          <span>/</span>
          <span className="text-slate-800 font-bold">Wallet</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900">Co-Op Wallet</h1>
        <p className="text-xs text-slate-500 mt-1">Manage your funds, contributions, and store credits.</p>
      </div>

      {/* CARD */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 rounded-3xl p-6 text-white shadow-xl mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-100 block opacity-80">
          Available Balance
        </span>
        <div className="text-3xl font-black mt-1 mb-6">
          ₦{balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 bg-white text-emerald-800 font-bold text-xs rounded-xl shadow hover:bg-emerald-50 transition"
          >
            + Add Funds
          </button>
          <Link
            href="/shop"
            className="px-5 py-2.5 bg-emerald-700/60 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl backdrop-blur transition"
          >
            Use in Shop
          </Link>
        </div>
      </div>

      {/* RECENT TRANSACTIONS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Recent Transactions</h2>
        </div>

        {transactions.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">No transaction history found.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {transactions.map((tx) => (
              <div key={tx.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${
                    tx.type === 'credit' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {tx.type === 'credit' ? '↓' : '↑'}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{tx.title}</h3>
                    <p className="text-[10px] text-slate-400">
                      {new Date(tx.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-black block ${tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {tx.type === 'credit' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">{tx.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FUNDING MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-1">Fund Co-Op Wallet</h3>
            <p className="text-xs text-slate-500 mb-4">Enter the amount you wish to add to your wallet balance.</p>

            <form onSubmit={handleFundWallet}>
              <div className="mb-4">
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Amount (₦)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 10000"
                  value={fundingAmount}
                  onChange={(e) => setFundingAmount(e.target.value)}
                  className="w-full text-sm font-bold border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow hover:bg-emerald-700"
                >
                  Confirm Funding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
