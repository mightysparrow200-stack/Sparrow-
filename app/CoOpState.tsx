'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './utils/supabase';

// Define the shape of our context state
interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image_url?: string;
}

interface CoOpContextType {
  user: any | null;
  profile: { full_name: string; email: string; role: string } | null;
  isMember: boolean;
  memberBalance: number;
  cart: CartItem[];
  addToCart: (product: { id: string; title: string; price: number; image_url?: string }) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  updateQuantity: (productId: string, quantity: number) => void;
  checkout: () => Promise<{ success: boolean; error?: string }>;
  loading: boolean;
  vendorProducts: any[];
  addVendorProduct: (product: any) => Promise<void>;
}

const CoOpContext = createContext<CoOpContextType | undefined>(undefined);

export function CoOpProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [memberBalance, setMemberBalance] = useState<number>(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [vendorProducts, setVendorProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Manage Authentication & User Sessions
  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Get active session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfileAndWallet(session.user.id);
      } else {
        setLoading(false);
      }
    }).catch(() => {
      setLoading(false);
    });

    // Listen to changes in auth state (login, logout, sign up)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchUserProfileAndWallet(currentUser.id);
      } else {
        setProfile(null);
        setMemberBalance(0);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 2. LIVE: Fetch real products from Supabase on load
  useEffect(() => {
    async function fetchLiveProducts() {
      try {
        if (!supabase) return;
        
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) setVendorProducts(data);
      } catch (err) {
        console.error('Error fetching live database products:', err);
      }
    }
    
    fetchLiveProducts();
  }, []);

  // 3. Fetch User Profile and Wallet Balance
  const fetchUserProfileAndWallet = async (userId: string) => {
    try {
      setLoading(true);

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, email, role')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch wallet balance
      const { data: walletData, error: walletError } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', userId)
        .single();

      if (walletError) throw walletError;
      setMemberBalance(walletData ? Number(walletData.balance) : 0);

    } catch (err) {
      console.error('Error fetching cooperative profile or wallet data:', err);
    } finally {
      setLoading(false);
    }
  };

  // 4. Cart State Actions
  const addToCart = (product: { id: string; title: string; price: number; image_url?: string }) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  // 5. LIVE ACTION: Add dynamic vendor products directly into your Supabase database table
  const addVendorProduct = async (product: any) => {
    try {
      if (!supabase) return;

      const payload = {
        name: product.name,
        category: product.category,
        price: Number(product.price),
        stock: Number(product.stock || 1),
        description: product.description || '',
        image: product.image || '📦',
        vendor_name: product.vendorName || 'Independent Vendor',
        is_vendor_product: true
      };

      const { data, error } = await supabase
        .from('products')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;

      // Update local state dynamically so the UI updates instantly without reloading
      if (data) {
        setVendorProducts((prev) => [data, ...prev]);
      }
    } catch (err) {
      console.error('Failed to save vendor product to live database:', err);
      alert('Error saving product. Please try again.');
    }
  };

  // 6. Checkout Logic (Deducts balance, registers order & items)
  const checkout = async () => {
    try {
      if (!user) throw new Error('Please log in to complete your checkout');
      
      const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

      // Verify funds
      if (memberBalance < cartTotal) {
        throw new Error('Insufficient co-op wallet balance. Please top up.');
      }

      const newBalance = memberBalance - cartTotal;

      // A. Deduct balance from Wallet
      const { error: walletError } = await supabase
        .from('wallets')
        .update({ balance: newBalance })
        .eq('user_id', user.id);

      if (walletError) throw walletError;

      // B. Create Order Record
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: cartTotal,
          status: 'completed'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // C. Populate Order Items breakdown
      const orderItems = cart.map((item) => ({
        order_id: orderData.id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_purchase: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // D. Update Local UI State
      setMemberBalance(newBalance);
      clearCart();

      return { success: true };

    } catch (err: any) {
      console.error('Checkout transaction failed:', err);
      return { success: false, error: err.message || 'An unknown error occurred' };
    }
  };

  // Check if profile role is recognized as an active member or vendor
  const isMember = profile?.role === 'member' || profile?.role === 'vendor';

  return (
    <CoOpContext.Provider
      value={{
        user,
        profile,
        isMember,
        memberBalance,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        checkout,
        loading,
        vendorProducts,
        addVendorProduct,
      }}
    >
      {children}
    </CoOpContext.Provider>
  );
}

export function useCoOp() {
  const context = useContext(CoOpContext);
  if (context === undefined) {
    throw new Error('useCoOp must be used within a CoOpProvider');
  }
  return context;
            }
