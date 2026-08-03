'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface OrderItem {
  id: string;
  product_title: string;
  quantity: number;
  unit_price: number;
}

interface Order {
  id: string;
  order_code: string;
  created_at: string;
  total_amount: number;
  status: 'Pending' | 'In Transit' | 'Delivered' | 'Cancelled';
  delivery_address?: string;
  order_items: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          window.location.href = '/login';
          return;
        }

        // Fetch orders along with nested order items
        const { data, error } = await supabase
          .from('orders')
          .select(`
            id,
            order_code,
            created_at,
            total_amount,
            status,
            delivery_address,
            order_items (
              id,
              product_title,
              quantity,
              unit_price
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  const handleDownloadInvoice = (orderCode: string) => {
    alert(`Generating invoice for order ${orderCode}...`);
  };

  const handleTrackPackage = (orderCode: string) => {
    alert(`Tracking shipment status for order ${orderCode}...`);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-500">Loading Your Orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-sans">
      {/* BREADCRUMB & HEADER */}
      <div className="mb-6">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2 font-medium">
          <Link href="/" className="hover:text-emerald-600 transition">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-bold">My Orders</span>
        </div>

        <h1 className="text-2xl font-black text-slate-900">Purchase History</h1>
        <p className="text-xs text-slate-500 mt-1">
          Track and manage your orders from the Co-Op Marketplace.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
          <p className="text-sm font-bold text-slate-700 mb-2">No past orders found.</p>
          <p className="text-xs text-slate-400 mb-6">You haven't placed any marketplace orders yet.</p>
          <Link
            href="/shop"
            className="px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm inline-block hover:bg-emerald-700 transition"
          >
            Explore Shop
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const formattedDate = new Date(order.created_at).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div
                key={order.id}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
              >
                {/* ORDER HEADER */}
                <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
                  <div className="flex flex-wrap items-center gap-6 text-xs">
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Order ID
                      </span>
                      <span className="font-black text-slate-900">{order.order_code}</span>
                    </div>

                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Date Placed
                      </span>
                      <span className="font-bold text-slate-700">{formattedDate}</span>
                    </div>

                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Total Amount
                      </span>
                      <span className="font-black text-slate-900">
                        ₦{order.total_amount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* STATUS BADGE */}
                  <div>
                    <span
                      className={`px-3 py-1 text-[11px] font-black rounded-full border ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : order.status === 'In Transit'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* ORDER ITEMS LIST */}
                <div className="p-5 divide-y divide-slate-100">
                  {order.order_items?.map((item) => (
                    <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
                      <div>
                        <h3 className="text-xs font-bold text-slate-900">{item.product_title}</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">Quantity: {item.quantity}</p>
                      </div>

                      <span className="text-xs font-black text-slate-900">
                        ₦{(item.unit_price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* FOOTER ACTIONS */}
                <div className="px-5 py-4 bg-slate-50/30 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    onClick={() => handleDownloadInvoice(order.order_code)}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-xl transition"
                  >
                    Download Invoice
                  </button>

                  <button
                    onClick={() => handleTrackPackage(order.order_code)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition"
                  >
                    Track Package
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
