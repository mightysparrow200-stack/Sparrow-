export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image_url?: string;
}

export const getCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  const cart = localStorage.getItem('coop_cart');
  return cart ? JSON.parse(cart) : [];
};

export const addToCart = (product: { id: string; title: string; price: number; image_url?: string }) => {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  localStorage.setItem('coop_cart', JSON.stringify(cart));
  window.dispatchEvent(new Event('cart_updated'));
};

export const removeFromCart = (productId: string) => {
  const cart = getCart().filter((item) => item.id !== productId);
  localStorage.setItem('coop_cart', JSON.stringify(cart));
  window.dispatchEvent(new Event('cart_updated'));
};

export const clearCart = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('coop_cart');
    window.dispatchEvent(new Event('cart_updated'));
  }
};
