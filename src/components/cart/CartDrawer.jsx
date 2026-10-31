import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import IconButton from '../buttons/IconButton.jsx';
import { formatMoney, products } from '../../utils/store.js';

export default function CartDrawer({ open, cart, onClose, onCheckout, onChangeQuantity, onChangeSize, onRemove }) {
  const subtotal = cart.reduce((sum, item) => sum + (products.find((product) => product.id === item.id)?.price || 0) * item.quantity, 0);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  return <><button className={`drawer-backdrop${open ? ' open' : ''}`} onClick={onClose} aria-label="Close shopping bag" tabIndex={open ? 0 : -1} /><aside className={`cart-drawer${open ? ' open' : ''}`} aria-label="Shopping bag" aria-modal="true" role="dialog" aria-hidden={!open}><div className="drawer-header"><div><p className="eyebrow"><AutoAwesomeIcon className="eyebrow-mark" aria-hidden="true" /> YOUR KYREONS</p><h2>Shopping bag <span>({count})</span></h2></div><IconButton className="drawer-close" onClick={onClose} aria-label="Close shopping bag"><CloseIcon /></IconButton></div><div className="cart-items">{!cart.length ? <div className="cart-empty"><ShoppingBagOutlinedIcon /><h3>Room for something good.</h3><p>Your bag is waiting for its first favourite.</p><a className="button-light" href="#shop" onClick={onClose}>EXPLORE THE COLLECTION <ArrowOutwardIcon /></a></div> : cart.map((item) => {
    const product = products.find((entry) => entry.id === item.id);
    if (!product) return null;
    return <div className="cart-line" key={item.key}><img src={product.images[0]} alt={product.name} /><div><div className="cart-line-name">{product.name}</div><div className="cart-line-detail">{item.color}</div><label className="cart-size-control">SIZE <select value={item.size} onChange={(event) => onChangeSize(item, event.target.value)} aria-label={`Size for ${product.name}`}>{product.sizes.map((size) => <option value={size} key={size}>{size}</option>)}</select></label><div className="quantity-control"><button onClick={() => onChangeQuantity(item, -1)} aria-label="Remove one">−</button><span>{item.quantity}</span><button onClick={() => onChangeQuantity(item, 1)} aria-label="Add one">+</button></div></div><div><div className="cart-line-price">{formatMoney(product.price * item.quantity)}</div><button className="remove-line" onClick={() => onRemove(item.key)}>REMOVE</button></div></div>;
  })}</div>{cart.length > 0 && <div className="cart-footer"><div className="cart-subtotal"><span>SUBTOTAL</span><span>{formatMoney(subtotal)}</span></div><p className="shipping-note">Shipping and taxes calculated at checkout.</p><button className="checkout-button" onClick={onCheckout}>CHECKOUT <ArrowOutwardIcon /></button></div>}</aside></>;
}
