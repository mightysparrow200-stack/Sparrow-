'use client';

import dynamic from 'next/dynamic';
import { useCoOp } from '../CoOpState';

const PRODUCTS = [
  { id: 1, name: 'Co-Op Tech Smart Backpack', category: 'Gear', price: 35000.00, desc: 'Water-resistant, anti-theft design with a built-in USB charging port.', img: '🎒' },
  { id: 2, name: 'Eco-Insulated Steel Flask', category: 'Lifestyle', price: 12500.00, desc: 'Double-walled vacuum insulation. Keeps drinks cold for 24h or hot for 12h.', img: '🥤' },
  { id: 3, name: 'Alumni Edition Mechanical Keyboard', category: 'Tech', price: 65000.00, desc: 'Tactile blue switches, custom alumni-themed keycaps, and RGB backlighting.', img: '⌨️' },
  { id: 4, name: 'Sparrow Dark Roast Coffee Beans', category: 'Consumables', price: 8500.00, desc: 'Direct-trade premium whole beans. Roasted locally and certified organic.', img: '☕' },
];

function ShopPage() {
  const context = useCoOp();

  if (!context) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-4 border-coopGreen border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-gray-500 font-medium">Loading Marketplace...</p>
      </div>
    );
  }

  const { isMember, setIsMember, memberBalance, addToCart } = context;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      
      {/* SHOP HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-slate-950">Cooperative Marketplace</h1>
          <p className="text-sm text-gray-500 mt-1">
            Browse our catalog of general goods and premium products. Unlock co-op discounts on every item.
          </p>
        </div>

        {/* MEMBER / GUEST TOGGLE */}
        <div className="bg-white border border-gray-200 p-1.5 rounded-xl flex items-center gap-1 shadow-sm w-fit">
          <button
            onClick={() => setIsMember(true)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
              isMember ? 'bg-coopGreen text-white shadow-sm' : 'text-gray-500 hover:text-slate-900'
            }`}
          >
            Alumni Member
          </button>
          <button
            onClick={() => setIsMember(false)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
              !isMember ? 'bg-slate-900 text-white shadow-sm' : 'text-gray-500 hover:text-slate-900'
            }`}
          >
            Guest (Retail)
          </button>
        </div>
      </div>

      {/* PRICING NOTIFICATION */}
      <div className={`p-3.5 rounded-xl border mb-8 text-xs flex items-center justify-between ${
        isMember 
          ? 'bg-green-50/50 border-green-150 text-green-800' 
          : 'bg-amber-50/50 border-amber-150 text-amber-800'
      }`}>
        <div className="flex items-center gap-2">
          <span>{isMember ? '✨' : '🛍️'}</span>
          <span>
            {isMember 
              ? 'Active Member status detected! A 15% discount has been applied to all general goods.' 
              : 'Browsing as Guest. Register as an alumni member to unlock 15% co-op discounts.'}
          </span>
        </div>
        {isMember && (
          <span className="font-bold whitespace-nowrap bg-green-100 text-green-900 px-2 py-1 rounded-md">
            Balance: ₦{memberBalance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
          </span>
        )}
      </div>

      {/* CLEAN PRODUCT CATALOG GRID */}
      <div>
        <h2 className="font-serif text-lg text-slate-950 font-semibold mb-6">Featured Goods</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {PRODUCTS.map((product) => {
            const displayPrice = isMember ? product.price * 0.85 : product.price;
            return (
              <div key={product.id} className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between hover:border-gray-300 hover:shadow-md transition">
                <div>
                  <div className="text-3xl mb-3">{product.img}</div>
                  <span className="text-[10px] font-bold text-coopGold uppercase tracking-wider">{product.category}</span>
                  <h3 className="font-serif text-sm text-slate-950 font-bold mt-1 line-clamp-1">{product.name}</h3>
                  <p className="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-2">{product.desc}</p>
                </div>
                
                <div className="flex items-center justify-between mt-5 pt-3 border-t border-gray-100">
                  <div>
                    {isMember && (
                      <span className="text-[10px] text-gray-400 line-through block">₦{product.price.toLocaleString('en-NG')}</span>
                    )}
                    <span className="text-base font-extrabold text-slate-900">₦{displayPrice.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-coopGreen text-white text-xs font-semibold px-3 py-1.5 rounded-xl hover:bg-coopGreen-dark active:scale-95 transition shadow-sm"
                  >
                    Add +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

export default dynamic(() => Promise.resolve(ShopPage), { ssr: false });
