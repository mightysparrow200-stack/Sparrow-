'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// Mock Payout History (can be linked to your payouts table in Supabase)
const INITIAL_PAYOUTS = [
  { id: 'P-104', amount: 85000, date: 'July 10, 2026', status: 'Completed', bank: 'UBA' },
  { id: 'P-103', amount: 120000, date: 'June 28, 2026', status: 'Completed', bank: 'UBA' },
  { id: 'P-102', amount: 45000, date: 'June 15, 2026', status: 'Completed', bank: 'Wema Bank' },
];

export default function VendorProfilePage() {
  // Vendor Profile State
  const [vendorId, setVendorId] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState('Youfeat Nigeria Limited');
  const [vendorName, setVendorName] = useState('Joseph Peter Amed');
  const [email, setEmail] = useState('joseph.amed@youfeat.co');
  const [phone, setPhone] = useState('+234 803 123 4567');
  const [category, setCategory] = useState('General');
  const [bio, setBio] = useState('');
  const [address, setAddress] = useState('');
  const [website, setWebsite] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');

  // Bank Details
  const [bankName, setBankName] = useState('United Bank for Africa (UBA)');
  const [accountNumber, setAccountNumber] = useState('1023456789');
  const [accountName, setAccountName] = useState('Youfeat Nigeria Limited');

  // Financial States
  const [lifetimeEarnings, setLifetimeEarnings] = useState(435000);
  const [availablePayout, setAvailablePayout] = useState(185000);
  const [payouts, setPayouts] = useState(INITIAL_PAYOUTS);

  // UI States
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutError, setPayoutError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch logged-in user and vendor profile from Supabase
  useEffect(() => {
    async function loadVendorProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setVendorId(user.id);

      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data && !error) {
        setBusinessName(data.business_name || '');
        setCategory(data.category || 'General');
        setBio(data.bio || '');
        setAddress(data.address || '');
        setWebsite(data.website || '');
        setEmail(data.contact_email || user.email || '');
        setPhone(data.contact_phone || '');
        setLogoUrl(data.logo_url || '');
        setBannerUrl(data.banner_url || '');
      }
    }

    loadVendorProfile();
  }, []);

  // Image Upload Handler (Supabase Storage)
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'logo' | 'banner'
  ) => {
    try {
      setUploading(true);
      setMsg(null);
      const file = e.target.files?.[0];
      if (!file || !vendorId) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `${vendorId}/${type}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('vendor-assets')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('vendor-assets')
        .getPublicUrl(filePath);

      if (type === 'logo') {
        setLogoUrl(urlData.publicUrl);
      } else {
        setBannerUrl(urlData.publicUrl);
      }

      setMsg({ type: 'success', text: `${type === 'logo' ? 'Logo' : 'Banner'} uploaded successfully!` });
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || 'Image upload failed.' });
    } finally {
      setUploading(false);
    }
  };

  // Save Store Details
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorId) return;
    setIsSaving(true);
    setMsg(null);

    const { error } = await supabase.from('vendors').upsert({
      id: vendorId,
      business_name: businessName,
      category,
      bio,
      address,
      website,
      contact_email: email,
      contact_phone: phone,
      logo_url: logoUrl,
      banner_url: bannerUrl,
      updated_at: new Date().toISOString(),
    });

    setIsSaving(false);
    if (error) {
      setMsg({ type: 'error', text: error.message });
    } else {
      setMsg({ type: 'success', text: 'Vendor profile and store details updated!' });
    }
  };

  // Payout Handler
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

    setAvailablePayout((prev) => prev - amount);
    const newPayout = {
      id: `P-${100 + payouts.length + 5}`,
      amount: amount,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      status: 'Pending',
      bank: bankName.split(' ')[0]
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
              <span>Vendor Portal</span>
              <span>/</span>
              <span>Profile & Payouts</span>
            </div>
            <h1 className="text-2xl font-serif font-bold mt-1">{businessName || 'Vendor Profile'}</h1>
            <p className="text-slate-400 text-xs mt-1">
              Manage store branding, company details, payout bank settings, and settlements.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-6 space-y-6">
        
        {/* Navigation Bar */}
        <div className="flex flex-wrap gap-2 bg-white border border-slate-100 p-2 rounded-2xl shadow-sm">
          <Link 
            href="/vendor/products" 
            className="flex-1 text-center py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition"
          >
            📦 My Products
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

        {msg && (
          <div
            className={`p-3.5 rounded-xl text-xs font-semibold ${
              msg.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {msg.text}
          </div>
        )}

        {/* Main Form & Settlement Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN: Store Branding & Information Editor */}
          <form onSubmit={handleSaveProfile} className="space-y-6 md:col-span-2">
            
            {/* Store Images Card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Store Images & Branding</h2>
              
              {/* Banner Upload */}
              <div className="relative h-32 w-full bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center">
                {bannerUrl ? (
                  <img src={bannerUrl} alt="Store Banner" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-slate-400 font-medium">No Store Banner Uploaded</span>
                )}
                <label className="absolute bottom-3 right-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 shadow-sm cursor-pointer hover:bg-white transition">
                  {uploading ? 'Uploading...' : 'Change Banner'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'banner')}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>

              {/* Logo Upload */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-100 border border-slate-200 rounded-xl overflow-hidden flex items-center justify-center shrink-0">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px] text-slate-400 font-medium text-center">No Logo</span>
                  )}
                </div>
                <div>
                  <label className="inline-block px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer hover:bg-slate-200 transition">
                    {uploading ? 'Uploading...' : 'Upload Brand Logo'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'logo')}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                  <p className="text-[10px] text-slate-400 mt-1">Recommended: 400x400px PNG or JPG</p>
                </div>
              </div>
            </div>

            {/* Business Contact & Bio Card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Company Profile Details</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1 uppercase">Business Name</label>
                  <input 
                    type="text" 
                    required
                    value={businessName} 
                    onChange={(e) => setBusinessName(e.target.value)} 
                    className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-emerald-500 text-slate-900 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1 uppercase">Store Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-emerald-500 text-slate-900 font-semibold bg-white"
                  >
                    <option value="General">General Marketplace</option>
                    <option value="Agriculture">Agriculture & Food</option>
                    <option value="Electronics">Electronics & Gadgets</option>
                    <option value="Apparel">Apparel & Fashion</option>
                    <option value="Services">Services & Logistics</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1 uppercase">Company Profile / Description</label>
                <textarea 
                  rows={3}
                  placeholder="Tell buyers about your business history, offerings, and value proposition..."
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)} 
                  className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-emerald-500 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1 uppercase">Contact Email</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-emerald-500 text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1 uppercase">Phone Number</label>
                  <input 
                    type="tel" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-emerald-500 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1 uppercase">Physical Address</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Lagos, Nigeria"
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-emerald-500 text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1 uppercase">Website URL</label>
                  <input 
                    type="url" 
                    placeholder="https://example.com"
                    value={website} 
                    onChange={(e) => setWebsite(e.target.value)} 
                    className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-emerald-500 text-slate-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSaving || uploading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition disabled:opacity-50"
              >
                {isSaving ? 'Saving Profile Details...' : 'Save Profile & Store Changes'}
              </button>
            </div>

          </form>

          {/* RIGHT COLUMN: Ledger Balances, Bank Settings & Payouts */}
          <div className="space-y-6 md:col-span-1">
            
            {/* Earnings Cards */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Lifetime Sales
                </span>
                <div className="text-xl font-bold text-slate-900 mt-1">
                  ₦{lifetimeEarnings.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                  Available for Payout
                </span>
                <div className="text-xl font-bold text-slate-900 mt-1">
                  ₦{availablePayout.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                </div>

                <button 
                  onClick={() => setIsPayoutModalOpen(true)}
                  disabled={availablePayout <= 0}
                  className={`w-full mt-3 py-2.5 rounded-xl text-xs font-bold transition ${
                    availablePayout > 0 
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm' 
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Request Bank Settlement
                </button>
              </div>
            </div>

            {/* Payout Destination Account */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payout Destination Bank</h2>
              
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
            </div>

            {/* Historical Payout Log */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Payout Logs
                </h3>
              </div>

              <div className="divide-y divide-slate-50">
                {payouts.map((po) => (
                  <div key={po.id} className="p-3.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800">To {po.bank}</p>
                      <p className="text-[10px] text-slate-400">{po.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">₦{po.amount.toLocaleString()}</p>
                      <span className={`inline-block text-[8px] font-semibold px-1.5 py-0.5 rounded ${
                        po.status === 'Pending' ? 'text-amber-600 bg-amber-50' : 'text-slate-400 bg-slate-50'
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

      {/* BANK PAYOUT MODAL */}
      {isPayoutModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-100 shadow-2xl p-6 relative">
            <h2 className="text-base font-bold text-slate-900">Request Bank Settlement</h2>
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
                  className="w-full text-sm font-semibold text-slate-900 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                {payoutError && <p className="text-[11px] text-rose-500 font-semibold mt-1">{payoutError}</p>}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPayoutModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm"
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
