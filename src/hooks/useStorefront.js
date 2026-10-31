import { useEffect, useState } from 'react';
import useStoredCart from './useStoredCart.js';
import { products } from '../utils/store.js';

const THEME_KEY = 'kyreons-theme-v1';

function getRouteFromHash() {
  const hashRoute = location.hash.replace(/^#/, '');
  return hashRoute === 'story' ? 'home' : hashRoute || 'home';
}

export default function useStorefront() {
  const [cart, setCart] = useStoredCart();
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('kyreons-wishlist-v1') || '[]'); } catch { return []; }
  });
  const [dark, setDark] = useState(() => localStorage.getItem(THEME_KEY) === 'dark');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [route, setRoute] = useState(getRouteFromHash);
  const [toast, setToast] = useState('');
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  useEffect(() => { localStorage.setItem('kyreons-wishlist-v1', JSON.stringify(wishlist)); }, [wishlist]);
  const productRoute = route.startsWith('product/') ? route.split('/')[1] : null;
  const currentProduct = products.find((product) => product.id === productRoute);

  useEffect(() => {
    const syncRoute = () => setRoute(getRouteFromHash());
    window.addEventListener('hashchange', syncRoute);
    return () => window.removeEventListener('hashchange', syncRoute);
  }, []);

  useEffect(() => {
    // Keep the homepage shop link as a section jump; other routes start at the top.
    if (route === 'shop') return;
    window.scrollTo(0, 0);
  }, [route]);

  useEffect(() => {
    if (location.hash !== '#story' || route !== 'home') return;

    window.requestAnimationFrame(() => {
      document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' });
    });
  }, [route]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    document.querySelector('meta[name="theme-color"]').content = dark ? '#151613' : '#f7f6f2';
    localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    const showToast = (event) => {
      setToast(event.detail);
      window.setTimeout(() => setToast(''), 2400);
    };
    window.addEventListener('kyreons:toast', showToast);
    return () => window.removeEventListener('kyreons:toast', showToast);
  }, []);

  useEffect(() => {
    if (!drawerOpen) return undefined;
    const closeOnEscape = (event) => { if (event.key === 'Escape') setDrawerOpen(false); };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [drawerOpen]);

  const openProduct = (id) => { location.hash = `product/${id}`; };
  const toggleWishlist = (id) => setWishlist((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const navigateCategory = (category) => { location.hash = `category/${category}`; };
  const quickAdd = (product, size = null, color = null) => {
    const itemSize = size || product.sizes[1] || product.sizes[0];
    const itemColor = color || product.colors[0].name;
    const key = `${product.id}::${itemSize}::${itemColor}`;
    setCart((current) => {
      const existing = current.find((item) => item.key === key);
      return existing
        ? current.map((item) => item.key === key ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, { id: product.id, size: itemSize, color: itemColor, key, quantity: 1 }];
    });
    setToast('Item added to cart');
    window.setTimeout(() => setToast(''), 2400);
  };
  const addToBag = (product, size, color) => {
    quickAdd(product, size, color);
    setDrawerOpen(true);
  };
  const changeQuantity = (target, delta) => setCart((current) => current
    .map((item) => item.key === target.key ? { ...item, quantity: item.quantity + delta } : item)
    .filter((item) => item.quantity > 0));
  const changeSize = (target, size) => setCart((current) => {
    const source = current.find((item) => item.key === target.key);
    if (!source || source.size === size) return current;
    const key = `${source.id}::${size}::${source.color}`;
    const destination = current.find((item) => item.key === key);
    return current.flatMap((item) => {
      if (item.key === source.key) return destination ? [] : [{ ...item, size, key }];
      if (destination && item.key === key) return [{ ...item, quantity: item.quantity + source.quantity }];
      return [item];
    });
  });

  return {
    cart,
    wishlist,
    setCart,
    cartCount,
    dark,
    setDark,
    drawerOpen,
    setDrawerOpen,
    menuOpen,
    setMenuOpen,
    route,
    productRoute,
    currentProduct,
    toast,
    openProduct,
    toggleWishlist,
    navigateCategory,
    quickAdd,
    addToBag,
    changeQuantity,
    changeSize,
  };
}
