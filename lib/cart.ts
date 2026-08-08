export interface CartItem {
  id: string | number;
  title: string;
  price: number;
  quantity: number;
  image_url?: string;
  [key: string]: any;
}

export const getCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const cart = localStorage.getItem('coop_cart') || localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
};

const notifyCartUpdate = () => {
  if (typeof window === 'undefined') return;
  // Dispatch both events so all listeners across your app receive the update
  window.dispatchEvent(new Event('cartUpdated'));
  window.dispatchEvent(new Event('cart_updated'));
};

export const addToCart = (product: {
  id: string | number;
  title: string;
  price: number;
  image_url?: string;
  [key: string]: any;
}) => {
  if (typeof window === 'undefined') return;

  const cart = getCart();
  const existingIndex = cart.findIndex((item) => String(item.id) === String(product.id));

  if (existingIndex > -1) {
    cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  const payload = JSON.stringify(cart);
  localStorage.setItem('coop_cart', payload);
  localStorage.setItem('cart', payload); // Keep both in sync to prevent missing items

  notifyCartUpdate();
};

export const removeFromCart = (productId: string | number) => {
  if (typeof window === 'undefined') return;

  const cart = getCart().filter((item) => String(item.id) !== String(productId));
  const payload = JSON.stringify(cart);

  localStorage.setItem('coop_cart', payload);
  localStorage.setItem('cart', payload);

  notifyCartUpdate();
};

export const clearCart = () => {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('coop_cart');
  localStorage.removeItem('cart');

  notifyCartUpdate();
};
