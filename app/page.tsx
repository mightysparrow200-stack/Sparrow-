import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 animate-fade-in">
      
      {/* HERO SECTION CONTAINER */}
      <section className="bg-coopGreen text-white rounded-2xl p-8 md:p-14 relative overflow-hidden shadow-lg">
        <div className="max-w-xl relative z-10">
          <span className="text-coopGold font-semibold tracking-wider text-xs uppercase bg-white/10 px-3 py-1 rounded-full inline-block mb-4">
            Alumni Core Network
          </span>
          <h1 className="text-3xl md:text-5xl mb-4 leading-tight">
            Welcome to the Alumni Cooperative
          </h1>
          <p className="text-white/80 text-sm md:text-base mb-8 leading-relaxed">
            Securing institutional resources, maximizing member dividends, and facilitating transparent collective growth. Enter your dashboard to manage your stakes securely.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/dashboard" className="bg-coopGold text-slate-900 font-semibold px-6 py-3 rounded-xl text-sm hover:opacity-90 active:scale-95 transition shadow-sm">
              Enter Portal
            </Link>
            <Link href="/shop" className="bg-white/10 border border-white/20 text-white font-medium px-6 py-3 rounded-xl text-sm hover:bg-white/20 active:scale-95 transition">
              Browse Marketplace
            </Link>
          </div>
        </div>
        
        {/* Background Decorative Element */}
        <div className="hidden md:block absolute right-12 top-1/2 -translate-y-1/2 text-[10rem] opacity-10 select-none pointer-events-none">
          🌿
        </div>
      </section>

      {/* QUICK STATS INFRASTRUCTURE ROW */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {[
          { label: 'Active Members', value: '1,240+' },
          { label: 'Total Pool Asset', value: '$450K' },
          { label: 'Dividends Paid', value: '14.2%' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-gray-200/80 rounded-xl p-4 text-center shadow-sm">
            <div className="text-xl md:text-2xl font-serif text-coopGreen font-bold">{stat.value}</div>
            <div className="text-[10px] md:text-xs text-gray-400 font-medium mt-1 uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

    </div>
  )
}
