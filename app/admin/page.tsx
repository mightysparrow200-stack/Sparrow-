'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

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

interface Profile {
  id: string;
  full_name: string;
  email: string;
  department: string;
  graduation_year: string;
  role: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'orders' | 'members'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [members, setMembers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  async function fetchAdminData() {
    try {
      setLoading(true);

      // 1. Fetch all orders with order items
      const { data: ordersData, error: ordersErr } = await supabase
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
        .order('created_at', { ascending: false });

      if (ordersErr) console.error('Error fetching orders:', ordersErr);
      else setOrders(ordersData || []);

      // 2. Fetch all members
      const { data: membersData, error: membersErr } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name', { ascending: true });

      if (membersErr) console.error('Error fetching profiles:', membersErr);
      else setMembers(membersData || []);

    } catch (err) {
      console.error('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  }

  // Update order delivery status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as any } : o))
      );
    } catch (err: any) {
      alert(`Failed to update status: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  // Toggle member role / approval status
  const handleToggleMemberRole = async (memberId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'member' : 'admin';
    setUpdatingId(memberId);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', memberId);

      if (error) throw error;

      setMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
      );
    } catch (err: any) {
      alert(`Failed to update member role: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-500">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-sans">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900">Co-Op Admin Portal</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage member orders, track shipment statuses, and oversee member accounts.
        </p>
      </div>

      {/* TABS */}
      <div className="flex border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab('orders')}
          className={`py-3 px-6 text-xs font-bold border-b-2 transition ${
            activeTab === 'orders'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          📦 Order Management ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('members')}
          className={`py-3 px-6 text-xs font-bold border-b-2 transition ${
            activeTab === 'members'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          👥 Member Accounts ({members.length})
        </button>
      </div>

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-500">
              No orders found in database.
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Order ID</span>
                    <span className="text-sm font-black text-slate-900">{order.order_code}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Amount</span>
                    <span className="text-sm font-black text-emerald-700">₦{order.total_amount.toLocaleString()}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Update Status</span>
                    <select
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                      className="mt-1 text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* ITEMS */}
                <div className="pt-3">
                  <p className="text-[10px] font-bold uppercase text-slate-400 mb-2">Items Purchased</p>
                  <ul className="space-y-1">
                    {order.order_items?.map((item) => (
                      <li key={item.id} className="text-xs text-slate-700 flex justify-between">
                        <span>{item.product_title} (x{item.quantity})</span>
                        <span className="font-bold">₦{(item.unit_price * item.quantity).toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>

                  {order.delivery_address && (
                    <p className="text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-50">
                      📍 <strong>Address:</strong> {order.delivery_address}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* MEMBERS TAB */}
      {activeTab === 'members' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                <th className="p-4">Name & Email</th>
                <th className="p-4">Department / Year</th>
                <th className="p-4">Role</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-900">
                    <div>{member.full_name || 'Alumni Member'}</div>
                    <div className="text-[10px] font-normal text-slate-400">{member.email}</div>
                  </td>
                  <td className="p-4 text-slate-600">
                    {member.department || 'N/A'} {member.graduation_year ? `('${member.graduation_year.slice(-2)})` : ''}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                      member.role === 'admin' 
                        ? 'bg-purple-50 text-purple-700 border-purple-200' 
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {member.role || 'member'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      disabled={updatingId === member.id}
                      onClick={() => handleToggleMemberRole(member.id, member.role)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg transition"
                    >
                      {member.role === 'admin' ? 'Demote to Member' : 'Make Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
