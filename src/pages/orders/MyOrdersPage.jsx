import { useEffect, useState } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { formatMoney, products } from '../../utils/store.js';
import { isFirebaseConfigured, watchMyOrders } from '../../services/firebase.js';

const orderStages = [
  ['order_received', 'Order received'],
  ['payment_received', 'Payment received'],
  ['in_progress', 'In progress'],
  ['dispatched', 'Dispatched'],
  ['delivered', 'Delivered'],
];

const statusLabels = {
  pending_payment: 'Awaiting payment',
  order_received: 'Order received',
  payment_received: 'Payment received',
  in_progress: 'In progress',
  dispatched: 'On the way',
  delivered: 'Delivered',
  return_requested: 'Return requested',
  return_in_progress: 'Return in progress',
  returned: 'Return complete',
  cancelled: 'Cancelled',
};

function formatDate(value) {
  if (!value) return '';
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatCreatedAt(value) {
  return value?.toDate?.().toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) || 'Recently placed';
}

function TrackingPanel({ order }) {
  const status = order.status || 'pending_payment';
  const stageIndex = orderStages.findIndex(([stage]) => stage === status);
  const returning = status.startsWith('return_');
  const terminal = status === 'cancelled' || status === 'returned';
  const statusLabel = statusLabels[status] || status.replaceAll('_', ' ');

  return <section className="border-y border-[var(--line)] bg-[var(--surface)] px-4 py-5 sm:px-5" aria-label={`Tracking for order ${order.orderNumber}`}>
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center bg-[#d5ed52] text-[#191b17]"><LocalShippingOutlinedIcon fontSize="small" /></span>
        <div><p className="text-[9px] font-semibold uppercase tracking-[.14em] text-[var(--muted)]">Current status</p><p className="mt-1 text-sm font-semibold capitalize text-[var(--text)]">{statusLabel}</p></div>
      </div>
      <span className={`inline-flex items-center gap-2 px-3 py-2 text-[10px] font-semibold capitalize ${order.paymentStatus === 'received' ? 'bg-[#d5ed52]/70 text-[#191b17]' : 'border border-[var(--line)] bg-[var(--bg)] text-[var(--muted)]'}`}>
        <PaymentsOutlinedIcon sx={{ fontSize: 15 }} /> Payment {order.paymentStatus || 'pending'}
      </span>
    </div>

    {terminal ? <div className="mt-4 flex items-start gap-3 border-t border-[var(--line)] pt-4 text-xs leading-5 text-[var(--muted)]"><Inventory2OutlinedIcon fontSize="small" /><p>{status === 'returned' ? 'The return has been marked complete.' : 'This order has been cancelled.'}</p></div>
      : returning ? <div className="mt-4 flex flex-wrap items-start justify-between gap-3 border-t border-[var(--line)] pt-4 text-xs leading-5 text-[var(--text)]"><p>{status === 'return_requested' ? 'Your return request has been received.' : 'Your return is being processed.'}</p>{order.returnEstimatedAt && <p className="inline-flex items-center gap-1.5 text-[var(--muted)]"><EventOutlinedIcon sx={{ fontSize: 15 }} /> Estimated completion: <strong className="font-semibold text-[var(--text)]">{formatDate(order.returnEstimatedAt)}</strong></p>}</div>
        : <ol className="mt-6 grid grid-cols-2 gap-x-3 gap-y-3 sm:grid-cols-5 sm:gap-3">{orderStages.map(([key, label], index) => {
          const complete = stageIndex >= index;
          const current = status === key;
          return <li className="min-w-0" key={key} aria-current={current ? 'step' : undefined}>
            <span className={`block h-2 overflow-hidden rounded-full ${complete ? 'bg-[#a8bc38]' : 'bg-[var(--line)]'}`} aria-hidden="true">
              <span className={`block h-full rounded-full transition-[width] duration-500 ${current ? 'w-full bg-gradient-to-r from-[#9baa25] via-[#bed83b] to-[#d5ed52]' : complete ? 'w-full bg-gradient-to-r from-[#8da326] to-[#d5ed52]' : 'w-0'}`} />
            </span>
            <span className={`mt-2 flex items-center gap-1 text-[9px] leading-4 sm:text-[10px] ${current ? 'font-bold text-[var(--text)]' : complete ? 'font-medium text-[var(--text)]' : 'text-[var(--muted)]'}`}>
              {complete && <CheckCircleOutlineIcon sx={{ fontSize: 13, color: '#8da326' }} />}
              <span className="truncate">{label}</span>
            </span>
          </li>;
        })}</ol>}

    <div className="mt-5 grid gap-2 border-t border-[var(--line)] pt-4 sm:grid-cols-2">
      {order.currentCity && <div className="flex items-center gap-2 text-xs text-[var(--muted)]"><LocationOnOutlinedIcon sx={{ fontSize: 17 }} /><span>Latest location <strong className="font-semibold text-[var(--text)]">{order.currentCity}</strong></span></div>}
      {order.estimatedDeliveryAt && status !== 'delivered' && !returning && <div className="flex items-center gap-2 text-xs text-[var(--muted)]"><EventOutlinedIcon sx={{ fontSize: 16 }} /><span>Estimated delivery <strong className="font-semibold text-[var(--text)]">{formatDate(order.estimatedDeliveryAt)}</strong></span></div>}
      {order.statusUpdatedAt?.toDate && <p className="text-[10px] text-[var(--muted)] sm:col-span-2">Last updated {order.statusUpdatedAt.toDate().toLocaleString()}</p>}
    </div>
  </section>;
}

function OrderCard({ order, compact = false }) {
  const items = order.items || [];
  const rows = <div className="divide-y divide-[var(--line)]">{items.map((item, index) => {
    const product = products.find((entry) => entry.id === item.productId);
    const image = product?.images?.[0] || '/placeholder.svg';
    return <div className="flex items-center gap-3 py-3 first:pt-0 last:pb-0" key={`${item.productId}-${index}`}>
      <a className="block h-[30px] w-[30px] min-h-[30px] min-w-[30px] shrink-0 overflow-hidden bg-[var(--surface)]" style={{ width: '30px', height: '30px', minWidth: '30px', maxWidth: '30px', flex: '0 0 30px' }} href={`#product/${item.productId}`} aria-label={`View ${item.name}`}>
        <img className="block h-[30px] w-[30px] min-h-[30px] min-w-[30px] max-h-[30px] max-w-[30px] object-cover" style={{ width: '30px', height: '30px', minWidth: '30px', maxWidth: '30px', minHeight: '30px', maxHeight: '30px' }} src={image} alt={item.name} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = '/placeholder.svg'; }} />
      </a>
      <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
        <div className="min-w-0"><a className="line-clamp-2 text-sm font-medium text-[var(--text)] underline decoration-transparent underline-offset-4 transition-colors hover:decoration-current" href={`#product/${item.productId}`}>{item.name}</a><p className="mt-1 text-[10px] text-[var(--muted)]">{item.color} · Size {item.size} · Qty {item.quantity}</p></div>
        <span className="shrink-0 text-xs font-semibold text-[var(--text)]">{formatMoney(item.price * item.quantity)}</span>
      </div>
    </div>;
  })}</div>;

  return <article className="group overflow-hidden border border-[var(--line)] bg-[var(--bg)]">
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] px-4 py-4 sm:px-6 sm:py-5">
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center bg-[var(--surface)] text-[var(--text)]"><ShoppingBagOutlinedIcon fontSize="small" /></span>
        <div className="min-w-0"><p className="truncate text-[10px] font-bold tracking-[.1em] text-[var(--text)]">{order.orderNumber || 'KYREONS ORDER'}</p><p className="mt-1 inline-flex items-center gap-1 text-[10px] text-[var(--muted)]"><EventOutlinedIcon sx={{ fontSize: 13 }} /> Placed {formatCreatedAt(order.createdAt)} · {items.length} {items.length === 1 ? 'item' : 'items'}</p></div>
      </div>
      <div className="text-right"><p className="text-[9px] font-semibold uppercase tracking-[.13em] text-[var(--muted)]">Order total</p><p className="mt-1 font-display text-xl font-semibold tracking-[-.04em] text-[var(--text)]">{formatMoney(order.total)}</p></div>
    </header>

    {compact ? <div className="p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2"><span className="inline-flex items-center gap-2 bg-[#d5ed52]/70 px-3 py-1.5 text-[10px] font-semibold capitalize text-[#191b17]"><span className="h-1.5 w-1.5 rounded-full bg-[#191b17]" />{statusLabels[order.status] || 'Awaiting payment'}</span>{order.estimatedDeliveryAt && <span className="text-[10px] text-[var(--muted)]">ETA {formatDate(order.estimatedDeliveryAt)}</span>}</div>
      {items.slice(0, 2).map((item, index) => <p className="truncate py-1 text-xs text-[var(--muted)]" key={`${item.productId}-${index}`}>{item.name} <span className="text-[var(--text)]">× {item.quantity}</span></p>)}
      {items.length > 2 && <p className="pt-1 text-[10px] text-[var(--muted)]">and {items.length - 2} more</p>}
      <details className="mt-4 border-t border-[var(--line)] pt-3">
        <summary className="cursor-pointer text-[9px] font-semibold tracking-[.1em] text-[var(--text)] marker:text-[#747d19]">VIEW TRACKING & ORDER DETAILS</summary>
        <div className="mt-4 space-y-4"><TrackingPanel order={order} />{rows}<AddressDetails order={order} /></div>
      </details>
    </div> : <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,.85fr)] lg:gap-7">
      <TrackingPanel order={order} />
      <div className="space-y-5">
        <section><div className="mb-3 flex items-center justify-between"><p className="text-[9px] font-semibold uppercase tracking-[.14em] text-[var(--muted)]">Items in this order</p><span className="text-[10px] text-[var(--muted)]">{items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0)} pieces</span></div>{rows}</section>
        <AddressDetails order={order} />
      </div>
    </div>}
  </article>;
}

function AddressDetails({ order }) {
  return <div className="flex items-start gap-3 border-t border-[var(--line)] pt-4 text-xs leading-5 text-[var(--muted)]">
    <LocationOnOutlinedIcon sx={{ fontSize: 17, marginTop: '2px' }} />
    <div><p className="mb-1 text-[9px] font-semibold uppercase tracking-[.12em] text-[var(--text)]">Delivering to</p><p>{order.customer?.name} · {order.customer?.phone}</p><p>{order.customer?.address}{order.customer?.address2 ? `, ${order.customer.address2}` : ''}</p><p>{order.customer?.city}, {order.customer?.region} {order.customer?.postalCode}, {order.customer?.country}</p></div>
  </div>;
}

function OrdersLoading() {
  return <div className="mt-7 space-y-4" role="status" aria-label="Loading orders"><span className="sr-only">Loading your orders</span>{[1, 2].map((item) => <div className="animate-pulse overflow-hidden border border-[var(--line)]" key={item}><div className="h-20 bg-[var(--surface)]"/><div className="space-y-3 p-5"><div className="h-4 w-1/3 bg-[var(--surface)]"/><div className="h-24 bg-[var(--surface)]"/><div className="h-4 w-1/2 bg-[var(--surface)]"/></div></div>)}</div>;
}

export default function MyOrdersPage({ compact = false }) {
  const [orders, setOrders] = useState([]);
  const [state, setState] = useState(isFirebaseConfigured ? 'loading' : 'unconfigured');

  useEffect(() => {
    if (!isFirebaseConfigured) return undefined;
    let active = true;
    const stopWatching = watchMyOrders((items) => {
      if (!active) return;
      setOrders(items);
      setState('ready');
    }, () => { if (active) setState('error'); });
    return () => { active = false; stopWatching(); };
  }, []);

  return <section className={compact ? 'min-w-0' : 'mx-auto min-h-[55vh] max-w-[1240px] px-5 py-10 sm:px-8 sm:py-14 lg:px-12'}>
    {compact ? <div className="mb-5"><p className="eyebrow"><span className="status-dot" />YOUR KYREONS / ORDER HISTORY</p><h2 className="mt-3 font-display text-3xl font-medium tracking-[-.06em] text-[var(--text)]">Previous orders<span className="text-[#a9b18a] dark:text-[#d5ed52]">.</span></h2></div>
      : <header className="relative mb-8 overflow-hidden bg-[#191b17] px-6 py-8 text-white sm:px-9 sm:py-10">
        <span className="pointer-events-none absolute -right-7 -top-20 select-none font-display text-[220px] font-semibold leading-none tracking-[-.12em] text-white/[.035]" aria-hidden="true">K</span>
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div><p className="flex items-center gap-2 text-[9px] font-semibold tracking-[.18em] text-white/65"><span className="h-1.5 w-1.5 rounded-full bg-[#d5ed52]" /> YOUR KYREONS / ORDER HISTORY</p><h1 className="mt-4 font-display text-[clamp(42px,7vw,76px)] font-medium leading-[.9] tracking-[-.085em]">My orders<span className="text-[#d5ed52]">.</span></h1><p className="mt-4 max-w-xl text-xs leading-5 text-white/60">Your pieces, from checkout to your doorstep. Track each order as it moves.</p></div>
          <div className="inline-flex items-center gap-2 border border-white/15 bg-white/5 px-4 py-3 text-[9px] font-semibold tracking-[.1em] text-white/75"><LocalShippingOutlinedIcon fontSize="small" /><span>LIVE ORDER UPDATES</span></div>
        </div>
      </header>}

    {state === 'loading' && <OrdersLoading />}
    {state === 'unconfigured' && <div className="mt-6 border border-[var(--line)] bg-[var(--bg)] p-6 text-sm text-[var(--muted)]">Order history will be available once Firebase is configured.</div>}
    {state === 'error' && <div className="mt-6 border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300" role="alert">We couldn’t load your orders. Please try again later.</div>}
    {state === 'ready' && !orders.length && <div className="grid min-h-64 place-items-center border border-dashed border-[var(--line)] bg-[var(--bg)] px-6 py-10 text-center">
      <div><span className="mx-auto grid h-14 w-14 place-items-center bg-[#d5ed52]/55 text-[#191b17]"><ShoppingBagOutlinedIcon /></span><h2 className="mt-4 font-display text-2xl font-medium tracking-[-.04em] text-[var(--text)]">Your next favourite is out there.</h2><p className="mt-2 text-xs text-[var(--muted)]">You haven’t placed an order yet. Find a piece that feels like you.</p><a className="mt-5 inline-flex items-center gap-3 bg-[#d5ed52] px-5 py-3 text-[9px] font-bold tracking-[.12em] text-[#191b17] transition-colors hover:bg-[#c4dc42]" href="#shop-all">EXPLORE THE COLLECTION <ArrowForwardIcon fontSize="small" /></a></div>
    </div>}
    {orders.length > 0 && <div className={`space-y-4 ${compact ? 'mt-5' : ''}`}>{orders.map((order) => <OrderCard order={order} compact={compact} key={order.id} />)}</div>}
  </section>;
}
