'use client';

import { useState } from 'react';

export default function DashboardPage() {
  // Isolated state representing a logged-in alumni member
  const [member, setMember] = useState({
    name: 'Chief Dr. Benson Cole',
    id: 'MS-2026-8941',
    tier: 'Platinum Elite',
    shares: 4500,
    dividendsPaid: 1420.50,
    savingsBalance: 12500.00,
    recentTransactions: [
      { id: 1, type: 'Savings Deposit', date: '2026-07-10', amount: 500.00, status: 'Completed' },
      { id: 2, type: 'Dividend Payout', date: '2026-06-30', amount: 320.50, status: 'Paid' },
      { id: 3, type: 'Share Acquisition', date: '2026-05-15', amount: 1500.00, status: 'Completed' }
    ]
  });

  const [depositAmount, setDepositAmount] = useState('');

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) return;

    // Safely update isolated local state
    setMember(prev => ({
      ...prev,
      savingsBalance: prev.savingsBalance + amount,
      recentTransactions: [
        {
          id: Date.now(),
          type: 'Savings Deposit',
          date: new Date().toISOString().split('T')[0],
          amount: amount,
          status: 'Completed'
        },
        ...prev.recentTransactions
      ]
    }));
    setDepositAmount('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      
      {/* PORTAL HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-serif text-slate-950">Member Portal</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your shares, track cooperative dividends, and deposit savings.</p>
      </div>

      {/* GRID LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* COLUMN 1: ACCOUNT SUMMARY PROFILE */}
        <div className="md:col-span-2 space-y-6">
          
          {/* PROFILE CARD */}
          <div className="bg-coopGreen text-white rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-serif mb-1">{member.name}</h2>
                <p className="text-xs text-white/60">ID: {member.id}</p>
              </div>
              <span className="bg-coopGold text-slate-950 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full">
                {member.tier}
              </span>
            </div>

            {/* LEDGER METRICS */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
              <div>
                <div className="text-[10px] text-white/50 uppercase tracking-wider">Total Shares</div>
                <div className="text-lg font-bold mt-1">{member.shares.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[10px] text-white/50 uppercase tracking-wider">Dividends Earned</div>
                <div className="text-lg font-bold mt-1 text-coopGold">${member.dividendsPaid.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-[10px] text-white/50 uppercase tracking-wider">Savings Balance</div>
                <div className="text-lg font-bold mt-1">${member.savingsBalance.toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* RECENT LEDGER TRANSACTIONS */}
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm">
            <h3 className="font-serif text-lg text-slate-950 mb-4">Ledger Statement</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase font-semibold">
                    <th className="pb-3">Transaction</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3 text-right">Amount</th>
                    <th className="pb-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {member.recentTransactions.map((tx) => (
                    <tr key={tx.id} className="text-slate-700">
                      <td className="py-3 font-medium text-slate-900">{tx.type}</td>
                      <td className="py-3 text-gray-500">{tx.date}</td>
                      <td className={`py-3 text-right font-semibold ${tx.type.includes('Payout') ? 'text-coopGold' : 'text-coopGreen'}`}>
                        {tx.type.includes('Payout') ? '+' : ''}${tx.amount.toFixed(2)}
                      </td>
                      <td className="py-3 text-right">
                        <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* COLUMN 2: QUICK ACTIONS SIDE PANEL */}
        <div className="space-y-6">
          
          {/* DEPOSIT ACTION CARD */}
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm">
            <h3 className="font-serif text-lg text-slate-950 mb-1">Savings Contribution</h3>
            <p className="text-xs text-gray-400 mb-4">Add funds directly to your high-yield cooperative savings wallet.</p>
            
            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Amount (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full pl-7 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-coopGreen focus:ring-2 focus:ring-coopGreen/10 bg-white text-sm transition"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-coopGreen text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-coopGreen-dark active:scale-95 transition shadow-sm"
              >
                Submit Contribution
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
