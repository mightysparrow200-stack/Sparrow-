'use client';

import { useState } from 'react';

export default function AdminPage() {
  // Simulated admin treasury state
  const [treasury, setTreasury] = useState({
    totalPoolAssets: 450000.00,
    availableLiquidity: 185200.00,
    totalMembers: 1240,
    pendingApprovals: [
      { id: 101, member: 'Sarah Jenkins', type: 'Savings Deposit', amount: 1200.00, date: 'Today' },
      { id: 102, member: 'Marcus Vance', type: 'Share Purchase', amount: 3500.00, date: 'Today' },
    ]
  });

  const [dividendRate, setDividendRate] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle approving a pending deposit/purchase
  const handleApprove = (id: number, amount: number) => {
    setTreasury(prev => ({
      ...prev,
      totalPoolAssets: prev.totalPoolAssets + amount,
      availableLiquidity: prev.availableLiquidity + amount,
      pendingApprovals: prev.pendingApprovals.filter(item => item.id !== id)
    }));
  };

  // Handle distributing simulated dividends
  const handleDistributeDividends = (e: React.FormEvent) => {
    e.preventDefault();
    const rate = parseFloat(dividendRate);
    if (isNaN(rate) || rate <= 0) return;

    setSuccessMessage(`Successfully calculated and distributed ${rate}% dividends to all ${treasury.totalMembers} active members!`);
    setDividendRate('');
    
    // Clear message after 4 seconds
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      
      {/* PAGE HEADER */}
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔑</span>
          <h1 className="text-2xl md:text-3xl font-serif text-slate-950">Administrative Ledger</h1>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Cooperative management interface. Authorize pool allocations, audit treasury reserves, and trigger dividends.
        </p>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Total Asset Pool</span>
          <div className="text-xl font-extrabold text-slate-900 mt-1">${treasury.totalPoolAssets.toLocaleString()}</div>
        </div>
        <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Cash Reserves</span>
          <div className="text-xl font-extrabold text-coopGreen mt-1">${treasury.availableLiquidity.toLocaleString()}</div>
        </div>
        <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Registered Members</span>
          <div className="text-xl font-extrabold text-slate-900 mt-1">{treasury.totalMembers}</div>
        </div>
        <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Pending Tasks</span>
          <div className="text-xl font-extrabold text-coopGold mt-1">{treasury.pendingApprovals.length}</div>
        </div>
      </div>

      {/* INTERACTIVE CONTROLS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* TASK 1: PENDING LEDGER APPROVALS */}
        <div className="md:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-serif text-lg text-slate-950 mb-1">Queue & Authorizations</h3>
          <p className="text-xs text-gray-400 mb-4">Validate inbound capital allocations from the alumni portal.</p>
          
          {treasury.pendingApprovals.length > 0 ? (
            <div className="space-y-3">
              {treasury.pendingApprovals.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3.5 bg-gray-50 border border-gray-150 rounded-xl">
                  <div>
                    <div className="text-sm font-bold text-slate-950">{task.member}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{task.type} • {task.date}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-900">${task.amount.toFixed(2)}</span>
                    <button
                      onClick={() => handleApprove(task.id, task.amount)}
                      className="bg-coopGreen text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-coopGreen-dark transition"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50/50 border border-dashed border-gray-200 rounded-xl">
              <span className="text-2xl block mb-1">✅</span>
              <p className="text-xs text-gray-500 font-medium">All member transactions have been processed.</p>
            </div>
          )}
        </div>

        {/* TASK 2: REVENUE DISTRIBUTION */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm h-fit">
          <h3 className="font-serif text-lg text-slate-950 mb-1">Broadcast Dividends</h3>
          <p className="text-xs text-gray-400 mb-4">Deregulate system reserves to initiate payout transfers across the registry.</p>

          <form onSubmit={handleDistributeDividends} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Yield Rate (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  placeholder="3.5"
                  value={dividendRate}
                  onChange={(e) => setDividendRate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-coopGreen focus:ring-2 focus:ring-coopGreen/10 bg-white text-sm transition"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">%</span>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-coopGold text-slate-950 text-sm font-bold py-2.5 rounded-xl hover:bg-yellow-500 active:scale-95 transition shadow-sm"
            >
              Distribute Yield
            </button>
          </form>

          {successMessage && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded-xl leading-relaxed">
              {successMessage}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
