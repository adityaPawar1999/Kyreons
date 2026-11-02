import { useEffect, useState } from 'react';
import useStoredCart from './useStoredCart.js';
import { products } from '../utils/store.js';
import { normalizeCart } from '../utils/cart.js';
import { getCustomerCart, getCustomerProfile, getCustomerWishlist, getSignedInAccount, saveCustomerCart, toggleCustomerWishlist, watchAuthUser } from '../services/firebase.js';

const THEME_KEY = 'kyreons-theme-v1';

function getRouteFromHash() {
  const hashRoute = location.hash.replace(/^#/, '');
  return hashRoute === 'story' ? 'home' : hashRoute || 'home';
}

export default function useStorefront() {
  const [cart, setCart] = useStoredCart();
  const [wishlist, setWishlist] = useState([]);
  const [accountUser, setAccountUser] = useState(null);
  const [accountFirstName, setAccountFirstName] = useState('');
  const [authReady, setAuthReady] = useState(false);
  const [cartReadyFor, setCartReadyFor] = useState(null);
  const [dark, setDark] = useState(() => localStorage.getItem(THEME_KEY) === 'dark');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [route, setRoute] = useState(getRouteFromHash);
  const [toast, setToast] = useState('');
  const isSignedIn = authReady && Boolean(accountUser && !accountUser.isAnonymous);
  const cartCount = isSignedIn ? cart.reduce((sum, item) => sum + item.quantity, 0) : 0;
  const productRoute = route.startsWith('product/') ? route.split('/')[1] : null;
  const currentProduct = products.find((product) => product.id === productRoute);

  useEffect(() => {
    let active = true;
    try {
      const unsubscribe = watchAuthUser((user) => {
        if (active) {
          setAccountUser(user);
          setAuthReady(true);
        }
      });
      return () => { active = false; unsubscribe(); };
    } catch {
      setAuthReady(true);
      setAccountUser(null);
      setWishlist([]);
      return () => { active = false; };
    }
  }, []);

  useEffect(() => {
    if (!authReady || !accountUser || accountUser.isAnonymous) {
      setAccountFirstName('');
      return undefined;
    }
    let active = true;
    const displayName = accountUser.displayName?.trim().split(/\s+/)[0] || '';
    setAccountFirstName(displayName);
    getCustomerProfile(accountUser.uid, accountUser.email)
      .then((profile) => {
        if (active) setAccountFirstName(profile?.firstName?.trim() || profile?.name?.trim().split(/\s+/)[0] || displayName);
      })
      .catch(() => {});
    return () => { active = false; };
  }, [accountUser, authReady]);

  // The browser cart is a shared local cache. Drop it whenever auth resolves
  // or changes so one account's items cannot carry into another account.
  useEffect(() => {
    if (authReady) setCart([]);
  }, [accountUser?.uid, authReady, setCart]);

  useEffect(() => {
    if (!authReady) return undefined;
    if (!accountUser || accountUser.isAnonymous) {
      setCartReadyFor(null);
      return undefined;
    }
    let active = true;
    setCartReadyFor(null);
    getCustomerCart(accountUser.uid, accountUser.email)
      .then((savedCart) => {
        if (!active) return;
        if (savedCart) setCart(normalizeCart(savedCart));
        setCartReadyFor(accountUser.uid);
      })
      .catch((error) => {
        if (active) {
          console.error('Could not load customer cart:', error);
          setCartReadyFor(accountUser.uid);
        }
      });
    return () => { active = false; };
  }, [accountUser, authReady, setCart]);

  useEffect(() => {
    if (!accountUser || accountUser.isAnonymous || cartReadyFor !== accountUser.uid) return undefined;
    let active = true;
    saveCustomerCart(accountUser.uid, accountUser.email, cart).catch((error) => {
      if (active) console.error('Could not save customer cart:', error);
    });
    return () => { active = false; };
  }, [accountUser, cart, cartReadyFor]);

  useEffect(() => {
    if (!authReady) return undefined;
    if (!accountUser || accountUser.isAnonymous) {
      setWishlist([]);
      return undefined;
    }
    let active = true;
    getCustomerWishlist(accountUser.uid, accountUser.email)
      .then((savedIds) => { if (active) setWishlist(savedIds); })
      .catch((error) => {
        if (active) {
          console.error('Could not load saved products:', error);
          setWishlist([]);
        }
      });
    return () => { active = false; };
  }, [accountUser, authReady]);

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
  const toggleWishlist = async (id) => {
    try {
      const account = await getSignedInAccount();
      if (!account) {
        setToast('Log in or sign up to save products');
        location.hash = 'account/login';
        return;
      }
      const nextWishlist = await toggleCustomerWishlist(account.uid, account.email, id);
      setWishlist(nextWishlist);
      setToast(nextWishlist.includes(id) ? 'Added to your saved products' : 'Removed from your saved products');
      window.setTimeout(() => setToast(''), 2400);
    } catch (error) {
      console.error('Could not update saved products:', error);
      setToast(error?.code === 'permission-denied'
        ? 'Wishlist access denied. Publish the customerWishlists Firestore rule.'
        : 'Could not update your saved products. Please try again.');
      window.setTimeout(() => setToast(''), 2400);
    }
  };
  const navigateCategory = (category) => { location.hash = `category/${category}`; };
  const quickAdd = (product, size = null, color = null) => {
    if (!isSignedIn) {
      setDrawerOpen(true);
      return;
    }
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
    accountUser,
    accountFirstName,
    isSignedIn,
    authReady,
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
