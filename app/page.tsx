import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 md:py-20 space-y-20 font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="text-center space-y-6 max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[10px] font-bold uppercase tracking-wider">
          👑 Premium Alumni Network &amp; Goods
        </span>
        <h1 className="text-4xl md:text-6xl font-serif text-slate-950 font-bold leading-tight">
          Pool Capital. <br />
          <span className="text-emerald-600">Maximize Wealth.</span>
        </h1>
        <p className="text-sm md:text-base text-slate-600 leading-relaxed max-w-xl mx-auto">
          Welcome to the Mighty Sparrow Alumni Cooperative Society. We source high-quality general goods, lifestyle gear, and productivity tech directly for our members at institutional rates.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href="/shop"
            className="w-full sm:w-auto bg-emerald-600 text-white text-sm font-bold px-8 py-3.5 rounded-xl hover:bg-emerald-700 transition shadow-md hover:shadow-lg text-center"
          >
            Explore Marketplace
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto bg-white border border-slate-200 text-slate-900 text-sm font-bold px-8 py-3.5 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition text-center"
          >
            Access Member Portal
          </Link>
        </div>
      </section>

      <hr className="border-slate-200" />

      {/* 2. THE COOPERATIVE ADVANTAGE */}
      <section className="space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-serif text-slate-950 font-bold">Why Our Co-Op Works</h2>
          <p className="text-xs text-slate-500">Leveraging our collective buying power as a unified alumni front.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-lg text-emerald-600">
              🏷️
            </div>
            <h3 className="font-serif text-base text-slate-950 font-bold">15% Member Discount</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every item in our general goods catalog is discounted by 15% exclusively for verified alumni members. We pass direct manufacturing savings directly to you.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-lg text-amber-600">
              📈
            </div>
            <h3 className="font-serif text-base text-slate-950 font-bold">Pooled Wealth &amp; Dividends</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Any surplus generated from non-member retail sales is reinvested directly into our cooperative reserve and paid back to members as annual dividends.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg text-slate-950">
              🛡️
            </div>
            <h3 className="font-serif text-base text-slate-950 font-bold">Secure Naira Portals</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Deposit, track, and pay seamlessly in Naira (₦). Use your secure cooperative wallet balance to bypass conventional banking gateways for zero-fee shopping.
            </p>
          </div>
        </div>
      </section>

      {/* 3. CURRENT METRICS SECTION */}
      <section className="bg-slate-950 text-white rounded-3xl p-8 md:p-12 shadow-xl space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Live System Statistics</span>
            <h2 className="text-2xl md:text-3xl font-serif text-white font-bold">Cooperative Pool Health</h2>
          </div>
          <div className="h-px w-full md:w-1/3 bg-slate-800" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
          <div className="space-y-1">
            <span className="block text-[10px] text-slate-400 uppercase font-semibold">Total Pool Assets</span>
            <span className="block text-xl md:text-2xl font-serif font-bold text-amber-400">₦45,250,000</span>
          </div>
          <div className="space-y-1">
            <span className="block text-[10px] text-slate-400 uppercase font-semibold">Active Alumni</span>
            <span className="block text-xl md:text-2xl font-serif font-bold text-white">1,840+ Members</span>
          </div>
          <div className="space-y-1">
            <span className="block text-[10px] text-slate-400 uppercase font-semibold">Dividends Distributed</span>
            <span className="block text-xl md:text-2xl font-serif font-bold text-white">₦3,120,000</span>
          </div>
          <div className="space-y-1">
            <span className="block text-[10px] text-slate-400 uppercase font-semibold">Discount Tier</span>
            <span className="block text-xl md:text-2xl font-serif font-bold text-emerald-400">Flat 15% Off</span>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION */}
      <section className="text-center py-8 max-w-xl mx-auto space-y-6">
        <h2 className="text-2xl md:text-3xl font-serif text-slate-950 font-bold">Ready to unlock your benefits?</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Toggle your membership status at any time inside the Portal or the Marketplace to see member pricing versus standard retail pricing.
        </p>
        <div className="pt-2">
          <Link
            href="/dashboard"
            className="inline-block bg-slate-900 text-white text-xs font-bold px-6 py-3 rounded-xl hover:bg-slate-800 transition shadow-sm"
          >
            Access My Dashboard
          </Link>
        </div>
      </section>

    </div>
  );
}
