'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function VendorProfileSettings({ vendorId }: { vendorId: string }) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('General');
  const [bio, setBio] = useState('');
  const [address, setAddress] = useState('');
  const [website, setWebsite] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');

  useEffect(() => {
    async function loadVendorData() {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('id', vendorId)
        .single();

      if (data && !error) {
        setBusinessName(data.business_name || '');
        setCategory(data.category || 'General');
        setBio(data.bio || '');
        setAddress(data.address || '');
        setWebsite(data.website || '');
        setContactEmail(data.contact_email || '');
        setContactPhone(data.contact_phone || '');
        setLogoUrl(data.logo_url || '');
        setBannerUrl(data.banner_url || '');
      }
    }

    if (vendorId) loadVendorData();
  }, [vendorId]);

  // Image Upload Helper
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'logo' | 'banner'
  ) => {
    try {
      setUploading(true);
      setMsg(null);
      const file = e.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `${vendorId}/${type}-${Date.now()}.${fileExt}`;

      // Upload file to Supabase Storage 'vendor-assets' bucket
      const { error: uploadError } = await supabase.storage
        .from('vendor-assets')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get Public URL
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

  // Save Profile Info
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const { error } = await supabase.from('vendors').upsert({
      id: vendorId,
      business_name: businessName,
      category,
      bio,
      address,
      website,
      contact_email: contactEmail,
      contact_phone: contactPhone,
      logo_url: logoUrl,
      banner_url: bannerUrl,
      updated_at: new Date().toISOString(),
    });

    setLoading(false);
    if (error) {
      setMsg({ type: 'error', text: error.message });
    } else {
      setMsg({ type: 'success', text: 'Store profile updated successfully!' });
    }
  };

  return (
    <div className="max-w-3xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 font-sans shadow-sm">
      <h2 className="text-xl font-black text-slate-900 mb-1">Store Profile & Branding</h2>
      <p className="text-xs text-slate-500 mb-6">
        Manage how your business appears to shoppers in the marketplace.
      </p>

      {msg && (
        <div
          className={`p-3 rounded-xl text-xs font-semibold mb-6 ${
            msg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* BANNERS & LOGOS */}
        <div className="space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            Store Images
          </label>

          {/* Banner Upload */}
          <div className="relative h-32 w-full bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center">
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
            <div className="w-20 h-20 bg-slate-100 border border-slate-200 rounded-2xl overflow-hidden flex items-center justify-center shrink-0">
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
              <p className="text-[10px] text-slate-400 mt-1">Recommended size: 400x400px (PNG or JPG)</p>
            </div>
          </div>
        </div>

        {/* BASIC DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Business / Store Name
            </label>
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Store Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="General">General Marketplace</option>
              <option value="Agriculture">Agriculture & Food</option>
              <option value="Electronics">Electronics & Gadgets</option>
              <option value="Apparel">Apparel & Fashion</option>
              <option value="Services">Services & Logistics</option>
            </select>
          </div>
        </div>

        {/* COMPANY DESCRIPTION */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Company Description / Bio
          </label>
          <textarea
            rows={4}
            placeholder="Tell shoppers about your business, background, and product offerings..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        {/* CONTACT & LOCATION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Business Email
            </label>
            <input
              type="email"
              placeholder="sales@business.com"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Business Phone
            </label>
            <input
              type="tel"
              placeholder="+234..."
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Physical Address / Location
            </label>
            <input
              type="text"
              placeholder="Suite 4, Co-op Building, Lagos"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Website URL
            </label>
            <input
              type="url"
              placeholder="https://example.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || uploading}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition disabled:opacity-50"
        >
          {loading ? 'Saving Profile...' : 'Save Store Details'}
        </button>
      </form>
    </div>
  );
}
