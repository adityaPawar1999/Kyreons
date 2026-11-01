import { useEffect, useState } from 'react';
import { normalizeCart } from '../utils/cart.js';

const CART_KEY = 'kyreons-cart-v1';

export default function useStoredCart() {
  const [cart, setCart] = useState(() => {
    try {
      return normalizeCart(JSON.parse(localStorage.getItem(CART_KEY) || '[]'));
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(normalizeCart(cart)));
  }, [cart]);

  return [cart, setCart];
}
