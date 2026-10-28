const campaigns = [
  {
    filter: 't-shirts',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=85',
    imageAlt: 'Relaxed everyday graphic tee',
    eyebrow: '01 / THE DAILY ROTATION',
    title: <>TEE<br />TIME.</>,
    description: 'Soft everyday tees with relaxed fits and easy styling, made for the pieces you reach for on repeat.',
    linkText: 'SHOP T-SHIRTS',
    className: '',
  },
  {
    filter: 'oversized',
    image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1000&q=85',
    imageAlt: 'Minimal streetwear wardrobe pieces',
    eyebrow: '02 / THE EXTRA ROOM EDIT',
    title: <>TAKE<br />UP SPACE.</>,
    description: 'Roomy silhouettes bring a laid-back feel and plenty of comfort, with shapes that let you move freely.',
    linkText: 'SHOP OVERSIZED',
    className: '',
  },
  {
    filter: 'handcrafted',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1100&q=85',
    imageAlt: 'Artisan-finished clothing detail',
    eyebrow: '03 / THE SMALL DETAILS',
    title: <>MADE<br />BY HAND.</>,
    description: 'Thoughtful finishing and considered details give each handcrafted piece its own character.',
    linkText: 'EXPLORE DETAILS',
    className: '',
  },
];

export default function CampaignCards() {
  return (
    <section className="grid grid-cols-1 gap-2 bg-paper py-2 sm:grid-cols-2 md:grid-cols-3 md:gap-3 md:py-3">
      {campaigns.map((campaign) => (
        <a
          key={campaign.filter}
          className={`group relative min-h-[390px] overflow-hidden bg-neutral-700 text-white sm:min-h-[370px] md:min-h-[400px] lg:min-h-[490px] ${campaign.className}`}
          href="#shop"
          data-campaign-filter={campaign.filter}
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
            <span className="border-b border-white/70 pb-1 text-[7px] font-semibold tracking-[.1em] !text-white md:text-[8px]">
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
