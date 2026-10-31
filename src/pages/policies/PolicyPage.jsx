import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import AssignmentReturnOutlinedIcon from '@mui/icons-material/AssignmentReturnOutlined';
import PrivacyTipOutlinedIcon from '@mui/icons-material/PrivacyTipOutlined';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';

const policyIcons = {
  shipping: LocalShippingOutlinedIcon,
  returns: AssignmentReturnOutlinedIcon,
  privacy: PrivacyTipOutlinedIcon,
  terms: GavelOutlinedIcon,
};
const sectionIcons = [LocalShippingOutlinedIcon, AssignmentReturnOutlinedIcon, PrivacyTipOutlinedIcon, GavelOutlinedIcon];

const policies = {
  shipping: {
    title: 'Shipping policy',
    intro: 'We currently accept orders for delivery within India.',
    sections: [
      ['Delivery area', 'At this time, checkout is available for Indian delivery addresses only. International shipping is not available yet.'],
      ['Shipping charges', 'Standard shipping is currently complimentary within India. Any future shipping charge will be shown before an order is placed.'],
      ['Delivery estimates', 'Delivery timing can vary by destination and courier. We will share an estimate and tracking details when an order is confirmed and dispatched.'],
      ['Need help?', 'For an order or delivery question, email kyreons.studio@gmail.com and include your order reference if you have one.'],
    ],
  },
  returns: {
    title: 'Returns and exchanges',
    intro: 'We want you to feel good about what you ordered. Contact us before sending an item back so we can help with the next steps.',
    sections: [
      ['Return requests', 'Please contact us within 7 days of delivery to request a return or exchange. Items should be unworn, unwashed, and returned with their original tags and packaging. We will confirm eligibility and return instructions by email.'],
      ['Incorrect or damaged items', 'If an item arrives damaged, defective, incorrect, or materially different from its description, contact us as soon as possible with your order reference and photos. This policy does not limit any rights available to you under applicable consumer law.'],
      ['Refunds and exchanges', 'Once an approved return is received and checked, we will email you with the outcome and any applicable refund or exchange steps. Refund timing depends on the payment provider and bank.'],
      ['Start a request', 'Email kyreons.studio@gmail.com with your order reference and the reason for your request.'],
    ],
  },
  privacy: {
    title: 'Privacy policy',
    intro: 'This storefront is a demo today. Here is what it currently stores and what happens when connected services are enabled.',
    sections: [
      ['Data stored in your browser', 'Your cart, wishlist, and theme preference are saved in local browser storage so they remain available on your device.'],
      ['Checkout details', 'The current checkout is a demonstration. It displays the details you enter in an on-page invoice preview and does not send them to an order system or payment processor. Avoid entering sensitive information.'],
      ['Contact and newsletter', 'The contact form prepares a message in your email application. If newsletter signup is connected, the email address you submit is sent to the configured signup endpoint and its email service.'],
      ['Questions or requests', 'For privacy questions or requests about information you sent to Kyreons, email kyreons.studio@gmail.com.'],
    ],
  },
  terms: {
    title: 'Terms of use',
    intro: 'These terms describe use of the Kyreons storefront. Orders are currently intended for delivery within India.',
    sections: [
      ['Product information', 'We make a reasonable effort to show products, colors, sizes, and prices accurately. Color appearance can vary by display. Please contact us if you need help before ordering.'],
      ['Prices and availability', 'Prices and availability may change. The amount and applicable charges should be reviewed at checkout before an order is placed.'],
      ['Checkout status', 'The storefront checkout is currently a demo and does not accept payment or create a confirmed order. An invoice preview shown after form submission is not a payment receipt or order confirmation.'],
      ['Contact', 'For questions about these terms, email kyreons.studio@gmail.com. These terms do not remove consumer rights that apply under law.'],
    ],
  },
};

export default function PolicyPage({ type = 'shipping' }) {
  const policy = policies[type] || policies.shipping;
  const PolicyIcon = policyIcons[type] || policyIcons.shipping;
  return <main className="policy-page mx-auto max-w-6xl px-5 py-10 sm:px-8 md:py-16">
    <p className="flex items-center gap-2 text-[9px] font-semibold tracking-[.17em] text-neutral-500"><span className="h-1.5 w-1.5 rounded-full bg-[#d5ed52]" /> YOUR KYREONS / CUSTOMER CARE</p>
    <section className="policy-hero relative mt-7 grid min-h-[260px] overflow-hidden bg-[#191b17] text-white sm:grid-cols-[1.1fr_.9fr]">
      <div className="relative z-10 flex flex-col items-start justify-center px-6 py-9 sm:px-10 md:px-14">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-[#d5ed52] text-[#191b17]"><PolicyIcon /></span>
        <h1 className="mt-5 font-display text-4xl font-medium tracking-[-.065em] sm:text-5xl">{policy.title}<span className="text-[#d5ed52]">.</span></h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-white/75">{policy.intro}</p>
      </div>
      <div className="policy-hero-image relative min-h-[190px] sm:min-h-full">
        <img className="absolute inset-0 h-full w-full object-cover" src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1400&q=85" alt="A man writing on a sheet of paper at a desk" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#191b17] via-[#191b17]/20 to-transparent sm:bg-gradient-to-r" />
        <span className="absolute bottom-4 right-5 text-[8px] font-semibold tracking-[.16em] text-white/80">PHOTO: SCOTT GRAHAM / UNSPLASH</span>
      </div>
    </section>
    <nav className="mt-7 grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="Policies">
      {Object.entries(policies).map(([key, item]) => { const Icon = policyIcons[key]; return <a className={`policy-nav-card flex min-h-[90px] flex-col justify-between border p-3 transition-colors sm:p-4 ${key === type ? 'border-[#d5ed52] bg-[#d5ed52] text-[#191b17]' : 'border-neutral-200 bg-[var(--bg)] text-neutral-700 hover:border-[#d5ed52] dark:border-neutral-800 dark:text-neutral-200'}`} href={`#policy/${key}`} key={key}><Icon fontSize="small" /><span className="text-[8px] font-semibold tracking-[.08em] sm:text-[9px]">{item.title.toUpperCase()}</span></a>; })}
    </nav>
    <div className="policy-content mt-5 grid gap-3 sm:grid-cols-2">{policy.sections.map(([heading, body], index) => { const Icon = sectionIcons[index % sectionIcons.length]; return <section className="policy-info-card border border-neutral-200 bg-[var(--bg)] p-5 dark:border-neutral-800 sm:p-6" key={heading}><span className="grid h-9 w-9 place-items-center rounded-full bg-[#d5ed52]/35 text-neutral-900 dark:text-[#d5ed52]"><Icon fontSize="small" /></span><h2 className="mt-4 font-display text-xl font-medium text-neutral-900 dark:text-white">{heading}</h2><p className="mt-2 text-sm leading-7 text-neutral-600 dark:text-neutral-300">{body}</p></section>; })}</div>
    <a className="policy-contact-link mt-7 inline-flex items-center gap-2 bg-[#191b17] px-5 py-3 text-[9px] font-semibold tracking-[.1em] text-white transition-colors hover:bg-[#34362f]" href="mailto:kyreons.studio@gmail.com">CONTACT KYREONS <ArrowOutwardIcon fontSize="small" /></a>
  </main>;
}
