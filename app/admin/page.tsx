'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  wallet_balance?: number;
}

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  user_id: string;
  profiles?: {
    full_name: string;
    email: string;
  };
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Dynamic stats
  const [stats, setStats] = useState({
    totalPoolAssets: 0,
    availableLiquidity: 0,
    totalMembers: 0,
    pendingTasksCount: 0,
  });

  // Database lists
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [members, setMembers] = useState<Profile[]>([]);
  const [vendors, setVendors] = useState<Profile[]>([]);
  
  // UI Tabs
  const [activeTab, setActiveTab] = useState<'approvals' | 'members' | 'vendors'>('approvals');
  const [dividendRate, setDividendRate] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // 1. Fetch All Admin Data
  const fetchAdminData = async () => {
    try {
      setLoading(true);
      if (!supabase) return;

      // A. Fetch Profiles & Wallets to aggregate stats & list members
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      const { data: walletsData, error: walletsError } = await supabase
        .from('wallets')
        .select('*');

      if (profilesError) throw profilesError;
      if (walletsError) throw walletsError;

      // Merge wallet balances into profiles
      const enrichedProfiles: Profile[] = (profilesData || []).map((prof) => {
        const userWallet = (walletsData || []).find((w) => w.user_id === prof.id);
        return {
          ...prof,
          wallet_balance: userWallet ? Number(userWallet.balance) : 0,
        };
      });

      setMembers(enrichedProfiles);
      setVendors(enrichedProfiles.filter((p) => p.role === 'vendor'));

      // B. Fetch Pending Orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          total_amount,
          status,
          created_at,
          user_id,
          profiles (
            full_name,
            email
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;
      setPendingOrders((ordersData as any) || []);

      // C. Calculate Calculations & Treasury Aggregations
      const totalWalletsSum = (walletsData || []).reduce((sum, w) => sum + Number(w.balance), 0);
      
      setStats({
        totalPoolAssets: totalWalletsSum * 1.5, // Total asset pooling metric (multiplied for asset leverage representation)
        availableLiquidity: totalWalletsSum,   // Cash directly sitting in client wallets
        totalMembers: profilesData?.length || 0,
        pendingTasksCount: ordersData?.length || 0,
      });

    } catch (err) {
      console.error('Failed to fetch admin system metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // 2. Handle Approving a Pending Order
  const handleApproveOrder = async (orderId: string) => {
    try {
      setActionLoading(orderId);
      if (!supabase) return;

      const { error } = await supabase
        .from('orders')
        .update({ status: 'completed' })
        .eq('id', orderId);

      if (error) throw error;

      // Update UI state locally
      setPendingOrders((prev) => prev.filter((o) => o.id !== orderId));
      setStats((prev) => ({ ...prev, pendingTasksCount: prev.pendingTasksCount - 1 }));
      
      setSuccessMessage('Transaction approved and settled successfully.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error approving order:', err);
    } finally {
      setActionLoading(null);
    }
  };

  // 3. Handle Declining & Refunding a Pending Order
  const handleDeclineOrder = async (order: Order) => {
    try {
      setActionLoading(order.id);
      if (!supabase) return;

      // A. Fetch current member balance to restore funds safely
      const { data: wallet, error: walletError } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', order.user_id)
        .single();

      if (walletError) throw walletError;

      const restoredBalance = Number(wallet.balance) + Number(order.total_amount);

      // B. Update Wallet balance
      const { error: refundError } = await supabase
        .from('wallets')
        .update({ balance: restoredBalance })
        .eq('user_id', order.user_id);

      if (refundError) throw refundError;

      // C. Update Order state to cancelled
      const { error: orderError } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', order.id);

      if (orderError) throw orderError;

      // Update UI list
      setPendingOrders((prev) => prev.filter((o) => o.id !== order.id));
      setStats((prev) => ({
        ...prev,
        pendingTasksCount: prev.pendingTasksCount - 1,
        availableLiquidity: prev.availableLiquidity + order.total_amount
      }));

      setSuccessMessage('Transaction declined. Funds refunded directly to member wallet.');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      console.error('Error rejecting transaction:', err);
    } finally {
      setActionLoading(null);
    }
  };

  // 4. Handle Updating Roles (Admin Control)
  const handleChangeUserRole = async (userId: string, newRole: string) => {
    try {
      if (!supabase) return;
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      
      // Update local state
      setMembers((prev) =>
        prev.map((m) => (m.id === userId ? { ...m, role: newRole } : m))
      );
      setVendors(members.filter((m) => m.id !== userId && m.role === 'vendor'));
      if (newRole === 'vendor') {
        const target = members.find((m) => m.id === userId);
        if (target) setVendors((prev) => [...prev, { ...target, role: 'vendor' }]);
      }

      setSuccessMessage('Member profile role changed successfully.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to change profile system access level:', err);
    }
  };

  // 5. Yield Distributions
  const handleDistributeDividends = async (e: React.FormEvent) => {
    e.preventDefault();
    const rate = parseFloat(dividendRate);
    if (isNaN(rate) || rate <= 0) return;

    try {
      if (!supabase) return;
      setActionLoading('dividends');

      // Loop over and distribute dividend payments to each wallet in the system
      const { data: wallets, error: fetchErr } = await supabase.from('wallets').select('*');
      if (fetchErr) throw fetchErr;

      for (const wallet of (wallets || [])) {
        const bonus = Number(wallet.balance) * (rate / 100);
        await supabase
          .from('wallets')
          .update({ balance: Number(wallet.balance) + bonus })
          .eq('id', wallet.id);
      }

      setSuccessMessage(`Successfully processed & distributed a ${rate}% dividend across active member wallets!`);
      setDividendRate('');
      fetchAdminData(); // Refresh UI totals
    } catch (err) {
      console.error('Error distributing system yield:', err);
    } finally {
      setActionLoading(null);
      setTimeout(() => setSuccessMessage(''), 4000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      
      {/* PAGE HEADER */}
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔑</span>
          <h1 className="text-2xl md:text-3xl font-serif text-slate-950">Administrative Ledger</h1>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Cooperative management interface. Authorize pool allocations, audit treasury reserves, and trigger dividends.
        </p>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Total Asset Pool</span>
          <div className="text-xl font-extrabold text-slate-900 mt-1">
            ₦{stats.totalPoolAssets.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Cash Reserves</span>
          <div className="text-xl font-extrabold text-emerald-600 mt-1">
            ₦{stats.availableLiquidity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Registered Members</span>
          <div className="text-xl font-extrabold text-slate-900 mt-1">{stats.totalMembers}</div>
        </div>
        <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Pending Orders</span>
          <div className="text-xl font-extrabold text-amber-500 mt-1">{stats.pendingTasksCount}</div>
        </div>
      </div>

      {/* TABS CONTROLLER */}
      <div className="flex border-b border-gray-200 mb-6 gap-6">
        <button
          onClick={() => setActiveTab('approvals')}
          className={`pb-3 text-sm font-semibold transition ${
            activeTab === 'approvals' ? 'border-b-2 border-slate-900 text-slate-900' : 'text-gray-400'
          }`}
        >
          Pending Approvals ({pendingOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={`pb-3 text-sm font-semibold transition ${
            activeTab === 'members' ? 'border-b-2 border-slate-900 text-slate-900' : 'text-gray-400'
          }`}
        >
          Manage Members ({members.length})
        </button>
        <button
          onClick={() => setActiveTab('vendors')}
          className={`pb-3 text-sm font-semibold transition ${
            activeTab === 'vendors' ? 'border-b-2 border-slate-900 text-slate-900' : 'text-gray-400'
          }`}
        >
          Audit Vendors ({vendors.length})
        </button>
      </div>

      {/* MAIN VIEWPORT PANEL */}
      {loading ? (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <p className="text-sm text-gray-400">Loading live directory systems...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* TAB CONTENTS (LEFT & CENTER COLUMN) */}
          <div className="md:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            
            {/* TAB A: APPROVALS */}
            {activeTab === 'approvals' && (
              <div>
                <h3 className="font-serif text-lg text-slate-950 mb-1">Queue & Authorizations</h3>
                <p className="text-xs text-gray-400 mb-4">Validate inbound capital checkouts or pending order processing.</p>
                
                {pendingOrders.length > 0 ? (
                  <div className="space-y-3">
                    {pendingOrders.map((order) => (
                      <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 border border-gray-150 rounded-xl gap-3">
                        <div>
                          <div className="text-sm font-bold text-slate-950">
                            {order.profiles?.full_name || 'Anonymous Member'}
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5">
                            Order Reference: {order.id.slice(0, 8)} • Date: {new Date(order.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-3">
                          <span className="text-sm font-semibold text-slate-900">
                            ₦{order.total_amount.toLocaleString()}
                          </span>
                          <div className="flex gap-2">
                            <button
                              disabled={actionLoading !== null}
                              onClick={() => handleDeclineOrder(order)}
                              className="border border-red-200 hover:bg-red-50 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                            >
                              Reject
                            </button>
                            <button
                              disabled={actionLoading !== null}
                              onClick={() => handleApproveOrder(order.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                            >
                              {actionLoading === order.id ? 'Loading...' : 'Approve'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50/50 border border-dashed border-gray-200 rounded-xl">
                    <span className="text-2xl block mb-1">✅</span>
                    <p className="text-xs text-gray-500 font-medium">All pending order tasks are fully processed.</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB B: MEMBERS DIRECTORY */}
            {activeTab === 'members' && (
              <div>
                <h3 className="font-serif text-lg text-slate-950 mb-1">Member Registry</h3>
                <p className="text-xs text-gray-400 mb-4">View client assets, adjust security roles, and monitor engagement profiles.</p>
                
                <div className="divide-y divide-gray-150 space-y-3">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between pt-3 first:pt-0">
                      <div>
                        <div className="text-sm font-bold text-slate-950">{member.full_name}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{member.email}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-mono text-gray-600">
                          ₦{member.wallet_balance?.toLocaleString()}
                        </span>
                        <select
                          value={member.role}
                          onChange={(e) => handleChangeUserRole(member.id, e.target.value)}
                          className="bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium p-1 text-slate-800 focus:outline-none"
                        >
                          <option value="member">Member</option>
                          <option value="vendor">Vendor</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB C: AUDIT VENDORS */}
            {activeTab === 'vendors' && (
              <div>
                <h3 className="font-serif text-lg text-slate-950 mb-1">Audit Vendor Network</h3>
                <p className="text-xs text-gray-400 mb-4">Authorize marketplace distribution channels and verify affiliate businesses.</p>
                
                {vendors.length > 0 ? (
                  <div className="divide-y divide-gray-150 space-y-3">
                    {vendors.map((vendor) => (
                      <div key={vendor.id} className="flex items-center justify-between pt-3 first:pt-0">
                        <div>
                          <div className="text-sm font-bold text-slate-950">{vendor.full_name}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{vendor.email}</div>
                        </div>
                        <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                          Verified Vendor
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50/50 border border-dashed border-gray-200 rounded-xl">
                    <p className="text-xs text-gray-400 font-medium">No system accounts are currently flagged as vendors.</p>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* TASK 2: REVENUE DISTRIBUTION PANEL (RIGHT COLUMN) */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm h-fit">
            <h3 className="font-serif text-lg text-slate-950 mb-1">Broadcast Dividends</h3>
            <p className="text-xs text-gray-400 mb-4">Distribute yields securely across all active user wallets.</p>

            <form onSubmit={handleDistributeDividends} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Yield Rate (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="3.5"
                    value={dividendRate}
                    onChange={(e) => setDividendRate(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 bg-white text-sm transition"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">%</span>
                </div>
              </div>
              <button
                type="submit"
                disabled={actionLoading !== null}
                className="w-full bg-amber-400 text-slate-950 text-sm font-bold py-2.5 rounded-xl hover:bg-amber-500 active:scale-95 transition shadow-sm"
              >
                {actionLoading === 'dividends' ? 'Distributing...' : 'Distribute Yield'}
              </button>
            </form>

            {successMessage && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl leading-relaxed">
                {successMessage}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
      }
