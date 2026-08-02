import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = await createClient();

  // 1. Authenticate user session
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  // 2. Fetch Profile & Wallet data in parallel
  const [{ data: profile }, { data: wallet }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('wallets').select('*').eq('user_id', user.id).single(),
  ]);

  // If user hasn't completed profile onboarding, redirect them
  if (!profile?.full_name) {
    redirect('/onboard/member');
  }

  const memberBalance = wallet?.balance ? Number(wallet.balance) : 0;
  const isVendor = profile?.role === 'vendor';

  // --- VENDOR DASHBOARD VIEW ---
  if (isVendor) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in font-sans">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif text-slate-950 font-bold">
              Vendor Merchant Portal
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage store inventory, track customer orders, and view sales payouts.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold">
              🏪
            </div>
            <div className="text-left pr-2">
              <span className="block text-xs font-bold text-slate-900 leading-none">
                {profile?.full_name || 'Verified Vendor'}
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold block mt-1">
                Verified Co-Op Merchant
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Total Revenue Earned
            </span>
            <div className="text-2xl font-extrabold text-emerald-600 mt-2">₦0.00</div>
            <p className="text-xs text-slate-400 mt-3">
              Payouts processed through the cooperative wallet system.
            </p>
          </div>
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Active Store Listings
            </span>
            <div className="text-2xl font-extrabold text-slate-900 mt-2">
              0 <span className="text-xs font-medium text-slate-400">Items</span>
            </div>
            <p className="text-xs text-slate-400 mt-3">Products available to members.</p>
          </div>
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Pending Orders
            </span>
            <div className="text-2xl font-extrabold text-amber-500 mt-2">0</div>
            <p className="text-xs text-slate-400 mt-3">Orders awaiting fulfillment.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-serif text-base text-slate-950 font-bold">
              Merchant Actions
            </h3>
            <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-3 rounded-xl transition shadow-sm">
              + Add New Product
            </button>
            <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-3 rounded-xl transition">
              Request Payout
            </button>
          </div>
          <div className="md:col-span-2 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
            <h3 className="font-serif text-base text-slate-950 font-bold mb-1">
              Store Orders
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Recent customer purchases made with Co-Op wallet funds.
            </p>
            <div className="p-8 text-center border border-dashed border-slate-200 rounded-xl">
              <span className="text-2xl block mb-2">📦</span>
              <p className="text-xs font-semibold text-slate-600">No orders received yet.</p>
              <p className="text-[11px] text-slate-400 mt-1">
                When members buy your products, orders will appear here in real time.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- MEMBER DASHBOARD VIEW ---
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in font-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-slate-950">
            Alumni Member Portal
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Access cooperative equity, track pool shares, and manage savings.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center text-sm">
            🦅
          </div>
          <div className="text-left pr-2">
            <span className="block text-xs font-bold text-slate-900 leading-none">
              {profile?.full_name || user.email}
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold block mt-1">
              Active Member ({profile?.member_type || 'Alumni'})
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            Equity Pool Ownership
          </span>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            1,250 <span className="text-xs font-medium text-slate-400">Shares</span>
          </div>
          <p className="text-xs text-slate-400 mt-3">
            Representing active stake in community physical assets.
          </p>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            Total Dividends Received
          </span>
          <div className="text-2xl font-extrabold text-amber-500 mt-2">₦75,400.00</div>
          <p className="text-xs text-slate-400 mt-3">
            Calculated quarterly based on marketplace trade yields.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          </div>
        </div>
      </div>
    </div>
  );
  }import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import MemberDashboard from './components/MemberDashboard';
import VendorDashboard from './components/VendorDashboard';

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

  // If user hasn't completed onboarding details, route them to finish setup
  if (!profile?.full_name) {
    redirect('/onboard/member');
  }

  // 3. Render dynamic dashboard based on user role
  if (profile?.role === 'vendor') {
    return <VendorDashboard user={user} profile={profile} />;
  }

  return <MemberDashboard user={user} profile={profile} wallet={wallet} />;
}
