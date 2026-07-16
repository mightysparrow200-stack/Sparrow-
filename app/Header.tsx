{/* Dynamic Dropdown List */}
{isOpen && (
  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-slate-50 font-sans">
    
    {/* Member Section */}
    <div className="px-4 py-2 bg-slate-50/50">
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Alumni Member Portal</span>
    </div>
    <Link
      href="/marketplace"
      onClick={() => setIsOpen(false)}
      className="flex items-center justify-between px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
    >
      <span>🛒 Browse Marketplace</span>
    </Link>
    <Link
      href="/member/profile"
      onClick={() => setIsOpen(false)}
      className="flex items-center justify-between px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
    >
      <span>👤 Member Profile</span>
    </Link>

    {/* Vendor Section */}
    <div className="px-4 py-2 bg-slate-50/50">
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Merchant Console</span>
    </div>
    <Link
      href="/vendor/products"
      onClick={() => setIsOpen(false)}
      className="flex items-center justify-between px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
    >
      <span>📦 My products</span>
    </Link>
    <Link
      href="/vendor/profile"
      onClick={() => setIsOpen(false)}
      className="flex items-center justify-between px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
    >
      <span>🏪 Vendor Business Profile</span>
    </Link>
  </div>
)}
