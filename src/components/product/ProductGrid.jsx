import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { formatMoney } from '../../utils/store.js';
import ActionButton from '../buttons/ActionButton.jsx';
import ProductCard from './ProductCard.jsx';

export default function ProductGrid({ products, onQuickAdd, onOpen, className = '', featured = false, wishlist = [], onToggleWishlist }) {
  const [spotlightImage, setSpotlightImage] = useState(0);
  if (!products.length) return <p className="empty-products">No pieces in this edit yet. Check back soon.</p>;
  const spotlight = featured ? products[0] : null;
  const catalog = featured ? products.slice(1) : products;
  return <>
    {spotlight && <article className="product-spotlight">
      <div className="spotlight-visual"><ActionButton type="button" className="spotlight-photo" onClick={(event) => { event.preventDefault(); event.stopPropagation(); setSpotlightImage((current) => (current + 1) % spotlight.images.length); }} aria-label={`Show next photo of ${spotlight.name}`}><img src={spotlight.images[spotlightImage]} alt={`${spotlight.name}, view ${spotlightImage + 1}`} /><span className="spotlight-photo-label">KYREONS / CHAPTER 01</span><span className="spotlight-photo-counter">{String(spotlightImage + 1).padStart(2, '0')} — {String(spotlight.images.length).padStart(2, '0')}</span></ActionButton><div className="spotlight-thumbnails" aria-label={`${spotlight.name} photos`}>{spotlight.images.map((image, index) => <button type="button" key={`${image}-${index}`} className={spotlightImage === index ? 'active' : ''} onClick={(event) => { event.preventDefault(); event.stopPropagation(); setSpotlightImage(index); }} aria-label={`Show photo ${index + 1} of ${spotlight.name}`}><img src={image} alt="" /></button>)}</div></div>
      <div className="spotlight-copy"><p className="eyebrow"><span className="eyebrow-mark">✳</span> THE PIECE TO START WITH</p><span className="spotlight-edition">{spotlight.badge || 'KYREONS ESSENTIALS'} <span>01 / 08</span></span><ActionButton className="spotlight-title" onClick={() => onOpen(spotlight.id)}>{spotlight.name}</ActionButton><p className="spotlight-description">{spotlight.description}</p><div className="spotlight-specs"><span>240 GSM COTTON</span><span>ROOM TO MOVE</span><span>MADE FOR EVERY DAY</span></div><div className="spotlight-buy-row"><span className="spotlight-price">{formatMoney(spotlight.price)}</span><ActionButton className="spotlight-add" onClick={() => onQuickAdd(spotlight)}>ADD TO BAG <AddIcon /></ActionButton></div><ActionButton className="spotlight-view" onClick={() => onOpen(spotlight.id)}>EXPLORE THE PIECE <ArrowOutwardIcon /></ActionButton><span className="spotlight-mark">K.</span></div>
    </article>}
    <div className={`product-grid ${featured ? 'catalog-grid' : ''} ${className}`}>{catalog.map((product, index) => <ProductCard key={product.id} product={product} index={index} onQuickAdd={onQuickAdd} onOpen={onOpen} isWishlisted={wishlist.includes(product.id)} onToggleWishlist={onToggleWishlist} />)}</div>
  </>;
}
