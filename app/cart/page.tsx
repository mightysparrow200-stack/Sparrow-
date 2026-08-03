'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getCart, removeFromCart, clearCart, CartItem } from '@/lib/cart';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'card'>('wallet');
  const [walletBalance, setWalletBalance] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function initCart() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('address, wallet_balance')
          .eq('id', user.id)
          .single();

        if (profile) {
          setDeliveryAddress(profile.address || '');
          setWalletBalance(profile.wallet_balance || 0);
        }

        setCart(getCart());
      } catch (err) {
        console.error('Cart error:', err);
      } finally {
        setLoading(false);
      }
    }

    initCart();
  }, [router]);

  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setSubmitting(true);
    setErrorMsg('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated.');

      if (paymentMethod === 'wallet' && walletBalance < totalAmount) {
        throw new Error('Insufficient Co-Op Wallet balance.');
      }

      const orderCode = `MSC-${Math.floor(1000 + Math.random() * 9000)}`;

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_code: orderCode,
          user_id: user.id,
          total_amount: totalAmount,
          status: 'In Transit',
          delivery_address: deliveryAddress,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItemsPayload = cart.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        product_title: item.title,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItemsPayload);
      if (itemsError) throw itemsError;

      if (paymentMethod === 'wallet') {
        await supabase
          .from('profiles')
          .update({ wallet_balance: walletBalance - totalAmount })
          .eq('id', user.id);
      }

      clearCart();
      router.push('/orders');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to place order.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-500">Preparing Cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-sans">
      <div className="mb-8">
        <Link href="/shop" className="text-xs text-emerald-600 font-bold hover:underline mb-2 inline-block">
          ← Back to Shop
        </Link>
        <h1 className="text-2xl font-black text-slate-900">Your Cart</h1>
      </div>

      {cart.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
          <p className="text-sm font-bold text-slate-700 mb-4">Your cart is currently empty.</p>
          <Link
            href="/shop"
            className="px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm inline-block"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-black text-slate-900 mb-4">Items</h2>
              <div className="divide-y divide-slate-100">
                {cart.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-800">{item.title}</h3>
                      <p className="text-[10px] text-slate-400">
                        Qty: {item.quantity} × ₦{item.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-black text-slate-900">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </span>
                      <button
                        onClick={() => {
                          removeFromCart(item.id);
                          setCart(getCart());
                        }}
                        className="text-[10px] text-rose-500 font-bold hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-black text-slate-900 mb-4">Checkout Details</h2>
              {errorMsg && (
                <div className="mb-4 p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Delivery Address
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Enter full delivery address..."
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('wallet')}
                      className={`p-3 rounded-xl border text-left text-xs font-bold transition ${
                        paymentMethod === 'wallet'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      💳 Co-Op Wallet
                      <span className="block text-[10px] font-normal text-slate-500 mt-1">
                        Bal: ₦{walletBalance.toLocaleString()}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-xl border text-left text-xs font-bold transition ${
                        paymentMethod === 'card'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      🌐 Card / Transfer
                      <span className="block text-[10px] font-normal text-slate-500 mt-1">Paystack / Flutterwave</span>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition disabled:opacity-50 mt-4"
                >
                  {submitting ? 'Processing Order...' : `Confirm Order (₦${totalAmount.toLocaleString()})`}
                </button>
              </form>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Order Summary</h3>
              <div className="flex justify-between items-center text-slate-600 text-xs mb-2">
                <span>Subtotal</span>
                <span>₦{totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 text-xs mb-4">
                <span>Delivery</span>
                <span className="text-emerald-600 font-bold">FREE</span>
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-slate-900 font-black">
                <span>Total</span>
                <span className="text-base text-emerald-700">₦{totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
