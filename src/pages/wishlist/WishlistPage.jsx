import ProductGrid from '../../components/product/ProductGrid.jsx';
import { products } from '../../utils/store.js';

export default function WishlistPage({ wishlist, isSignedIn, authReady, onToggleWishlist, onOpen, onQuickAdd }) {
  const savedProducts = products.filter((product) => wishlist.includes(product.id));
  const emptyDescription = !authReady
    ? 'Checking your account…'
    : isSignedIn
      ? 'Keep the pieces that feel like you close by.'
      : 'Sign in to save the pieces you love and revisit them whenever you like.';

  return <section className="wishlist-page section-shell">
    <p className="eyebrow">YOUR KYREONS / SAVED PIECES</p>
    <div className="section-heading">
      <div>
        <h1>Your wishlist.</h1>
        <p>{savedProducts.length ? `${savedProducts.length} piece${savedProducts.length === 1 ? '' : 's'} saved for later.` : emptyDescription}</p>
      </div>
      <a className="text-link" href="#shirts">EXPLORE THE TEES <span>↗</span></a>
    </div>
    {savedProducts.length
      ? <ProductGrid products={savedProducts} wishlist={wishlist} onToggleWishlist={onToggleWishlist} onQuickAdd={onQuickAdd} onOpen={onOpen} />
      : <div className="wishlist-empty">
          <p>
            {!authReady
              ? 'Loading your saved pieces…'
              : isSignedIn
                ? 'Your saved pieces will show up here.'
                : <>To save your favorite pieces and revisit them later, <a className="contact-submit !ml-2 !inline-flex !min-h-0 !px-3 !py-1.5" href="#account/login">LOG IN <span>↗</span></a>.</>}
          </p>
          {!authReady
            ? null
            : isSignedIn
              ? <a className="contact-submit" href="#shirts">BROWSE THE COLLECTION <span>↗</span></a>
              : null}
        </div>}
  </section>;
}
