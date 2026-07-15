'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CustomProduct {
  id: string | number;
  name: string;
  category: string;
  price: number;
  desc: string;
  img: string;
}

interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
}

interface CoOpContextType {
  isMember: boolean;
  setIsMember: (val: boolean) => void;
  memberBalance: number;
  setMemberBalance: (val: number) => void;
  cart: CartItem[];
  addToCart: (item: { id: string | number; name: string; price: number }) => void;
  removeFromCart: (id: string | number) => void;
  clearCart: () => void;
  checkout: () => { success: boolean; message: string };
  // New vendor states
  vendorProducts: CustomProduct[];
  addVendorProduct: (product: Omit<CustomProduct, 'id'>) => void;
}

const CoOpContext = createContext<CoOpContextType | undefined>(undefined);

export function CoOpProvider({ children }: { children: React.ReactNode }) {
  const [isMember, setIsMember] = useState<boolean>(true);
  const [memberBalance, setMemberBalance] = useState<number>(150000.00); // ₦150,000 starting balance
  const [cart, setCart] = useState<CartItem[]>([]);
  const [vendorProducts, setVendorProducts] = useState<CustomProduct[]>([]);

  // Hydrate states from localStorage on client-side mount
  useEffect(() => {
    const savedBalance = localStorage.getItem('coop_balance');
    const savedIsMember = localStorage.getItem('coop_is_member');
    const savedProducts = localStorage.getItem('coop_vendor_products');
    
    if (savedBalance) setMemberBalance(parseFloat(savedBalance));
    if (savedIsMember) setIsMember(savedIsMember === 'true');
    if (savedProducts) {
      try {
        setVendorProducts(JSON.parse(savedProducts));
      } catch (e) {
        console.error("Failed parsing cached vendor products", e);
      }
    }
  }, []);

  const updateBalance = (newBalance: number) => {
    setMemberBalance(newBalance);
    localStorage.setItem('coop_balance', newBalance.toString());
  };

  const updateMemberStatus = (status: boolean) => {
    setIsMember(status);
    localStorage.setItem('coop_is_member', status.toString());
  };

  // Safe wrapper to update state and preserve uploaded products across page reloads
  const addVendorProduct = (newProduct: Omit<CustomProduct, 'id'>) => {
    const productWithId: CustomProduct = {
      ...newProduct,
      id: `vendor-${Date.now()}` // Generates a safe, unique string ID
    };
    
    setVendorProducts(prev => {
      const updatedList = [productWithId, ...prev];
      localStorage.setItem('coop_vendor_products', JSON.stringify(updatedList));
      return updatedList;
    });
  };

  const addToCart = (product: { id: string | number; name: string; price: number }) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      const price = isMember ? product.price * 0.85 : product.price;
      
      if (existing) {
        return prevCart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { id: product.id, name: product.name, price, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string | number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const checkout = () => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    if (isMember) {
      if (memberBalance >= total) {
        updateBalance(memberBalance - total);
        clearCart();
        return { success: true, message: `Successfully checked out! Paid ₦${total.toLocaleString('en-NG', { minimumFractionDigits: 2 })} using your Co-op Savings.` };
      } else {
        return { success: false, message: 'Insufficient funds in your cooperative wallet.' };
      }
    } else {
      clearCart();
      return { success: true, message: `Order placed successfully! Redirecting to standard bank transfer gateway for ₦${total.toLocaleString('en-NG', { minimumFractionDigits: 2 })}.` };
    }
  };

  return (
    <CoOpContext.Provider value={{
      isMember,
      setIsMember: updateMemberStatus,
      memberBalance,
      setMemberBalance: updateBalance,
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      checkout,
      vendorProducts,
      addVendorProduct
    }}>
      {children}
    </CoOpContext.Provider>
  );
}

export function useCoOp() {
  const context = useContext(CoOpContext);
  return context;
}
