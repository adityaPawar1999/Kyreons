import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import MenuIcon from '@mui/icons-material/Menu';
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
      <IconButton className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation"><MenuIcon /></IconButton>
      <BrandLogo onClick={closeMenu} />
      <nav className={`main-nav${menuOpen ? ' open' : ''}`} aria-label="Main navigation">
        {navItems.map((item) => (
          <a
            key={item.label}
            className={`border-b-2 py-1.5 transition-colors ${item.active ? 'border-neutral-900 dark:border-white' : 'border-transparent'}`}
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
        <button className="mobile-theme-toggle" type="button" onClick={() => { onTheme(); closeMenu(); }}>
          {dark ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
          <span>{dark ? 'LIGHT THEME' : 'DARK THEME'}</span>
        </button>
      </nav>
      <div className="nav-actions"><ProductSearchInput className="navbar-search" value={searchQuery} onChange={onSearchQueryChange} onFocus={onSearchFocus} /><IconButton className="desktop-theme-toggle" onClick={onTheme} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}>{dark ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}</IconButton><IconButton className={`wishlist-trigger relative ${wishlistCount ? 'text-rose-600' : ''}`} onClick={onWishlist} aria-label={`View liked products, ${wishlistCount} saved`}><FavoriteBorderIcon /><span className={`absolute -right-1 -top-px grid h-[15px] min-w-[15px] place-content-center rounded-full bg-rose-600 px-[3px] text-[9px] font-bold text-white ${wishlistCount ? '' : 'hidden'}`}>{wishlistCount > 99 ? '99+' : wishlistCount}</span></IconButton><IconButton className="cart-trigger" onClick={onCart} aria-label={`Open shopping bag, ${cartCount} items`}><ShoppingBagOutlinedIcon /><span className="cart-count">{cartCount > 99 ? '99+' : cartCount}</span></IconButton></div>
    </div></header>
  </>;
}
