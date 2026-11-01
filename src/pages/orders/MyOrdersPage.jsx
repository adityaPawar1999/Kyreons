import { useEffect, useState } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { formatMoney, products } from '../../utils/store.js';
import { getMyOrders, isFirebaseConfigured } from '../../services/firebase.js';

export default function MyOrdersPage({ compact = false }) {
  const [orders, setOrders] = useState([]);
  const [state, setState] = useState(isFirebaseConfigured ? 'loading' : 'unconfigured');

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    let active = true;
    getMyOrders().then((items) => { if (active) { setOrders(items); setState('ready'); } })
      .catch(() => { if (active) setState('error'); });
    return () => { active = false; };
  }, []);

  return <section className={compact ? 'min-w-0' : 'mx-auto min-h-[55vh] max-w-5xl px-5 py-16 sm:px-8'}>
    {compact ? <h2 className="font-display text-3xl font-medium tracking-[-.05em] text-neutral-900 dark:text-white">Previous orders.</h2> : <><p className="text-[9px] font-semibold tracking-[.17em] text-neutral-500">YOUR KYREONS / ORDER HISTORY</p><h1 className="mt-4 font-display text-5xl font-medium tracking-[-.07em] text-neutral-900 dark:text-white">My orders.</h1></>}
    {state === 'loading' && <p className="mt-8 text-sm text-neutral-500">Loading your orders…</p>}
    {state === 'unconfigured' && <p className="mt-8 text-sm text-neutral-600 dark:text-neutral-300">Order history will be available once Firebase is configured.</p>}
    {state === 'error' && <p className="mt-8 text-sm text-rose-700 dark:text-rose-300">We couldn’t load your orders. Please try again later.</p>}
    {state === 'ready' && !orders.length && <div className="mt-8 border-t border-neutral-300 py-8 dark:border-neutral-700"><p className="text-sm text-neutral-600 dark:text-neutral-300">You haven’t placed an order yet.</p><a className="mt-5 inline-flex items-center gap-2 border-b border-current pb-1 text-xs font-semibold" href="#shop-all">EXPLORE THE COLLECTION <ArrowForwardIcon fontSize="small" /></a></div>}
    {orders.length > 0 && <div className={`${compact ? 'mt-5 space-y-4' : 'mt-8 space-y-5'}`}>{orders.map((order) => <article className="border border-neutral-300 p-5 dark:border-neutral-700 sm:p-7" key={order.id}>
      <header className="flex flex-wrap justify-between gap-3 border-b border-neutral-300 pb-4 dark:border-neutral-700"><div><p className="text-[9px] font-semibold tracking-[.12em] text-neutral-500">ORDER {order.orderNumber}</p><p className="mt-1 text-xs text-neutral-500">{order.createdAt?.toDate?.().toLocaleDateString() || 'Recently placed'}</p></div><strong className="text-sm text-neutral-900 dark:text-white">{formatMoney(order.total)}</strong></header>
      <div className="mt-4 space-y-3">{order.items?.map((item, index) => {
        const product = products.find((entry) => entry.id === item.productId);
        const image = product?.images?.[0] || '/placeholder.svg';
        return <div className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-200" key={`${item.productId}-${index}`}>
          <a className="h-16 w-12 shrink-0 overflow-hidden bg-neutral-100 dark:bg-neutral-800" href={`#product/${item.productId}`} aria-label={`View ${item.name}`}>
            <img className="h-full w-full object-cover" src={image} alt={item.name} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = '/placeholder.svg'; }} />
          </a>
          <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
            <span className="min-w-0"><a className="font-medium text-neutral-900 underline decoration-neutral-300 underline-offset-4 transition-colors hover:decoration-current dark:text-white" href={`#product/${item.productId}`}>{item.name}</a><span className="mt-1 block text-xs text-neutral-500">{item.color} · Size {item.size} · Qty {item.quantity}</span></span>
            <span className="shrink-0">{formatMoney(item.price * item.quantity)}</span>
          </div>
        </div>;
      })}</div>
      <div className="mt-5 border-t border-neutral-300 pt-4 text-xs leading-6 text-neutral-500 dark:border-neutral-700"><p>{order.customer?.name} · {order.customer?.phone}</p><p>{order.customer?.address}</p><p>{order.customer?.city}, {order.customer?.region} {order.customer?.postalCode}, {order.customer?.country}</p></div>
    </article>)}</div>}
  </section>;
}
