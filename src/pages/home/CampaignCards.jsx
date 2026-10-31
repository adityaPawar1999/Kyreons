const campaigns = [
  {
    filter: 't-shirts',
    href: '#shirts',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=85',
    imageAlt: 'Relaxed everyday graphic tee',
    eyebrow: '01 / THE T-SHIRT EDIT',
    title: <>EVERYDAY<br />TEES.</>,
    description: 'Find your next go-to tee, from expressive graphics to easy everyday essentials.',
    linkText: 'SHOP T-SHIRTS',
    className: '',
  },
  {
    filter: 'oversized',
    href: '#category/oversized',
    image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1000&q=85',
    imageAlt: 'Minimal streetwear wardrobe pieces',
    eyebrow: '02 / THE OVERSIZED EDIT',
    title: <>ROOM TO<br />MOVE.</>,
    description: 'Explore relaxed oversized fits with extra room, easy movement, and a laid-back feel.',
    linkText: 'SHOP OVERSIZED',
    className: '',
  },
  {
    filter: 'handcrafted',
    href: '#category/handcrafted',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1100&q=85',
    imageAlt: 'Artisan-finished clothing detail',
    eyebrow: '03 / THE HANDCRAFTED EDIT',
    title: <>FINISHED<br />BY HAND.</>,
    description: 'Discover handcrafted pieces with thoughtful finishing and considered details in every design.',
    linkText: 'SHOP HANDCRAFTED',
    className: '',
  },
];

export default function CampaignCards() {
  return (
    <section className="grid grid-cols-1 gap-0 bg-paper py-0 sm:grid-cols-2 md:grid-cols-3">
      {campaigns.map((campaign) => (
        <a
          key={campaign.filter}
          className={`group relative min-h-[390px] overflow-hidden bg-neutral-700 text-white sm:min-h-[370px] md:min-h-[400px] lg:min-h-[490px] ${campaign.className}`}
          href={campaign.href}
        >
          <img
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            src={campaign.image}
            loading="lazy"
            alt={campaign.imageAlt}
          />
          <div className="absolute inset-0 flex flex-col items-start justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 !text-white sm:p-[8%]">
            <span className="text-[7px] tracking-[.12em] !text-white md:text-[8px]">
              {campaign.eyebrow}
            </span>
            <h3 className="my-3 font-display text-[clamp(40px,8vw,72px)] font-semibold leading-[.83] tracking-[-.08em] !text-white sm:my-4 sm:text-[clamp(34px,6vw,72px)]">
              {campaign.title}
            </h3>
            <p className="mb-5 max-w-[340px] text-xs leading-relaxed !text-white md:text-xs">
              {campaign.description}
            </p>
            <span className="inline-flex items-center gap-2 border border-white/70 px-3 py-2 text-[7px] font-semibold tracking-[.1em] !text-white transition-colors group-hover:border-acid group-hover:bg-acid group-hover:!text-neutral-900 md:text-[8px]">
              {campaign.linkText}{' '}
              <span
                className="inline-block transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              >
                ↗
              </span>
            </span>
          </div>
        </a>
      ))}
    </section>
  );
}
