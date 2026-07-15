'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VendorOnboarding() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    businessName: '',
    cacNumber: '', // Corporate Affairs Commission certification check
    primaryCategory: 'productivity',
    contactPerson: '',
    email: '',
    nairaPayoutBank: '',
    nairaAccountNumber: '',
    minCoopDiscount: '15',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate Vendor Registry onboarding pipeline
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1800);
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto my-16 bg-white border border-gray-100 rounded-3xl p-8 text-center space-y-6 shadow-xl animate-fade-in">
        <div className="w-16 h-16 bg-coopGold/10 text-coopGold rounded-full flex items-center justify-center text-3xl mx-auto">
          🤝
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-serif text-slate-950">Application Received</h1>
          <p className="text-xs text-gray-500 leading-relaxed">
            Your application to sell on the Mighty Sparrow cooperative marketplace is under review. Our vendor auditing team will contact you shortly.
          </p>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl text-left border border-gray-100 space-y-2 text-[11px] text-slate-700">
          <span className="block text-[10px] text-gray-400 font-bold uppercase">Vendor Integrity Policy</span>
          <p>• Your listed CAC certificate will be verified with the Corporate Affairs Commission registry.</p>
          <p>• Cooperative agreements require vendors to offer <strong>at least 15% discount</strong> below open market price lists.</p>
        </div>
        <button
          onClick={() => router.push('/')}
          className="w-full bg-slate-900 text-white text-xs font-bold py-3.5 rounded-xl hover:bg-slate-800 transition"
        >
          Return to Home Page
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto my-12 px-4 animate-fade-in">
      <div className="mb-8 space-y-2 text-center">
        <span className="text-[10px] uppercase font-bold tracking-wider text-coopGreen">Vendor Network Partnerships</span>
        <h1 className="text-3xl font-serif text-slate-950">Supplier Onboarding Portal</h1>
        <p className="text-xs text-gray-400">Apply to distribute general goods, gadgets, and lifestyle gear directly to active alumni members.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        
        {/* Section 1: Business Details */}
        <div className="space-y-4">
          <h2 className="text-sm font-serif font-semibold text-slate-950 border-b pb-2">1. Registered Business Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Registered Business Name (CAC)</label>
              <input
                type="text"
                required
                placeholder="e.g. Apex Tech Ltd"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-coopGreen focus:border-coopGreen outline-none"
                value={formData.businessName}
                onChange={(e) => setFormData({...formData, businessName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">CAC Registration Number (RC/BN)</label>
              <input
                type="text"
                required
                placeholder="e.g. RC 1845920"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-coopGreen focus:border-coopGreen outline-none"
                value={formData.cacNumber}
                onChange={(e) => setFormData({...formData, cacNumber: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Product Category</label>
              <select
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-coopGreen focus:border-coopGreen outline-none bg-white"
                value={formData.primaryCategory}
                onChange={(e) => setFormData({...formData, primaryCategory: e.target.value})}
              >
                <option value="productivity">Productivity & Office Gadgets</option>
                <option value="electronics">Consumer Electronics</option>
                <option value="lifestyle">Lifestyle & Home Goods</option>
                <option value="apparel">Apparel & Merchandising</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Proposed Co-Op Member Discount (%)</label>
              <input
                type="number"
                min="15"
                max="80"
                required
                placeholder="Minimum 15%"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-coopGreen focus:border-coopGreen outline-none"
                value={formData.minCoopDiscount}
                onChange={(e) => setFormData({...formData, minCoopDiscount: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact & Bank Info */}
        <div className="space-y-4 pt-2">
          <h2 className="text-sm font-serif font-semibold text-slate-950 border-b pb-2">2. Communications & Settlement</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Person Name</label>
              <input
                type="text"
                required
                placeholder="Contact representative"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-coopGreen focus:border-coopGreen outline-none"
                value={formData.contactPerson}
                onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Business Email Address</label>
              <input
                type="email"
                required
                placeholder="partnerships@company.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-coopGreen focus:border-coopGreen outline-none"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Naira Payout Bank</label>
              <input
                type="text"
                required
                placeholder="e.g. Zenith Bank, GTBank"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-coopGreen focus:border-coopGreen outline-none"
                value={formData.nairaPayoutBank}
                onChange={(e) => setFormData({...formData, nairaPayoutBank: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Payout Account Number (NUBAN)</label>
              <input
                type="text"
                required
                maxLength={10}
                placeholder="10-digit account number"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-coopGreen focus:border-coopGreen outline-none"
                value={formData.nairaAccountNumber}
                onChange={(e) => setFormData({...formData, nairaAccountNumber: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Additional distribution notes or portfolio info</label>
          <textarea
            rows={3}
            placeholder="Introduce your brand or supply line briefly..."
            className="w-full border border-gray-200 rounded-xl p-4 text-xs focus:ring-1 focus:ring-coopGreen focus:border-coopGreen outline-none"
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-950 text-white text-xs font-bold py-4 rounded-xl hover:bg-slate-800 transition flex items-center justify-center gap-2"
        >
          {loading ? 'Verifying Corporate Credentials...' : 'Submit Partnership Application'}
        </button>
      </form>
    </div>
  );
}
