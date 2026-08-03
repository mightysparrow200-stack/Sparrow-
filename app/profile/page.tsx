'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Profile fields
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('member');

  // Password fields
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status messages
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          window.location.href = '/login';
          return;
        }

        setEmail(user.email || '');

        // Fetch additional details from profiles table
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('full_name, phone, role')
          .eq('id', user.id)
          .single();

        if (profile) {
          setFullName(profile.full_name || '');
          setPhone(profile.phone || '');
          setRole(profile.role || 'member');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: fullName,
          phone: phone,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }

    setUpdatingPassword(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setPasswordMsg({ type: 'success', text: 'Password updated successfully!' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordMsg({ type: 'error', text: err.message || 'Failed to update password.' });
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-500">Loading Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-sans">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900">Profile Settings</h1>
        <p className="text-xs text-slate-500 mt-1">Manage your account details and security settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Summary Card */}
        <div className="md:col-span-1">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center text-3xl font-black mx-auto mb-4">
              {fullName ? fullName.charAt(0).toUpperCase() : email.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-sm font-bold text-slate-900">{fullName || 'Member'}</h2>
            <p className="text-xs text-slate-500 truncate mt-0.5">{email}</p>
            <span className="inline-block mt-3 px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase tracking-wider rounded-full border border-emerald-200">
              {role} Account
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: Forms */}
        <div className="md:col-span-2 space-y-6">
          
          {/* PERSONAL DETAILS FORM */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
              <span>👤</span> Personal Information
            </h3>

            {profileMsg && (
              <div className={`mb-4 p-3 rounded-xl text-xs font-semibold ${
                profileMsg.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {profileMsg.text}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Email Address (Read Only)
                </label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+234..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                />
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition disabled:opacity-50"
              >
                {savingProfile ? 'Saving...' : 'Save Profile Updates'}
              </button>
            </form>
          </div>

          {/* CHANGE PASSWORD FORM */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
              <span>🔒</span> Security & Password
            </h3>

            {passwordMsg && (
              <div className={`mb-4 p-3 rounded-xl text-xs font-semibold ${
                passwordMsg.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {passwordMsg.text}
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                />
              </div>

              <button
                type="submit"
                disabled={updatingPassword}
                className="py-2.5 px-5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition disabled:opacity-50"
              >
                {updatingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
