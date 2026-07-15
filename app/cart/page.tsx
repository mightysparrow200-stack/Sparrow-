'use client';

import { useState } from 'react';
import Link from 'next/dynamic';
import dynamic from 'next/dynamic';
import { useCoOp } from '../CoOpState';

function CartPage() {
  const context = useCoOp();
  const [checkoutStatus, setCheckoutStatus] = useState<{ success?: boolean; message?: string }>({});

  if (!context) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-4 border-coopGreen border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-gray-500 font-medium">Loading your basket...</p>
      </div>
    );
  }

  const { isMember, memberBalance, cart, removeFromCart, checkout } = context;
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    const result = checkout();
    setCheckoutStatus(result);
    setTimeout(() => setCheckoutStatus({}), 5000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-serif text-slate-950 mb-2">Shopping Basket</h1>
      <p className="text-xs text-gray-400 mb-8">Review items added from the cooperative marketplace before completing payment.</p>

      {cart.length > 0 ? (
        <div className="space-y-6">
          {/* CART LIST */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm divide-y divide-gray-100">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                <div>
                  <h3 className="text-sm font-semibold text-slate-950">{item.name}</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Qty: <span className="font-bold text-slate-700">{item.quantity}</span> × ${item.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-extrabold text-slate-950">${(item.price * item.quantity).toFixed(2)}</span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-xs font-semibold text-red-500 hover:text-red-600 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* CHECKOUT SECTION */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Payment Type</span>
              <span className="font-semibold text-slate-900">
                {isMember ? 'Cooperative Savings Balance' : 'Visa / MasterCard'}
              </span>
            </div>

            {isMember && (
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Your Available Wallet</span>
                <span className="font-bold text-coopGreen">${memberBalance.toFixed(2)}</span>
              </div>
            )}

            <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-900">Grand Total</span>
              <span className="text-lg font-black text-slate-950">${cartTotal.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-coopGold text-slate-950 text-sm font-bold py-3 rounded-xl hover:bg-yellow-500 active:scale-95 transition mt-2 shadow-sm"
            >
              {isMember ? 'Authorize Co-op Wallet Payment' : 'Proceed to Gateway Payment'}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <span className="text-4xl block mb-3">🛒</span>
          <h2 className="text-sm font-bold text-slate-900">Your basket is empty</h2>
          <p className="text-xs text-gray-400 mt-1.5 mb-6">Looks like you haven't added anything to your cart yet.</p>
          <a
            href="/shop"
            className="inline-block bg-coopGreen text-white text-xs font-semibold px-5 py-2.5 rounded-xl hover:bg-coopGreen-dark transition shadow-sm"
          >
            Return to Marketplace
          </a>
        </div>
      )}

      {/* CHECKOUT RESPONSE */}
      {checkoutStatus.message && (
        <div className={`mt-6 p-4 rounded-xl border text-xs leading-relaxed ${
          checkoutStatus.success 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {checkoutStatus.message}
        </div>
      )}
    </div>
  );
}

export default dynamic(() => Promise.resolve(CartPage), { ssr: false });
