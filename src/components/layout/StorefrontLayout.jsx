import CartDrawer from '../cart/CartDrawer.jsx';
import SiteFooter from './SiteFooter.jsx';
import Navbar from '../navbar/Navbar.jsx';
import HomePage from '../../pages/home/HomePage.jsx';
import ProductPage from '../../pages/product/ProductPage.jsx';
import ShirtsPage from '../../pages/collections/ShirtsPage.jsx';
import CollectionPage from '../../pages/collections/CollectionPage.jsx';
import ContactPage from '../../pages/contact/ContactPage.jsx';
import WishlistPage from '../../pages/wishlist/WishlistPage.jsx';
import NotFoundPage from '../../pages/not-found/NotFoundPage.jsx';
import OurStory from '../../pages/our-story/OurStory.jsx';

export default function StorefrontLayout({ store }) {
  const { cart, setCart, cartCount, dark, setDark, drawerOpen, setDrawerOpen, menuOpen, setMenuOpen, route, productRoute, currentProduct, toast, openProduct, navigateCategory, quickAdd, addToBag, changeQuantity, changeSize, wishlist, toggleWishlist } = store;

  return <div className="storefront">
    <Navbar dark={dark} onTheme={() => setDark((value) => !value)} onCart={() => setDrawerOpen(true)} onWishlist={() => { location.hash = 'wishlist'; setMenuOpen(false); }} onCategory={navigateCategory} wishlistCount={wishlist.length} cartCount={cartCount} menuOpen={menuOpen} setMenuOpen={setMenuOpen} route={route} />
    <main>{currentProduct
      ? <ProductPage key={currentProduct.id} product={currentProduct} onQuickAdd={quickAdd} onOpen={openProduct} onBag={addToBag} wishlist={wishlist} onToggleWishlist={toggleWishlist} />
      : productRoute
        ? <NotFoundPage />
        : route === 'contact'
          ? <ContactPage />
          : route === 'our-story'
            ? <OurStory />
          : route === 'wishlist'
            ? <WishlistPage wishlist={wishlist} onToggleWishlist={toggleWishlist} onOpen={openProduct} onQuickAdd={quickAdd} />
            : route === 'shirts'
              ? <ShirtsPage onOpen={openProduct} onQuickAdd={quickAdd} wishlist={wishlist} onToggleWishlist={toggleWishlist} />
            : route.startsWith('category/')
              ? <CollectionPage
                  key={route}
                  type={route.split('/')[1]}
                  onOpen={openProduct}
                  onQuickAdd={quickAdd}
                  wishlist={wishlist}
                  onToggleWishlist={toggleWishlist}
                />
              : ['home', 'shop', ''].includes(route)
                ? <HomePage onOpen={openProduct} onQuickAdd={quickAdd} wishlist={wishlist} onToggleWishlist={toggleWishlist} />
                : <NotFoundPage />}</main>
    <SiteFooter />
    <CartDrawer open={drawerOpen} cart={cart} onClose={() => setDrawerOpen(false)} onChangeQuantity={changeQuantity} onChangeSize={changeSize} onRemove={(key) => setCart((current) => current.filter((item) => item.key !== key))} />
    {toast && <div className="toast visible" role="status" aria-live="polite">{toast}</div>}
  </div>;
}
