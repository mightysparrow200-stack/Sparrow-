'use client';

import Link from 'next/link';

// Mock orders data tailored to the alumni cooperative marketplace
const mockOrders = [
  {
    id: "MSC-9082",
    date: "July 12, 2026",
    total: "₦45,000",
    status: "In Transit",
    statusColor: "text-amber-600 bg-amber-50 border-amber-100",
    items: [
      { name: "Premium Member Polo Shirt (L)", qty: 1, price: "₦15,000" },
      { name: "Cooperative Rice Scheme - 25kg", qty: 1, price: "₦30,000" }
    ]
  },
  {
    id: "MSC-8841",
    date: "June 28, 2026",
    total: "₦12,500",
    status: "Delivered",
    statusColor: "text-emerald-600 bg-emerald-50 border-emerald-100",
    items: [
      { name: "Alumni Customized Notebook & Pen Set", qty: 2, price: "₦6,250" }
    ]
  }
];

export default function OrdersPage() {
  return (
    <main className="min-h-screen bg-slate-50/50 py-12 font-sans">
      <div className="max-w-3xl mx-auto px-4">
        
        {/* Header Breadcrumbs & Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-2">
            <Link href="/" className="hover:text-slate-600">Home</Link>
            <span>/</span>
            <span className="text-slate-600">My Orders</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Purchase History</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track and manage your orders from the Mighty Sparrow Alumni Cooperative marketplace.
          </p>
        </div>

        {mockOrders.length === 0 ? (
          /* Empty State */
          <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">No orders placed yet</h3>
            <p className="text-xs text-slate-400 mb-6">Explore our cooperative market to find discounted products.</p>
            <Link 
              href="/shop" 
              className="inline-block bg-slate-950 text-white text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-slate-800 transition"
            >
              Browse Marketplace
            </Link>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-6">
            {mockOrders.map((order) => (
              <div 
                key={order.id} 
                className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden"
              >
                {/* Order Meta Header */}
                <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">Order ID</span>
                      <span className="text-xs font-bold text-slate-900">{order.id}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">Date Placed</span>
                      <span className="text-xs font-semibold text-slate-600">{order.date}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Amount</span>
                      <span className="text-xs font-bold text-slate-950">{order.total}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${order.statusColor}`}>
                    {order.status}
                  </span>
                </div>

                {/* Items List */}
                <div className="p-6 divide-y divide-slate-100">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Quantity: {item.qty}</p>
                      </div>
                      <span className="text-xs font-semibold text-slate-600">{item.price}</span>
                    </div>
                  ))}
                </div>

                {/* Actions Footer */}
                <div className="px-6 py-3 bg-slate-50/30 border-t border-slate-100 flex justify-end gap-2">
                  <button className="px-4 py-2 rounded-lg text-[10px] font-bold text-slate-500 hover:text-slate-800 transition">
                    Download Invoice
                  </button>
                  <button className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2 rounded-lg text-[10px] font-bold transition">
                    Track Package
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
