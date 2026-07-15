'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MemberOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    graduationYear: '',
    alumniId: '',
    phoneNumber: '',
    agreeToTerms: false,
    walletPin: '',
    confirmPin: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.walletPin !== formData.confirmPin) {
      alert("Security PINs do not match!");
      return;
    }
    setLoading(true);
    
    // Simulate database write / api call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto my-16 bg-white border border-gray-100 rounded-3xl p-8 text-center space-y-6 shadow-xl animate-fade-in">
        <div className="w-16 h-16 bg-coopGreen/10 text-coopGreen rounded-full flex items-center justify-center text-3xl mx-auto">
          ✓
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-serif text-slate-950">Application Submitted!</h1>
          <p className="text-xs text-gray-500 leading-relaxed">
            Welcome to the Mighty Sparrow Alumni Cooperative. Your details are being verified against the official graduation register.
          </p>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl text-left border border-gray-100 space-y-2">
          <span className="block text-[10px] text-gray-400 font-bold uppercase">Membership Next Steps</span>
          <p className="text-[11px] text-slate-700">
            • A temporary verification credit of <strong>₦1,000</strong> has been provisioned.<br />
            • Review period takes 24-48 business hours.<br />
            • Use your selected PIN for all future marketplace checkout authorizations.
          </p>
        </div>
        <button
          onClick={() => router.push('/dashboard')}
          className="w-full bg-slate-900 text-white text-xs font-bold py-3.5 rounded-xl hover:bg-slate-800 transition"
        >
          Go to Member Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto my-12 px-4 animate-fade-in">
      {/* Onboarding Progress Header */}
      <div className="mb-8 space-y-2 text-center">
        <span className="text-[10px] uppercase font-bold tracking-wider text-coopGold">Alumni Registry</span>
        <h1 className="text-3xl font-serif text-slate-950">Join the Cooperative</h1>
        <p className="text-xs text-gray-400">Unlock a collective 15% discount and secure pooled assets.</p>
        
        {/* Progress Bar */}
        <div className="flex gap-2 max-w-xs mx-auto pt-4">
          <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-coopGreen' : 'bg-gray-100'}`} />
          <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-coopGreen' : 'bg-gray-100'}`} />
          <div className={`h-1.5 flex-1 rounded-full ${step >= 3 ? 'bg-coopGreen' : 'bg-gray-100'}`} />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm">
        {step === 1 && (
          <form onSubmit={handleNext} className="space-y-5">
            <h2 className="text-lg font-serif text-slate-950">Step 1: Personal Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Joseph Peter"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-coopGreen focus:border-coopGreen outline-none transition"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="you@alumni.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-coopGreen focus:border-coopGreen outline-none transition"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+234..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-coopGreen focus:border-coopGreen outline-none transition"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-coopGreen text-white text-xs font-bold py-3.5 rounded-xl hover:bg-coopGreen-dark transition"
            >
              Continue to Registry Verification
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleNext} className="space-y-5">
            <h2 className="text-lg font-serif text-slate-950">Step 2: Alumni Registry Proof</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Graduation Year</label>
                <input
                  type="number"
                  required
                  min="1960"
                  max="2026"
                  placeholder="e.g. 2018"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-coopGreen focus:border-coopGreen outline-none transition"
                  value={formData.graduationYear}
                  onChange={(e) => setFormData({...formData, graduationYear: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Alumni ID / Registry Matric No.</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. U/18/MS/4051"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-coopGreen focus:border-coopGreen outline-none transition"
                  value={formData.alumniId}
                  onChange={(e) => setFormData({...formData, alumniId: e.target.value})}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 bg-white border border-gray-200 text-slate-700 text-xs font-bold py-3.5 rounded-xl hover:bg-gray-50 transition"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-[2] bg-coopGreen text-white text-xs font-bold py-3.5 rounded-xl hover:bg-coopGreen-dark transition"
              >
                Configure Security Wallet
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <h2 className="text-lg font-serif text-slate-950">Step 3: Security & PIN</h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Your security PIN will protect your cooperative store wallet (₦) during fast-checkout. Please select a secure 4-digit combination.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">4-Digit security PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  pattern="\d{4}"
                  required
                  placeholder="••••"
                  className="w-full text-center tracking-widest border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-coopGreen focus:border-coopGreen outline-none transition"
                  value={formData.walletPin}
                  onChange={(e) => setFormData({...formData, walletPin: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm security PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  pattern="\d{4}"
                  required
                  placeholder="••••"
                  className="w-full text-center tracking-widest border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-coopGreen focus:border-coopGreen outline-none transition"
                  value={formData.confirmPin}
                  onChange={(e) => setFormData({...formData, confirmPin: e.target.value})}
                />
              </div>
            </div>
            
            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-0.5"
                checked={formData.agreeToTerms}
                onChange={(e) => setFormData({...formData, agreeToTerms: e.target.checked})}
              />
              <label htmlFor="terms" className="text-[11px] text-gray-500 leading-normal">
                I agree to let the Cooperative verify my records and abide by the Mighty Sparrow Bylaws.
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleBack}
                disabled={loading}
                className="flex-1 bg-white border border-gray-200 text-slate-700 text-xs font-bold py-3.5 rounded-xl hover:bg-gray-50 transition"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] bg-coopGreen text-white text-xs font-bold py-3.5 rounded-xl hover:bg-coopGreen-dark transition flex items-center justify-center gap-2"
              >
                {loading ? 'Submitting Registry...' : 'Finish & Join Onboarding'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
            }
