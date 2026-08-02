import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = await createClient();

  // 1. Authenticate user from session
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  // 2. Fetch linked Profile and Wallet data from Supabase
  const [{ data: profile }, { data: wallet }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('wallets').select('*').eq('user_id', user.id).single(),
  ]);

  const memberBalance = wallet?.balance ? Number(wallet.balance) : 0;
  const isMember = profile?.role === 'member' || profile?.role === 'vendor';

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in font-sans">
      
      {/* PORTAL HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-slate-950">
            Alumni Member Portal
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Access your personalized cooperative equity, track pool shares, and manage savings.
          </p>
        </div>

        {/* PROFILE STATUS DISPLAY */}
        <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center text-sm">
            🦅
          </div>
          <div className="text-left pr-2">
            <span className="block text-xs font-bold text-slate-900 leading-none">
              {profile?.full_name || user.email}
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold block mt-1">
              Status: {isMember ? 'Active Member' : 'Guest Account'} ({profile?.role || 'Member'})
            </span>
          </div>
        </div>
      </div>

      {/* BALANCES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* CARD 1: PORTAL WALLET */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            Cooperative Savings Balance
          </span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-2">
            ₦{memberBalance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-slate-400 mt-3">
            Available for instant use inside the Cooperative Marketplace.
          </p>
        </div>

        {/* CARD 2: COOP EQUITY SHARES */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            Your Equity Pool Ownership
          </span>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            1,250 <span className="text-xs font-medium text-slate-400">Shares</span>
          </div>
          <p className="text-xs text-slate-400 mt-3">
            Representing an active 0.12% stake in community physical assets.
          </p>
        </div>

        {/* CARD 3: DIVIDENDS ACCRUED */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            Total Dividends Received
          </span>
          <div className="text-2xl font-extrabold text-amber-500 mt-2">
            ₦75,400.00
          </div>
          <p className="text-xs text-slate-400 mt-3">
            Calculated quarterly based on total marketplace external trade yields.
          </p>
        </div>

      </div>

      {/* PORTAL ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: QUICK ACCOUNT INFORMATION */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-3">
          <h3 className="font-serif text-base text-slate-950 font-bold">
            Account Identifiers
          </h3>
          <p className="text-xs text-slate-400">
            Your verified cooperative registration information.
          </p>
          
          <div className="pt-2 space-y-2 border-t border-slate-100 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Account Email:</span>
              <span className="font-semibold text-slate-900">{user.email}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Member ID:</span>
              <span className="font-mono font-semibold text-slate-900">
                {user.id.slice(0, 8)}...
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: RECENT LEDGER TRANSACTIONS */}
        <div className="md:col-span-2 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <h3 className="font-serif text-base text-slate-950 font-bold mb-1">
            Personal Ledger
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Real-time status tracking of all wallet activity.
          </p>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs">
              <div>
                <span className="font-bold text-slate-900 block">
                  Initial Welcome Capital Grant
                </span>
                <span className="text-[10px] text-slate-400">
                  Co-Op Onboarding Credit • Verified
                </span>
              </div>
              <span className="font-bold text-emerald-600">+₦1,000.00</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs">
              <div>
                <span className="font-bold text-slate-900 block">
                  Co-Op Dividend Distribution
                </span>
                <span className="text-[10px] text-slate-400">
                  Quarterly Yield payout • Authorized by Admin
                </span>
              </div>
              <span className="font-bold text-emerald-600">+₦10,500.00</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
