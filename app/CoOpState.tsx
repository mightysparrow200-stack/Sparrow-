'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  id: number;
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
  addToCart: (item: { id: number; name: string; price: number }) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  checkout: () => { success: boolean; message: string };
}

const CoOpContext = createContext<CoOpContextType | undefined>(undefined);

export function CoOpProvider({ children }: { children: React.ReactNode }) {
  const [isMember, setIsMember] = useState<boolean>(true);
  const [memberBalance, setMemberBalance] = useState<number>(150000.00); // ₦150,000 starting balance
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedBalance = localStorage.getItem('coop_balance');
    const savedIsMember = localStorage.getItem('coop_is_member');
    if (savedBalance) setMemberBalance(parseFloat(savedBalance));
    if (savedIsMember) setIsMember(savedIsMember === 'true');
  }, []);

  const updateBalance = (newBalance: number) => {
    setMemberBalance(newBalance);
    localStorage.setItem('coop_balance', newBalance.toString());
  };

  const updateMemberStatus = (status: boolean) => {
    setIsMember(status);
    localStorage.setItem('coop_is_member', status.toString());
  };

  const addToCart = (product: { id: number; name: string; price: number }) => {
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

  const removeFromCart = (id: number) => {
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
      checkout
    }}>
      {children}
    </CoOpContext.Provider>
  );
}

export function useCoOp() {
  const context = useContext(CoOpContext);
  return context;
}
