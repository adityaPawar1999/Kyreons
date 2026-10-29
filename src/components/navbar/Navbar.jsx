import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '../buttons/IconButton.jsx';
import BrandLogo from '../layout/BrandLogo.jsx';
import ProductSearchInput from '../product/ProductSearchInput.jsx';

export default function Navbar({ dark, onTheme, onCart, onCategory, onWishlist, wishlistCount, cartCount, menuOpen, setMenuOpen, route, searchQuery, onSearchQueryChange, onSearchFocus }) {
  const closeMenu = () => setMenuOpen(false);
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
      <nav className={`absolute left-0 right-0 top-[105px] z-40 grid origin-top gap-1 border-b border-neutral-200 bg-paper/95 px-5 pb-5 pt-3 shadow-xl backdrop-blur-xl dark:border-neutral-700 dark:bg-neutral-900/95 md:static md:col-start-2 md:row-start-1 md:flex md:items-center md:justify-center md:gap-5 md:border-0 md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-none lg:gap-7 ${menuOpen ? 'grid' : 'hidden md:flex'}`} aria-label="Main navigation">
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
      <div className="nav-actions"><ProductSearchInput className="navbar-search" value={searchQuery} onChange={onSearchQueryChange} onFocus={onSearchFocus} /><IconButton className="desktop-theme-toggle" onClick={onTheme} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}>{dark ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}</IconButton><IconButton className={`wishlist-trigger relative ${wishlistCount ? 'text-rose-600' : ''}`} onClick={onWishlist} aria-label={`View liked products, ${wishlistCount} saved`}><FavoriteBorderIcon /><span className={`absolute -right-1 -top-px grid h-[15px] min-w-[15px] place-content-center rounded-full bg-rose-600 px-[3px] text-[9px] font-bold text-white ${wishlistCount ? '' : 'hidden'}`}>{wishlistCount > 99 ? '99+' : wishlistCount}</span></IconButton><IconButton className="cart-trigger" onClick={onCart} aria-label={`Open shopping bag, ${cartCount} items`}><ShoppingBagOutlinedIcon /><span className="cart-count">{cartCount > 99 ? '99+' : cartCount}</span></IconButton></div>
    </div></header>
  </>;
}
