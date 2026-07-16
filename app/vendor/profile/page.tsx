'use client';

import { useState } from 'react';
import Link from 'next/link';

// Mock Payout History
const INITIAL_PAYOUTS = [
  { id: 'P-104', amount: 85000, date: 'July 10, 2026', status: 'Completed', bank: 'UBA' },
  { id: 'P-103', amount: 120000, date: 'June 28, 2026', status: 'Completed', bank: 'UBA' },
  { id: 'P-102', amount: 45000, date: 'June 15, 2026', status: 'Completed', bank: 'Wema Bank' },
];

export default function VendorProfilePage() {
  // Vendor Business & Personal Details
  const [businessName, setBusinessName] = useState('Youfeat Nigeria Limited');
  const [vendorName, setVendorName] = useState('Joseph Peter Amed');
  const [email, setEmail] = useState('joseph.amed@youfeat.co');
  const [phone, setPhone] = useState('+234 803 123 4567');
  
  // Bank Details for receiving payouts
  const [bankName, setBankName] = useState('United Bank for Africa (UBA)');
  const [accountNumber, setAccountNumber] = useState('1023456789');
  const [accountName, setAccountName] = useState('Youfeat Nigeria Limited');

  // Financial States
  const [lifetimeEarnings, setLifetimeEarnings] = useState(435000); // ₦435,000.00
  const [availablePayout, setAvailablePayout] = useState(185000);   // ₦185,000.00
  const [payouts, setPayouts] = useState(INITIAL_PAYOUTS);

  // UI States
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [payoutError, setPayoutError] = useState('');

  // Handle Payout Request Action
  const handlePayoutRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setPayoutError('');

    const amount = parseFloat(payoutAmount);

    if (isNaN(amount) || amount <= 0) {
      setPayoutError('Please enter a valid payout amount.');
      return;
    }

    if (amount > availablePayout) {
      setPayoutError('Insufficient available funds for payout.');
      return;
    }

    // Deduct available payout balance
    setAvailablePayout((prev) => prev - amount);

    // Append to payouts list
    const newPayout = {
      id: `P-${100 + payouts.length + 5}`,
      amount: amount,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      status: 'Pending',
      bank: bankName.split(' ')[0] // Simple clean bank label
    };

    setPayouts([newPayout, ...payouts]);
    setPayoutAmount('');
    setIsPayoutModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12 font-sans">
      
      {/* Top Banner Context */}
      <div className="bg-slate-900 text-white py-10 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-1">
              <span className="text-slate-400">Vendor Portal</span>
              <span>/</span>
              <span className="text-slate-400">Profile & Payouts</span>
            </div>
            <h1 className="text-2xl font-serif font-bold mt-1">{businessName}</h1>
            <p className="text-slate-400 text-xs mt-1">Manage payout bank settings, business information, and track merchant settlements.</p>
          </div>
          
          <button 
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="text-xs font-bold px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl transition"
          >
            {isEditingProfile ? 'Close Editor' : 'Edit Profile'}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-6 space-y-6">
        
        {/* --- DIRECT PORTAL NAVIGATION LINKS --- */}
        <div className="flex flex-wrap gap-2 bg-white border border-slate-100 p-2 rounded-2xl shadow-sm">
          <Link 
            href="/vendor/inventory" 
            className="flex-1 text-center py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition"
          >
            📦 My Inventory
          </Link>
          
          <Link 
            href="/vendor/upload-product" 
            className="flex-1 text-center py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition"
          >
            ➕ Upload Product
          </Link>
          
          <button 
            disabled 
            className="flex-1 text-center py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-default"
          >
            👤 Profile & Payouts
          </button>
        </div>

        {/* Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN: Profile & Settlement Bank Info */}
          <div className="space-y-6 md:col-span-1">
            
            {/* Business Profile Details Card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Business Contact</h2>
              
              {isEditingProfile ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Business Name</label>
                    <input 
                      type="text" 
                      value={businessName} 
                      onChange={(e) => setBusinessName(e.target.value)} 
                      className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-emerald-500 text-slate-900 font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Rep. Name</label>
                    <input 
                      type="text" 
                      value={vendorName} 
                      onChange={(e) => setVendorName(e.target.value)} 
                      className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold">Primary Representative</p>
                    <p className="text-xs text-slate-800 font-semibold">{vendorName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold">Contact Email</p>
                    <p className="text-xs text-slate-800 font-medium">{email}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold">Phone Number</p>
                    <p className="text-xs text-slate-800 font-medium">{phone}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Settled Settlement Account */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payout Destination Bank</h2>
              
              <div className="space-y-2.5">
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                  <div>
                    <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-bold">Bank Name</span>
                    <span className="text-xs font-bold text-slate-800">{bankName}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-bold">Account Number</span>
                    <span className="text-xs font-mono font-bold text-slate-900">{accountNumber}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-bold">Account Name</span>
                    <span className="text-xs font-semibold text-slate-700">{accountName}</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 leading-normal">
                  Funds requested for payout are automatically processed and wired into this destination account.
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Ledger Balances & Payout History */}
          <div className="space-y-6 md:col-span-2">
            
            {/* Earnings Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Total Lifetime Merchant Sales */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Lifetime Marketplace Earnings
                </span>
                <div className="text-2xl font-bold text-slate-900 mt-1">
                  ₦{lifetimeEarnings.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Gross volume generated on Sparrow platform.</p>
              </div>

              {/* Available to Payout Card */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                    Available for Payout
                  </span>
                  <div className="text-2xl font-bold text-slate-900 mt-1">
                    ₦{availablePayout.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                
                <button 
                  onClick={() => setIsPayoutModalOpen(true)}
                  disabled={availablePayout <= 0}
                  className={`w-full mt-4 py-2 rounded-xl text-xs font-bold transition ${
                    availablePayout > 0 
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/10' 
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Request Bank Settlement
                </button>
              </div>

            </div>

            {/* Historical Payout Ledgers */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Payout & Settlement Logs
                </h3>
              </div>

              <div className="divide-y divide-slate-50">
                {payouts.map((po) => (
                  <div key={po.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-xs">
                        🏦
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-850">Payout to {po.bank}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{po.date} • ID: {po.id}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-900">
                        ₦{po.amount.toLocaleString()}
                      </p>
                      <span className={`inline-block text-[8px] font-semibold px-1.5 py-0.5 rounded border mt-0.5 ${
                        po.status === 'Pending' 
                          ? 'text-amber-600 bg-amber-50 border-amber-100' 
                          : 'text-slate-400 bg-slate-50 border-slate-100'
                      }`}>
                        {po.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* --- BANK PAYOUT REQUEST MODAL --- */}
      {isPayoutModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-100 shadow-2xl p-6 relative">
            
            <h2 className="text-base font-bold text-slate-900 font-serif">Request Bank Settlement</h2>
            <p className="text-[11px] text-slate-500 mt-1">
              Your requested payout will be processed automatically and sent straight to your configured settlement account.
            </p>

            <form onSubmit={handlePayoutRequest} className="mt-4 space-y-4">
              
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Available Payout:</span>
                <span className="font-bold text-slate-900">₦{availablePayout.toLocaleString()}</span>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Payout Amount (₦)
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 50000"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  className="w-full text-sm font-semibold text-slate-900 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                />
                {payoutError && <p className="text-[11px] text-rose-500 font-semibold mt-1">{payoutError}</p>}
              </div>

              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/40 space-y-1">
                <span className="block text-[8px] font-bold text-emerald-800 uppercase tracking-widest">
                  Active Settlement Target
                </span>
                <p className="text-xs font-bold text-emerald-900 font-mono">
                  {bankName} • {accountNumber}
                </p>
                <p className="text-[9px] text-emerald-700">{accountName}</p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsPayoutModalOpen(false);
                    setPayoutError('');
                    setPayoutAmount('');
                  }}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
                >
                  Request Payout
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
