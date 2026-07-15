'use client';

import { useState } from 'react';

// Mock Transaction Data
const INITIAL_TRANSACTIONS = [
  { id: '1', type: 'credit', desc: 'Wallet Funding via UBA', amount: 25000, date: 'July 15, 2026', status: 'Completed' },
  { id: '2', type: 'debit', desc: 'Co-op Tech Smart Backpack Purchase', amount: 35000, date: 'July 14, 2026', status: 'Completed' },
  { id: '3', type: 'credit', desc: 'Monthly Savings Contribution', amount: 10000, date: 'July 01, 2026', status: 'Completed' },
];

export default function WalletPage() {
  const [balance, setBalance] = useState(45500); // ₦45,500.00
  const [savingsBalance, setSavingsBalance] = useState(120000); // ₦120,000.00
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12 font-sans">
      {/* Top Banner / Header */}
      <div className="bg-slate-900 text-white py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
            Sparrow Cooperative Wallet
          </span>
          <h1 className="text-2xl font-serif font-bold mt-1">My Financial Hub</h1>
          <p className="text-slate-400 text-xs mt-1">Manage your savings, fund security accounts, and view transaction history.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-6 space-y-6">
        
        {/* Balance Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Main Wallet Balance */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Available Wallet Balance
              </span>
              <div className="text-3xl font-bold text-slate-900 mt-1">
                ₦{balance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-2 mt-6">
              <button className="flex flex-col items-center justify-center p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100/70 text-emerald-700 transition gap-1">
                <span className="text-lg">📥</span>
                <span className="text-[10px] font-bold">Fund Wallet</span>
              </button>
              <button className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition gap-1">
                <span className="text-lg">📤</span>
                <span className="text-[10px] font-bold">Transfer</span>
              </button>
              <button className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition gap-1">
                <span className="text-lg">💸</span>
                <span className="text-[10px] font-bold">Withdraw</span>
              </button>
            </div>
          </div>

          {/* Locked Co-op Savings Account */}
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-6 shadow-sm text-white flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider">
                  Cooperative Savings
                </span>
                <span className="bg-emerald-500/30 text-emerald-200 text-[9px] font-bold px-2 py-0.5 rounded-full">
                  Locked Target
                </span>
              </div>
              <div className="text-3xl font-bold mt-1">
                ₦{savingsBalance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-[10px] text-emerald-100 mt-1">
                Earn 12% annual dividend dividends on your co-op savings stake.
              </p>
            </div>

            <button className="w-full mt-6 py-2.5 bg-white text-emerald-800 text-xs font-bold rounded-xl hover:bg-emerald-50 transition">
              View Savings Planner
            </button>
          </div>

        </div>

        {/* Transaction History Container */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Recent Transactions
            </h3>
            <button className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 transition">
              View All
            </button>
          </div>

          <div className="divide-y divide-slate-50">
            {transactions.map((tx) => (
              <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                    tx.type === 'credit' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {tx.type === 'credit' ? '↓' : '↑'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-850">{tx.desc}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{tx.date}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`text-xs font-bold ${
                    tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-800'
                  }`}>
                    {tx.type === 'credit' ? '+' : '-'} ₦{tx.amount.toLocaleString()}
                  </p>
                  <span className="inline-block text-[8px] font-semibold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 mt-0.5">
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
                  }
