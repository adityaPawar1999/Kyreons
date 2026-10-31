import { useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { formatMoney, products } from '../../utils/store.js';

const inputClass = 'w-full border border-neutral-300 bg-transparent px-3 py-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-neutral-300';

export default function CheckoutPage({ cart, onChangeQuantity, onChangeSize }) {
  const [submitted, setSubmitted] = useState(false);
  const items = cart.map((item) => ({ ...item, product: products.find((product) => product.id === item.id) })).filter((item) => item.product);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (!items.length) {
    return <section className="mx-auto grid min-h-[55vh] max-w-5xl content-center px-5 py-16 sm:px-8">
      <p className="text-[9px] font-semibold tracking-[.17em] text-neutral-500">YOUR KYREONS / CHECKOUT</p>
      <h1 className="mt-4 font-display text-5xl font-medium tracking-[-.07em] text-neutral-900 dark:text-white">Your bag is empty.</h1>
      <a className="mt-7 inline-flex w-fit items-center gap-2 border-b border-current pb-1 text-xs font-semibold text-neutral-900 dark:text-white" href="#shop-all">CONTINUE SHOPPING <ArrowForwardIcon fontSize="small" /></a>
    </section>;
  }

  return <main className="mx-auto max-w-[1280px] px-5 py-10 sm:px-8 md:py-16 lg:px-12">
    <a className="mb-8 inline-flex items-center gap-2 text-xs text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white" href="#shop-all"><ArrowBackIcon fontSize="small" /> CONTINUE SHOPPING</a>
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-20">
      <section>
        <p className="text-[9px] font-semibold tracking-[.17em] text-neutral-500">YOUR KYREONS / SECURE CHECKOUT</p>
        <h1 className="mt-3 font-display text-[clamp(42px,6vw,68px)] font-medium leading-none tracking-[-.075em] text-neutral-900 dark:text-white">Almost yours.</h1>
        <form className="mt-9 space-y-10" onSubmit={handleSubmit}>
          <fieldset className="space-y-4">
            <legend className="mb-4 font-display text-2xl font-medium tracking-[-.04em] text-neutral-900 dark:text-white">Shipping address</legend>
            <label className="block text-xs text-neutral-600 dark:text-neutral-300">Email address<input className={`${inputClass} mt-2`} name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label>
            <label className="block text-xs text-neutral-600 dark:text-neutral-300">Phone number<input className={`${inputClass} mt-2`} name="phone" type="tel" autoComplete="tel" placeholder="For delivery updates" required /></label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs text-neutral-600 dark:text-neutral-300">First name<input className={`${inputClass} mt-2`} name="firstName" autoComplete="given-name" required /></label>
              <label className="text-xs text-neutral-600 dark:text-neutral-300">Last name<input className={`${inputClass} mt-2`} name="lastName" autoComplete="family-name" required /></label>
            </div>
            <label className="block text-xs text-neutral-600 dark:text-neutral-300">Address<input className={`${inputClass} mt-2`} name="address" autoComplete="address-line1" placeholder="House number and street" required /></label>
            <label className="block text-xs text-neutral-600 dark:text-neutral-300">Apartment, suite, etc. <span className="text-neutral-400">(optional)</span><input className={`${inputClass} mt-2`} name="address2" autoComplete="address-line2" /></label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs text-neutral-600 dark:text-neutral-300">City<input className={`${inputClass} mt-2`} name="city" autoComplete="address-level2" required /></label>
              <label className="text-xs text-neutral-600 dark:text-neutral-300">State / region<input className={`${inputClass} mt-2`} name="region" autoComplete="address-level1" required /></label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs text-neutral-600 dark:text-neutral-300">Postal code<input className={`${inputClass} mt-2`} name="postalCode" autoComplete="postal-code" required /></label>
              <label className="text-xs text-neutral-600 dark:text-neutral-300">Country / region<select className={`${inputClass} mt-2`} name="country" autoComplete="country-name" defaultValue="India" required><option>India</option><option>United States</option><option>United Kingdom</option><option>Canada</option><option>Australia</option></select></label>
            </div>
          </fieldset>

          {submitted && <p className="border-l-2 border-[#d5ed52] bg-[#d5ed52]/15 px-4 py-3 text-sm text-neutral-800 dark:text-neutral-100" role="status">Your delivery details are ready. Payment setup is needed to complete your order.</p>}
          <button className="inline-flex w-full items-center justify-between gap-4 bg-[#d5ed52] px-5 py-4 text-xs font-bold tracking-[.1em] text-neutral-900 transition-colors hover:bg-[#c4dc42] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900" type="submit"><span>CONTINUE TO PAYMENT</span><ArrowForwardIcon /></button>
          <p className="flex items-center justify-center gap-2 text-[11px] text-neutral-500"><LockOutlinedIcon fontSize="small" /> Your information is used to prepare your order.</p>
        </form>
      </section>

      <aside className="h-fit bg-neutral-100 p-5 dark:bg-neutral-900 sm:p-7 lg:sticky lg:top-28">
        <div className="flex items-baseline justify-between border-b border-neutral-300 pb-4 dark:border-neutral-700"><h2 className="font-display text-2xl font-medium tracking-[-.04em] text-neutral-900 dark:text-white">Your order</h2><span className="text-[10px] tracking-[.1em] text-neutral-500">{items.reduce((sum, item) => sum + item.quantity, 0)} ITEMS</span></div>
        <ul className="divide-y divide-neutral-300 dark:divide-neutral-700">
          {items.map((item) => {
            const { key, product, quantity, size, color } = item;
            return <li className="flex gap-4 py-4" key={key}>
            <div className="relative h-24 w-[72px] shrink-0 bg-white dark:bg-neutral-800"><img className="h-full w-full object-cover" src={product.images[0]} alt={product.name} /><span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center bg-neutral-900 px-1 text-[10px] text-white">{quantity}</span></div>
            <div className="min-w-0 flex-1"><h3 className="text-sm font-medium text-neutral-900 dark:text-white">{product.name}</h3><p className="mt-1 text-xs text-neutral-500">{color}</p><label className="mt-2 flex items-center gap-2 text-[10px] text-neutral-500">SIZE<select className="border border-neutral-300 bg-transparent px-2 py-1 text-xs text-neutral-900 dark:border-neutral-700 dark:text-white" value={size} onChange={(event) => onChangeSize(item, event.target.value)} aria-label={`Size for ${product.name}`}>{product.sizes.map((option) => <option key={option} value={option}>{option}</option>)}</select></label><div className="mt-2 flex items-center gap-3"><div className="inline-flex items-center border border-neutral-300 text-neutral-900 dark:border-neutral-700 dark:text-white"><button className="grid h-7 w-7 place-items-center transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700" type="button" onClick={() => onChangeQuantity(item, -1)} aria-label={`Decrease ${product.name} quantity`}>−</button><span className="min-w-6 text-center text-xs">{quantity}</span><button className="grid h-7 w-7 place-items-center transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700" type="button" onClick={() => onChangeQuantity(item, 1)} aria-label={`Increase ${product.name} quantity`}>+</button></div><span className="text-xs font-semibold text-neutral-900 dark:text-white">{formatMoney(product.price * quantity)}</span></div></div>
          </li>;
          })}
        </ul>
        <div className="space-y-3 border-t border-neutral-300 pt-4 text-sm dark:border-neutral-700"><div className="flex justify-between text-neutral-600 dark:text-neutral-300"><span>Subtotal</span><span>{formatMoney(subtotal)}</span></div><div className="flex justify-between text-neutral-600 dark:text-neutral-300"><span>Shipping</span><span className="font-medium text-neutral-900 dark:text-white">Complimentary</span></div><div className="flex justify-between text-neutral-600 dark:text-neutral-300"><span>Taxes</span><span>Calculated after address</span></div><div className="mt-4 flex justify-between border-t border-neutral-300 pt-4 text-base font-semibold text-neutral-900 dark:border-neutral-700 dark:text-white"><span>Estimated total</span><span>{formatMoney(subtotal)}</span></div></div>
        <p className="mt-4 text-[10px] leading-relaxed text-neutral-500">Final taxes will be calculated from your shipping address before payment.</p>
      </aside>
    </div>
  </main>;
}
