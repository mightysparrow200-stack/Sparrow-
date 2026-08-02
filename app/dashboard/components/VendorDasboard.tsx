'use client';

interface VendorDashboardProps {
  user: any;
  profile: any;
}

export default function VendorDashboard({ user, profile }: VendorDashboardProps) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in font-sans">
      
      {/* VENDOR HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-slate-950">
            Vendor Merchant Portal
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your store inventory, track customer orders, and view sales payouts.
          </p>
        </div>

        {/* VENDOR PROFILE DISPLAY */}
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

      {/* METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* CARD 1: TOTAL SALES */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            Total Revenue Earned
          </span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-2">
            ₦0.00
          </div>
          <p className="text-xs text-slate-400 mt-3">
            Payouts processed directly through the cooperative wallet system.
          </p>
        </div>

        {/* CARD 2: ACTIVE PRODUCTS */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            Active Store Listings
          </span>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            0 <span className="text-xs font-medium text-slate-400">Items</span>
          </div>
          <p className="text-xs text-slate-400 mt-3">
            Products available to cooperative members.
          </p>
        </div>

        {/* CARD 3: ORDERS TO FULFILL */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            Pending Orders
          </span>
          <div className="text-2xl font-extrabold text-amber-500 mt-2">
            0
          </div>
          <p className="text-xs text-slate-400 mt-3">
            Orders waiting for fulfillment or delivery confirmation.
          </p>
        </div>

      </div>

      {/* VENDOR ACTIONS & INVENTORY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: QUICK MERCHANT TOOLKIT */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-serif text-base text-slate-950 font-bold">
            Merchant Actions
          </h3>
          
          <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-3 rounded-xl transition shadow-sm">
            + Add New Product
          </button>

          <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-3 rounded-xl transition">
            Request Payout / Withdrawal
          </button>
        </div>

        {/* RIGHT COLUMN: RECENT MERCHANT ORDERS */}
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
