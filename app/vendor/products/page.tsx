'use client';

import { useState } from 'react';

export interface Product {
  id: string | number;
  title: string;
  category: string;
  price: number;
  description: string;
  image_url: string;
  vendor_name?: string;
  vendor_rating?: number;
}

interface ProductGridProps {
  products: Product[];
}

export default function ProductGridWithModal({ products }: ProductGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <section>
      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => setSelectedProduct(product)}
            className="group bg-white border border-slate-100 rounded-2xl p-3 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Product Image */}
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-50 mb-2.5">
                {product.image_url?.startsWith('http') ? (
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">
                    {product.image_url || '📦'}
                  </div>
                )}
              </div>

              {/* Title & Category */}
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                {product.category}
              </span>
              <h3 className="text-xs font-bold text-slate-800 line-clamp-2 mb-2 group-hover:text-emerald-700 transition">
                {product.title}
              </h3>
            </div>

            <div>
              {/* Vendor Rating Badge */}
              <div className="flex items-center gap-1 mb-2 text-[11px] font-semibold text-slate-600">
                <span className="text-amber-400">★</span>
                <span>{product.vendor_rating || 4.8}</span>
                <span className="text-slate-400 text-[10px]">
                  ({product.vendor_name || 'Vendor'})
                </span>
              </div>

              {/* Price Tag */}
              <div className="flex items-center justify-between border-t border-slate-50 pt-2">
                <span className="text-sm font-extrabold text-slate-900">
                  ₦{product.price.toLocaleString()}
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  View
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Expanded Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div 
            className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col md:flex-row max-h-[90vh] animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Area */}
            <div className="md:w-1/2 bg-slate-50 relative min-h-[240px] md:min-h-full flex items-center justify-center">
              {selectedProduct.image_url?.startsWith('http') ? (
                <img
                  src={selectedProduct.image_url}
                  alt={selectedProduct.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-6xl">{selectedProduct.image_url || '📦'}</span>
              )}
              
              <button
                onClick={() => setSelectedProduct(null)}
                aria-label="Close product preview"
                className="md:hidden absolute top-3 right-3 bg-slate-900/70 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
              <div>
                {/* Header Actions */}
                <div className="hidden md:flex justify-between items-center mb-4">
                  <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full">
                    {selectedProduct.category}
                  </span>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    aria-label="Close dialog"
                    className="text-slate-400 hover:text-slate-700 text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-100 transition"
                  >
                    ✕
                  </button>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-slate-900 leading-tight mb-2">
                  {selectedProduct.title}
                </h2>

                {/* Vendor & Rating Box */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-400">Listed By</p>
                    <p className="text-xs font-bold text-slate-800">
                      {selectedProduct.vendor_name || 'CoOp Partner Vendor'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-900">
                      <span className="text-amber-400 text-sm">★</span>
                      <span>{selectedProduct.vendor_rating || 4.8} / 5.0</span>
                    </div>
                    <p className="text-[9px] text-emerald-600 font-semibold">Verified Vendor</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Price</p>
                  <p className="text-2xl font-black text-slate-900">
                    ₦{selectedProduct.price.toLocaleString()}
                  </p>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Description</p>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                    {selectedProduct.description || 'No detailed description provided for this product.'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="flex-1 py-3 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
                >
                  Order Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
