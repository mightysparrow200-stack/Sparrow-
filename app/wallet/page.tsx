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
  
  // Modal States
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isFundModalOpen, setIsFundModalOpen] = useState(false);
  
  // Form States
  const [transferAmount, setTransferAmount] = useState('');
  const [fundAmount, setFundAmount] = useState('50000'); // Default mock funding amount
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Handle Mock Copy Button
  const handleCopy = () => {
    navigator.clipboard.writeText('1023456789');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle saving cash (Wallet -> Locked Savings)
  const handleTransferToSavings = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const amount = parseFloat(transferAmount);

    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid transfer amount.');
      return;
    }

    if (amount > balance) {
      setError('Insufficient available wallet balance.');
      return;
    }

    setBalance((prev) => prev - amount);
    setSavingsBalance((prev) => prev + amount);
    
    const newTx = {
      id: (transactions.length + 1).toString(),
      type: 'debit',
      desc: 'Transferred to Locked Savings',
      amount: amount,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      status: 'Completed'
    };

    setTransactions([newTx, ...transactions]);
    setTransferAmount('');
    setIsSaveModalOpen(false);
  };

  // Mock Funding the wallet (Simulating receiving bank notification)
  const handleMockFunding = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(fundAmount);

    if (isNaN(amount) || amount <= 0) return;

    setBalance((prev) => prev + amount);

    const newTx = {
      id: (transactions.length + 1).toString(),
      type: 'credit',
      desc: 'Wallet Funding via UBA Transfer',
      amount: amount,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      status: 'Completed'
    };

    setTransactions([newTx, ...transactions]);
    setIsFundModalOpen(false);
  };

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
              {/* Trigger Fund Wallet Modal */}
              <button 
                onClick={() => setIsFundModalOpen(true)}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition gap-1"
              >
                <span className="text-lg">📥</span>
                <span className="text-[10px] font-bold">Fund Wallet</span>
              </button>
              
              {/* Trigger Save Cash Modal */}
              <button 
                onClick={() => setIsSaveModalOpen(true)}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100/70 text-emerald-700 transition gap-1"
              >
                <span className="text-lg">🔒</span>
                <span className="text-[10px] font-bold">Save Cash</span>
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

            <button 
              onClick={() => setIsSaveModalOpen(true)}
              className="w-full mt-6 py-2.5 bg-white text-emerald-800 text-xs font-bold rounded-xl hover:bg-emerald-50 transition"
            >
              + Add to Savings
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

      {/* --- SAVE CASH MODAL --- */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-100 shadow-2xl p-6 relative">
            
            <h2 className="text-base font-bold text-slate-900 font-serif">Deposit into Locked Savings</h2>
            <p className="text-[11px] text-slate-500 mt-1">
              Transfer funds from your liquid wallet to earn 12% dividends on your permanent co-op stake.
            </p>

            <form onSubmit={handleTransferToSavings} className="mt-4 space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Available Balance:</span>
                <span className="font-bold text-slate-900">₦{balance.toLocaleString()}</span>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Amount to Lock (₦)
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 10000"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full text-sm font-semibold text-slate-900 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                />
                {error && <p className="text-[11px] text-rose-500 font-semibold mt-1">{error}</p>}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSaveModalOpen(false);
                    setError('');
                    setTransferAmount('');
                  }}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
                >
                  Confirm Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- FUND WALLET MODAL --- */}
      {isFundModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-100 shadow-2xl p-6 relative">
            
            <h2 className="text-base font-bold text-slate-900 font-serif">Fund Your Co-op Wallet</h2>
            <p className="text-[11px] text-slate-500 mt-1">
              Transfer funds to your unique virtual bank account below. The payment will clear instantly into your available balance.
            </p>

            <div className="mt-5 space-y-4">
              
              {/* Bank Details Card */}
              <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">Bank Name</span>
                  <span className="font-bold text-slate-800">United Bank for Africa (UBA)</span>
                </div>
                
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">Account Name</span>
                  <span className="font-bold text-slate-800">Sparrow Coop / Joseph Peter Amed</span>
                </div>

                <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-200/60">
                  <span className="text-slate-400 font-medium">Account Number</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-slate-900">1023456789</span>
                    <button 
                      onClick={handleCopy}
                      className="px-2.5 py-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100/70 transition"
                    >
                      {copied ? 'Copied! ✓' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Sandbox/Simulate Input for testing purposes */}
              <form onSubmit={handleMockFunding} className="p-3 bg-amber-50/40 rounded-xl border border-amber-100 space-y-2">
                <span className="block text-[9px] font-bold text-amber-700 uppercase tracking-widest">
                  Sandbox Simulation (Test Funding)
                </span>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={fundAmount}
                    onChange={(e) => setFundAmount(e.target.value)}
                    placeholder="Enter mock deposit amount"
                    className="flex-1 text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-800 focus:outline-none"
                  />
                  <button 
                    type="submit"
                    className="bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-slate-800 transition"
                  >
                    Simulate Transfer
                  </button>
                </div>
              </form>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsFundModalOpen(false)}
                className="w-full py-2.5 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition mt-2"
              >
                Close
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
        }
