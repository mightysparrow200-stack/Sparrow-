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

interface Vendor {
  id: string;
  business_name: string;
  cac_number?: string;
  contact_person?: string;
  business_email?: string;
  phone?: string;
  primary_category?: string;
  min_coop_discount?: string;
  naira_payout_bank?: string;
  naira_account_number?: string;
  is_verified?: boolean;
  status?: string;
  created_at?: string;
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
  const [vendors, setVendors] = useState<Vendor[]>([]);
  
  // UI Tabs
  const [activeTab, setActiveTab] = useState<'approvals' | 'members' | 'vendors'>('approvals');
  const [dividendRate, setDividendRate] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // 1. Fetch All Admin Data
  const fetchAdminData = async () => {
    try {
      setLoading(true);
      if (!supabase) return;

      // A. Fetch Profiles & Wallets
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      const { data: walletsData, error: walletsError } = await supabase
        .from('wallets')
        .select('*');

      if (profilesError) throw profilesError;
      if (walletsError) throw walletsError;

      // Fetch Vendors directly from the 'vendors' table
      const { data: vendorsData, error: vendorsError } = await supabase
        .from('vendors')
        .select('*')
        .order('created_at', { ascending: false });

      if (vendorsError) console.error('Error fetching vendors table:', vendorsError);

      // Merge wallet balances into profiles
      const enrichedProfiles: Profile[] = (profilesData || []).map((prof) => {
        const userWallet = (walletsData || []).find((w) => w.user_id === prof.id);
        return {
          ...prof,
          wallet_balance: userWallet ? Number(userWallet.balance) : 0,
        };
      });

      setMembers(enrichedProfiles);
      setVendors(vendorsData || []);

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

      // C. Treasury Aggregations
      const totalWalletsSum = (walletsData || []).reduce((sum, w) => sum + Number(w.balance), 0);
      
      setStats({
        totalPoolAssets: totalWalletsSum * 1.5,
        availableLiquidity: totalWalletsSum,
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

  // 2. Handle Approving an Order
  const handleApproveOrder = async (orderId: string) => {
    try {
      setActionLoading(orderId);
      if (!supabase) return;

      const { error } = await supabase
        .from('orders')
        .update({ status: 'completed' })
        .eq('id', orderId);

      if (error) throw error;

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

  // 3. Handle Declining & Refunding an Order
  const handleDeclineOrder = async (order: Order) => {
    try {
      setActionLoading(order.id);
      if (!supabase) return;

      const { data: wallet, error: walletError } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', order.user_id)
        .single();

      if (walletError) throw walletError;

      const restoredBalance = Number(wallet.balance) + Number(order.total_amount);

      const { error: refundError } = await supabase
        .from('wallets')
        .update({ balance: restoredBalance })
        .eq('user_id', order.user_id);

      if (refundError) throw refundError;

      const { error: orderError } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', order.id);

      if (orderError) throw orderError;

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

  // 4. Handle Updating Roles
  const handleChangeUserRole = async (userId: string, newRole: string) => {
    try {
      if (!supabase) return;
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      
      setMembers((prev) =>
        prev.map((m) => (m.id === userId ? { ...m, role: newRole } : m))
      );

      setSuccessMessage('Member profile role changed successfully.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to change profile system access level:', err);
    }
  };

  // 5. Handle Vendor Verification Status Updates
  const handleUpdateVendorStatus = async (vendorId: string, newStatus: string) => {
    try {
      setActionLoading(vendorId);
      if (!supabase) return;

      const { error } = await supabase
        .from('vendors')
        .update({ 
          status: newStatus, 
          is_verified: newStatus === 'approved' 
        })
        .eq('id', vendorId);

      if (error) throw error;

      setVendors((prev) =>
        prev.map((v) =>
          v.id === vendorId
            ? { ...v, status: newStatus, is_verified: newStatus === 'approved' }
            : v
        )
      );

      setSuccessMessage(`Vendor application updated to ${newStatus.toUpperCase()}.`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error updating vendor verification state:', err);
    } finally {
      setActionLoading(null);
    }
  };

  // 6. Yield Distributions
  const handleDistributeDividends = async (e: React.FormEvent) => {
    e.preventDefault();
    const rate = parseFloat(dividendRate);
    if (isNaN(rate) || rate <= 0) return;

    try {
      if (!supabase) return;
      setActionLoading('dividends');

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
      fetchAdminData();
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
                  <div className="space-y-4">
                    {vendors.map((vendor) => (
                      <div key={vendor.id} className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-bold text-slate-950">
                            {vendor.business_name || 'Unnamed Business'}
                          </div>
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                            vendor.status === 'approved' ? 'bg-emerald-50 text-emerald-700' :
                            vendor.status === 'rejected' ? 'bg-red-50 text-red-700' :
                            'bg-amber-50 text-amber-700'
                          }`}>
                            {vendor.status || 'Pending'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 pt-2 border-t border-gray-200">
                          <div>
                            <span className="font-semibold text-gray-400 block">CAC Reg No:</span> 
                            {vendor.cac_number || 'N/A'}
                          </div>
                          <div>
                            <span className="font-semibold text-gray-400 block">Contact Person:</span> 
                            {vendor.contact_person || 'N/A'}
                          </div>
                          <div>
                            <span className="font-semibold text-gray-400 block">Email:</span> 
                            {vendor.business_email || 'N/A'}
                          </div>
                          <div>
                            <span className="font-semibold text-gray-400 block">Category:</span> 
                            {vendor.primary_category || 'N/A'}
                          </div>
                          <div>
                            <span className="font-semibold text-gray-400 block">Co-Op Discount:</span> 
                            {vendor.min_coop_discount ? `${vendor.min_coop_discount}%` : 'N/A'}
                          </div>
                          <div>
                            <span className="font-semibold text-gray-400 block">Payout Account:</span> 
                            {vendor.naira_payout_bank ? `${vendor.naira_payout_bank} - ${vendor.naira_account_number}` : 'N/A'}
                          </div>
                        </div>

                        {/* VENDOR ACTION BUTTONS */}
                        <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                          <button
                            disabled={actionLoading !== null}
                            onClick={() => handleUpdateVendorStatus(vendor.id, 'rejected')}
                            className="border border-red-200 hover:bg-red-50 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                          >
                            Reject
                          </button>
                          <button
                            disabled={actionLoading !== null}
                            onClick={() => handleUpdateVendorStatus(vendor.id, 'approved')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                          >
                            {actionLoading === vendor.id ? 'Updating...' : 'Approve Vendor'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50/50 border border-dashed border-gray-200 rounded-xl">
                    <p className="text-xs text-gray-400 font-medium">No vendor applications submitted yet.</p>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* REVENUE DISTRIBUTION PANEL */}
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
