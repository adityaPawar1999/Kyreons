import { useEffect, useState } from 'react';

const CART_KEY = 'kyreons-cart-v1';

export default function useStoredCart() {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  return [cart, setCart];
}
