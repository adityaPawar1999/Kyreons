import { useState } from 'react';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';

const CONTACT_EMAIL = 'kyreons.studio@gmail.com';

const inputClassName = [
  'w-full border border-neutral-200 bg-white px-3 py-3',
  'text-[11px] font-normal tracking-normal text-neutral-900',
  'outline-none transition-colors placeholder:text-neutral-500',
  'focus:border-neutral-900',
].join(' ');

const labelClassName = [
  'grid gap-2 text-[9px] font-semibold tracking-[.08em]',
  'text-neutral-900',
].join(' ');

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function submitInquiry(event) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`Kyreons enquiry: ${form.get('topic')}`);
    const body = encodeURIComponent(
      `Name: ${form.get('name')}\nEmail: ${form.get('email')}\nOrder number: ${form.get('order') || 'Not provided'}\n\n${form.get('message')}`,
    );

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
    event.currentTarget.reset();
  }

  return (
    <section className="relative isolate grid w-full gap-10 overflow-hidden bg-neutral-900 px-[5.2%] py-14 sm:px-8 md:gap-12 md:py-20 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:px-[max(5.2%,calc((100%-1320px)/2))] lg:py-24">
      <div
        className="absolute inset-0 -z-20 bg-cover bg-[position:57%_center] md:bg-[position:center_38%]"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=2200&q=88')",
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(14,16,14,.82),rgba(14,16,14,.55)_52%,rgba(14,16,14,.38))]" aria-hidden="true" />

      <div className="self-center text-white">
        <p className="text-[9px] font-semibold tracking-[.17em] text-white/75">
          HERE WHEN YOU NEED US / CONTACT
        </p>
        <h1 className="my-5 font-display text-[clamp(56px,9vw,88px)] font-medium leading-[.9] tracking-[-.09em]">
          Let's talk<br />
          <span className="text-acid">it through.</span>
        </h1>
        <p className="max-w-[500px] text-xs leading-[1.8] text-white/80">
          Have a question about a piece, need an update on your order, or looking
          for the perfect fit? We’re here to make your experience seamless.
          Whether you need help with sizing, product details, shipping, returns,
          or anything else, our team is ready to assist you. Send us a message,
          and we’ll get back to you as soon as possible. At KYREONS, we believe
          great style deserves great service.
        </p>
        <a
          className="mt-5 inline-flex items-center gap-2 text-[11px] text-white transition-colors hover:text-acid"
          href={`mailto:${CONTACT_EMAIL}`}
        >
          <EmailOutlinedIcon className="!h-4 !w-4" />
          {CONTACT_EMAIL}
        </a>
      </div>

      <div className="w-full max-w-2xl justify-self-end bg-white p-5 text-neutral-900 shadow-[0_24px_70px_rgba(0,0,0,.2)] sm:p-7 md:p-8 lg:col-start-2">
        <form className="w-full" onSubmit={submitInquiry}>
          <p className="mb-6 text-[9px] font-semibold tracking-[.15em] text-neutral-500">
            SEND A MESSAGE
          </p>
  
          <div className="grid grid-cols-1 gap-x-4 gap-y-4 min-[430px]:grid-cols-2">
            <label className={labelClassName}>
              Your name
              <input
                className={inputClassName}
                name="name"
                autoComplete="name"
                required
                placeholder="How should we call you?"
              />
            </label>
  
            <label className={labelClassName}>
              Email address
              <input
                className={inputClassName}
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
              />
            </label>
  
            <label className={labelClassName}>
              What can we help with?
              <select className={inputClassName} name="topic" defaultValue="Order question">
                <option>Order question</option>
                <option>Product and sizing</option>
                <option>Shipping and returns</option>
                <option>Something else</option>
              </select>
            </label>
  
            <label className={labelClassName}>
              <span className="flex items-center gap-2">
                Order number
                <span className="text-[7px] font-normal text-neutral-500">OPTIONAL</span>
              </span>
              <input className={inputClassName} name="order" placeholder="e.g. KYR-00123" />
            </label>
  
            <label className={`${labelClassName} min-[430px]:col-span-2`}>
              Your message
              <textarea
                className={`${inputClassName} min-h-[125px] resize-y`}
                name="message"
                required
                rows="5"
                placeholder="Tell us a little more..."
              />
            </label>
          </div>
  
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            className="inline-flex items-center gap-2 bg-neutral-900 px-3 py-2.5 text-[9px] font-semibold tracking-[.08em] text-white transition-colors hover:bg-neutral-700"
            type="submit"
          >
            SEND YOUR MESSAGE <ArrowOutwardIcon className="!h-3 !w-3" />
          </button>
          <button
            className="inline-flex items-center border border-neutral-200 px-3 py-2.5 text-[9px] font-semibold tracking-[.08em] text-neutral-600 transition-colors hover:border-neutral-400 hover:text-neutral-900"
            type="reset"
            onClick={() => setSent(false)}
          >
            CLEAR
          </button>
        </div>
  
          {sent && (
            <p className="mt-3 text-[10px] leading-relaxed text-neutral-600" role="status">
              Your email app should open with your message ready to send.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
