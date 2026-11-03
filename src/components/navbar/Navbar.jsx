import { useEffect, useRef, useState } from 'react';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from '../buttons/IconButton.jsx';
import BrandLogo from '../layout/BrandLogo.jsx';
import ProductSearchInput from '../product/ProductSearchInput.jsx';

export default function Navbar({ dark, onTheme, onCart, onCategory, onWishlist, onLogout, isSignedIn, firstName, wishlistCount, cartCount, menuOpen, setMenuOpen, route, searchQuery, onSearchQueryChange, onSearchFocus }) {
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);
  const closeMenu = () => setMenuOpen(false);
  useEffect(() => {
    if (!accountMenuOpen) return undefined;
    const closeOnOutsideClick = (event) => {
      if (!accountMenuRef.current?.contains(event.target)) setAccountMenuOpen(false);
    };
    const closeOnEscape = (event) => { if (event.key === 'Escape') setAccountMenuOpen(false); };
    document.addEventListener('pointerdown', closeOnOutsideClick);
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [accountMenuOpen]);
  const navItems = [
    { label: 'HOME', href: '#home', active: ['home', 'shop', ''].includes(route) },
    { label: 'SHOP ALL', href: '#shop-all', active: route === 'shop-all' },
    { label: 'T-SHIRTS', href: '#shirts', active: route === 'shirts' },
    { label: 'OVERSIZED', href: '#category/oversized', active: route === 'category/oversized', category: 'oversized' },
    { label: 'HANDCRAFTED', href: '#category/handcrafted', active: route === 'category/handcrafted', category: 'handcrafted' },
  ];

  return <>
    <div className="announcement-bar"><span>WORLDWIDE SHIPPING AVAILABLE</span><AutoAwesomeIcon className="announcement-star" aria-hidden="true" /><span>MADE FOR THE IN-BETWEEN</span></div>
    <header className="site-header"><div className="nav-inner">
      <IconButton className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen}>{menuOpen ? <CloseIcon /> : <MenuIcon />}</IconButton>
      <BrandLogo onClick={closeMenu} />
      <nav className={`absolute left-0 right-0 top-[105px] z-40 grid origin-top gap-1 border-b border-neutral-200 bg-paper/95 px-5 pb-5 pt-3 shadow-xl backdrop-blur-xl dark:border-neutral-700 md:static md:col-start-2 md:row-start-1 md:flex md:items-center md:justify-center md:gap-5 md:border-0 md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-none lg:gap-7 ${menuOpen ? 'grid' : 'hidden md:flex'}`} aria-label="Main navigation">
        {navItems.map((item) => (
          <a
            key={item.label}
            className={`border-b border-neutral-200 py-3 text-[9px] font-semibold tracking-[.12em] transition-colors md:border-b-2 md:py-1.5 dark:border-neutral-700 md:dark:border-transparent ${item.active ? 'text-neutral-900 dark:text-white md:border-neutral-900 md:dark:border-white' : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white md:border-transparent'}`}
            href={item.href}
            aria-current={item.active ? 'page' : undefined}
            onClick={(event) => {
              closeMenu();
              if (item.category) {
                event.preventDefault();
                onCategory(item.category);
              }
            }}
          >
            {item.label}
          </a>
        ))}
        <button className="flex items-center gap-3 border-t border-neutral-200 py-3 text-left text-[9px] font-semibold tracking-[.1em] text-neutral-800 dark:border-neutral-700 dark:text-neutral-200 md:hidden" type="button" onClick={() => { onTheme(); closeMenu(); }}>
          {dark ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
          <span>{dark ? 'LIGHT THEME' : 'DARK THEME'}</span>
        </button>
      </nav>
      <div className="nav-actions"><ProductSearchInput className="navbar-search" value={searchQuery} onChange={onSearchQueryChange} onFocus={onSearchFocus} /><IconButton className="desktop-theme-toggle" onClick={onTheme} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}>{dark ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}</IconButton><IconButton className={`wishlist-trigger relative ${wishlistCount ? 'text-rose-600' : ''}`} onClick={onWishlist} aria-label={`View liked products, ${wishlistCount} saved`}><FavoriteBorderIcon /><span className={`absolute -right-1 -top-px grid h-[15px] min-w-[15px] place-content-center rounded-full bg-rose-600 px-[3px] text-[9px] font-bold text-white ${wishlistCount ? '' : 'hidden'}`}>{wishlistCount > 99 ? '99+' : wishlistCount}</span></IconButton><IconButton className="cart-trigger" onClick={onCart} aria-label={`Open shopping bag, ${cartCount} items`}><ShoppingBagOutlinedIcon /><span className="cart-count">{cartCount > 99 ? '99+' : cartCount}</span></IconButton><div className="relative" ref={accountMenuRef}>
        <IconButton className="profile-trigger" onClick={() => { closeMenu(); if (isSignedIn) setAccountMenuOpen((open) => !open); else location.hash = 'account/login'; }} aria-label={isSignedIn ? 'Open account menu' : 'Log in'} aria-expanded={isSignedIn ? accountMenuOpen : undefined} aria-haspopup={isSignedIn ? 'menu' : undefined}><PersonOutlinedIcon /></IconButton>
        {isSignedIn && accountMenuOpen && <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-48 border border-neutral-300 bg-[var(--bg)] py-1 shadow-xl dark:border-neutral-700" role="menu" aria-label="Account options">
          <a className="block px-4 py-3 text-[9px] font-semibold tracking-[.12em] text-neutral-800 transition-colors hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-800" href="#account/profile" role="menuitem" onClick={() => setAccountMenuOpen(false)}>VIEW PROFILE</a>
          <button className="flex w-full items-center gap-2 border-t border-neutral-200 px-4 py-3 text-left text-[9px] font-semibold tracking-[.12em] text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white" type="button" role="menuitem" onClick={() => { setAccountMenuOpen(false); onLogout(); }}><LogoutIcon fontSize="small" /> LOG OUT</button>
        </div>}
      </div></div>
    </div></header>
  </>;
}
