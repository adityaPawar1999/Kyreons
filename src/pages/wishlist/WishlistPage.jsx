import ProductGrid from '../../components/product/ProductGrid.jsx';
import { products } from '../../utils/store.js';

export default function WishlistPage({ wishlist, onToggleWishlist, onOpen, onQuickAdd }) {
  const savedProducts = products.filter((product) => wishlist.includes(product.id));
  return <section className="wishlist-page section-shell"><p className="eyebrow">YOUR KYREONS / SAVED PIECES</p><div className="section-heading"><div><h1>Your wishlist.</h1><p>{savedProducts.length ? `${savedProducts.length} piece${savedProducts.length === 1 ? '' : 's'} saved for later.` : 'Keep the pieces that feel like you close by.'}</p></div><a className="text-link" href="#shirts">EXPLORE THE TEES <span>↗</span></a></div>{savedProducts.length ? <ProductGrid products={savedProducts} wishlist={wishlist} onToggleWishlist={onToggleWishlist} onQuickAdd={onQuickAdd} onOpen={onOpen} /> : <div className="wishlist-empty"><p>Your saved pieces will show up here.</p><a className="contact-submit" href="#shirts">BROWSE THE COLLECTION <span>↗</span></a></div>}</section>;
}
