import { useEffect, useMemo, useState } from 'react';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import ProductGrid from '../../components/product/ProductGrid.jsx';
import { products } from '../../utils/store.js';
import CampaignCards from './CampaignCards.jsx';
import heroSlideOne from './HeroSlideOne.jsx';
import heroSlideTwo from './HeroSlideTwo.jsx';
import heroSlideThree from './HeroSlideThree.jsx';
import heroSlideFour from './HeroSlideFour.jsx';

const heroSlides = [heroSlideOne, heroSlideTwo, heroSlideThree, heroSlideFour];

function Newsletter() {
  const [message, setMessage] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    setMessage('Youâ€™re on the list. Keep an eye on your inbox.');
    event.currentTarget.reset();
  }

  return (
    <form className="grid gap-3 sm:grid-cols-[1fr_auto]" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="newsletter-email">
        Your email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        className="min-w-0 border border-neutral-300 bg-transparent px-4 py-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-500 focus:border-neutral-900 dark:border-neutral-600 dark:text-white dark:focus:border-white"
        placeholder="Your email address"
        required
      />
      <button className="inline-flex items-center justify-center gap-3 bg-neutral-900 px-5 py-3 text-[9px] font-bold tracking-[.12em] text-white transition-colors hover:bg-lime-300 hover:text-neutral-900 dark:bg-lime-300 dark:text-neutral-900" type="submit">
        COUNT ME IN <ArrowOutwardIcon />
      </button>
      {message && (
        <p className="text-xs text-neutral-600 dark:text-neutral-300 sm:col-span-2" role="status">
          {message}
        </p>
      )}
    </form>
  );
}

const filters = [
  ['all', 'ALL PIECES'],
  ['t-shirts', 'T-SHIRTS'],
  ['oversized', 'OVERSIZED'],
  ['handcrafted', 'HANDCRAFTED'],
];

function HeroCopy({ slide, className, darkText = false, compact = false }) {
  const mainText = darkText ? 'text-neutral-900' : 'text-white';
  const supportingText = darkText ? 'text-neutral-700' : 'text-white/80';
  const accentText = darkText ? 'text-neutral-900' : 'text-acid';
  const headingSize = compact
    ? 'text-[clamp(28px,4.5vw,62px)]'
    : 'text-[clamp(58px,15vw,92px)] md:text-[clamp(62px,9.4vw,130px)]';
  const buttonSize = compact
    ? 'gap-3 px-2 py-3 text-[7px] sm:gap-6 sm:px-4 sm:py-4 sm:text-[9px] sm:tracking-[.12em]'
    : 'gap-8 px-4 py-4 text-[9px] tracking-[.12em]';

  return (
    <div className={className}>
      <p className={`mb-5 flex items-center gap-2 text-[9px] font-semibold tracking-[.17em] ${supportingText}`}>
        <span className={`h-[7px] w-[7px] rounded-full ${darkText ? 'bg-neutral-900' : 'bg-acid'}`} />
        {slide.eyebrow}
      </p>
      <h1 className={`my-6 font-display ${headingSize} font-semibold leading-[.84] tracking-[-.095em] ${mainText}`}>
        {slide.titleLineOne}<br />
        <span className={accentText}>{slide.titleLineTwo}</span>
      </h1>
      <p className={`max-w-[390px] text-[11px] leading-relaxed md:text-[13px] ${supportingText}`}>
        {slide.description}
      </p>
      <a
        className={`mt-6 inline-flex items-center justify-between font-bold transition-colors ${buttonSize} ${darkText ? 'bg-neutral-900 !text-white hover:bg-neutral-700' : 'bg-paper !text-[#191b17] hover:bg-acid hover:!text-[#191b17]'}`}
        href="#shop"
      >
        SHOP THE COLLECTION <ArrowOutwardIcon />
      </a>
    </div>
  );
}

function HeroSlideView({ slide }) {
  if (slide.layout === 'split-images') {
    return (
      <div className="absolute inset-0 grid grid-cols-2">
        <div className="group relative overflow-hidden">
          <img className="h-full w-full object-cover object-center" src={slide.image} alt={slide.imageAlt} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/10" />
          <HeroCopy
            slide={slide}
            className="absolute inset-x-0 bottom-0 p-5 sm:p-8 md:p-10"
            compact
          />
        </div>
        <div className="relative overflow-hidden">
          <img className="h-full w-full object-cover object-center" src={slide.secondaryImage} alt={slide.secondaryImageAlt} />
          <div className="absolute inset-0 bg-black/10" />
          <span className="absolute right-5 top-5 text-[8px] font-semibold tracking-[.18em] text-white sm:right-8 sm:top-8">
            KYREONS / 002
          </span>
        </div>
      </div>
    );
  }

  if (slide.layout === 'editorial-panel') {
    return (
      <div className="absolute inset-0 grid bg-paper md:grid-cols-[.42fr_.58fr]">
        <div className="relative z-10 flex flex-col items-start justify-center bg-acid px-[7%] py-10 md:px-[10%]">
          <p className="mb-5 text-[9px] font-semibold tracking-[.17em] text-neutral-800">
            {slide.eyebrow}
          </p>
          <h1 className="font-display text-[clamp(48px,7vw,88px)] font-semibold leading-[.84] tracking-[-.095em] text-neutral-900">
            {slide.titleLineOne}<br />
            {slide.titleLineTwo}
          </h1>
          <p className="mt-5 max-w-[330px] text-xs leading-6 text-neutral-800">
            {slide.description}
          </p>
          <a className="mt-7 inline-flex items-center gap-3 border-b border-neutral-900 pb-2 text-[9px] font-bold tracking-[.12em] text-neutral-900" href="#shop">
            SHOP THE COLLECTION <ArrowOutwardIcon />
          </a>
          <span className="absolute bottom-5 left-[7%] text-[8px] font-semibold tracking-[.16em] text-neutral-700 md:left-[10%]">
            KYREONS / CHAPTER 03
          </span>
        </div>
        <div className="relative min-h-[260px] overflow-hidden md:min-h-0">
          <img className="absolute inset-0 h-full w-full object-cover object-[center_35%]" src={slide.image} alt={slide.imageAlt} />
          <span className="absolute bottom-5 right-5 text-[8px] font-semibold tracking-[.16em] text-white">
            MADE TO BE YOURS
          </span>
        </div>
      </div>
    );
  }

  if (slide.layout === 'image-collage') {
    return (
      <div className="absolute inset-0 grid bg-neutral-900 md:grid-cols-[.38fr_.62fr]">
        <div className="relative z-10 flex flex-col items-start justify-center bg-neutral-900 px-[7%] py-10 md:px-[12%]">
          <span className="mb-5 text-[9px] font-semibold tracking-[.17em] text-neutral-400">
            {slide.eyebrow}
          </span>
          <h1 className="font-display text-[clamp(48px,7vw,88px)] font-semibold leading-[.84] tracking-[-.095em] text-white">
            {slide.titleLineOne}<br />
            <span className="text-acid">{slide.titleLineTwo}</span>
          </h1>
          <p className="mt-5 max-w-[330px] text-xs leading-6 text-neutral-300">
            {slide.description}
          </p>
          <a className="mt-7 inline-flex items-center gap-3 bg-acid px-4 py-4 text-[9px] font-bold tracking-[.12em] text-neutral-900 transition-colors hover:bg-white hover:!text-black" href="#shop">
            SHOP THE COLLECTION <ArrowOutwardIcon />
          </a>
        </div>
        <div className="grid min-h-[300px] grid-cols-[1.2fr_.8fr] grid-rows-2 gap-1.5 p-1.5 md:min-h-0">
          <img className="row-span-2 h-full min-h-0 w-full object-cover" src={slide.image} alt={slide.imageAlt} />
          <img className="h-full min-h-0 w-full object-cover" src={slide.secondaryImage} alt={slide.secondaryImageAlt} />
          <img className="h-full min-h-0 w-full object-cover" src={slide.tertiaryImage} alt={slide.tertiaryImageAlt} />
        </div>
        <span className="absolute bottom-4 right-5 z-20 text-[8px] font-semibold tracking-[.16em] text-white/80">
          KYREONS / CHAPTER 04
        </span>
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      <img className="absolute inset-0 h-full w-full object-cover object-[center_44%] saturate-[.7] max-[650px]:object-[57%_center]" src={slide.image} alt={slide.imageAlt} />
      <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-black/10" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/35 to-transparent" />
      <HeroCopy
        slide={slide}
        className="absolute left-[7%] right-[5%] top-[51%] max-w-[600px] -translate-y-1/2 md:left-[9.3%] md:right-auto md:top-1/2"
      />
      <span className="absolute right-3 top-1/2 hidden -translate-y-1/2 [writing-mode:vertical-rl] text-[8px] tracking-[.2em] text-white/75 md:block">
        SEOUL Â· TOKYO Â· EVERYWHERE
      </span>
    </div>
  );
}

export default function HomePage({
  onOpen,
  onQuickAdd,
  initialFilter = 'all',
  wishlist,
  onToggleWishlist,
}) {
  const [filter, setFilter] = useState(initialFilter);
  const [sort, setSort] = useState('featured');
  const [showMore, setShowMore] = useState(false);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [heroSlideDirection, setHeroSlideDirection] = useState(1);

  useEffect(() => {
    const slideTimer = window.setInterval(() => {
      setHeroSlideDirection(1);
      setActiveHeroSlide((current) => (current + 1) % heroSlides.length);
    }, 6000);

    return () => window.clearInterval(slideTimer);
  }, []);

  const visibleProducts = useMemo(() => {
    let nextProducts = filter === 'all'
      ? [...products]
      : products.filter((product) => (
        product.category === filter || product.tags.includes(filter)
      ));

    if (sort === 'price-low') {
      nextProducts = nextProducts.sort((a, b) => a.price - b.price);
    }

    if (sort === 'price-high') {
      nextProducts = nextProducts.sort((a, b) => b.price - a.price);
    }

    return nextProducts;
  }, [filter, sort]);

  useEffect(() => {
    function handleCampaignFilter(event) {
      const campaignLink = event.target.closest('[data-campaign-filter]');
      if (!campaignLink) return;

      event.preventDefault();
      setShowMore(false);
      setFilter(campaignLink.dataset.campaignFilter);
      document.querySelector('#shop')?.scrollIntoView({ behavior: 'smooth' });
    }

    document.addEventListener('click', handleCampaignFilter);
    return () => document.removeEventListener('click', handleCampaignFilter);
  }, []);

  const shownProducts = showMore ? visibleProducts : visibleProducts.slice(0, 6);

  function updateFilter(value) {
    setShowMore(false);
    setFilter(value);
  }

  function updateSort(value) {
    setShowMore(false);
    setSort(value);
  }

  function selectHeroSlide(nextIndex) {
    const forwardDistance = (nextIndex - activeHeroSlide + heroSlides.length) % heroSlides.length;
    setHeroSlideDirection(forwardDistance === 0 || forwardDistance <= heroSlides.length / 2 ? 1 : -1);
    setActiveHeroSlide(nextIndex);
  }

  return (
    <>
      {/* Hero carousel: displays the four campaign slide layouts. */}
      <section
        id="home"
        className="relative isolate h-[min(690px,70vw)] min-h-[490px] overflow-hidden bg-neutral-900 text-white max-[900px]:h-[65vw] max-[900px]:min-h-[510px] max-[650px]:h-[calc(79svh-89px)] max-[650px]:min-h-[450px] max-[650px]:max-h-[620px]"
        aria-roledescription="carousel"
        aria-label="Kyreons campaign slides"
      >
        {heroSlides.map((slide, index) => {
          const isActive = index === activeHeroSlide;
          const isNext = (index - activeHeroSlide + heroSlides.length) % heroSlides.length === 1;
          const isPrevious = (activeHeroSlide - index + heroSlides.length) % heroSlides.length === 1;
          const offscreenDirection = isNext
            ? (heroSlideDirection > 0 ? 1 : -1)
            : isPrevious
              ? (heroSlideDirection > 0 ? -1 : 1)
              : 1;
          const slideStyle = {
            transform: isActive
              ? 'translate3d(0, 0, 0)'
              : `translate3d(${offscreenDirection * 100}%, 0, 0)`,
            opacity: isActive || isNext || isPrevious ? 1 : 0,
            transition: 'transform 900ms cubic-bezier(0.22, 0.61, 0.36, 1), opacity 700ms ease-in-out',
            zIndex: isActive ? 2 : isNext || isPrevious ? 1 : 0,
            willChange: 'transform, opacity',
          };

          return (
            <div
              key={slide.layout}
              aria-hidden={!isActive}
              inert={!isActive}
              className={`absolute inset-0 ${isActive || isNext || isPrevious ? '' : 'pointer-events-none'}`}
              style={slideStyle}
            >
              <HeroSlideView slide={slide} />
            </div>
          );
        })}

        <div className="absolute bottom-5 left-[7%] right-[7%] z-20 flex justify-between text-[7px] tracking-[.1em] text-white/80 md:left-[5.2%] md:right-[5.2%] md:text-[9px]">
          <span>{String(activeHeroSlide + 1).padStart(3, '0')} / 004</span>
          <span>DESIGNED FOR EVERYWHERE.</span>
        </div>

        <div className="absolute bottom-[52px] left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 md:bottom-6">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.image}
              className={`h-1.5 rounded-full transition-all ${index === activeHeroSlide ? 'w-6 bg-acid' : 'w-1.5 bg-white/60 hover:bg-white'}`}
              type="button"
              aria-label={`Show slide ${index + 1}`}
              aria-current={index === activeHeroSlide ? 'true' : undefined}
              onClick={() => selectHeroSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* Collection statement marquee */}
      <section className="flex h-[46px] items-center overflow-hidden bg-acid text-ink md:h-[57px]" aria-label="Kyreons collection statement">
        <div className="flex min-w-max animate-[marquee_32s_linear_infinite] items-center justify-around gap-6 font-display text-[9px] font-semibold tracking-[.13em] md:gap-10 md:text-[11px]">
          <span>MAKE ROOM TO BE YOURSELF</span>
          <i className="text-base not-italic">âœ³</i>
          <span>OFF DUTY, ON YOUR TERMS</span>
          <i className="text-base not-italic">âœ³</i>
          <span>MAKE ROOM TO BE YOURSELF</span>
          <i className="text-base not-italic">âœ³</i>
          <span>OFF DUTY, ON YOUR TERMS</span>
          <i className="text-base not-italic">âœ³</i>
        </div>
      </section>

      {/* Shop section: product filters, sorting, and product cards. */}
      <section id="shop" className="mx-auto max-w-[1450px] px-4 pb-16 pt-16 sm:px-8 md:pb-24 md:pt-24 lg:px-[5.2%]">
        <div className="flex items-end justify-between gap-5">
          <div>
            <p className="flex items-center gap-2 text-[9px] font-semibold tracking-[.17em] text-neutral-500">
              <span className="text-lime-600">âœ³</span> THE KYREONS UNIFORM
            </p>
            <h2 className="mt-3 font-display text-[clamp(37px,5.6vw,70px)] font-medium leading-none tracking-[-.07em] text-neutral-900 dark:text-white">
              Pieces with <span className="text-[#9ca87c] dark:text-acid">presence.</span>
            </h2>
          </div>
          <span className="hidden text-right text-[8px] font-medium tracking-[.12em] text-neutral-500 sm:block">
            DESIGNED TO BE WORN YOUR WAY&nbsp; â†˜
          </span>
        </div>

        <div className="mb-5 mt-8 flex flex-col items-start justify-between gap-4 border-b border-neutral-200 pb-3 dark:border-neutral-700 sm:flex-row sm:items-center">
          <div className="flex w-full items-center gap-5 overflow-x-auto sm:w-auto">
            {filters.map(([value, label]) => (
              <button
                key={value}
                className={`shrink-0 border-b py-1 text-[9px] font-semibold tracking-[.08em] transition-colors ${filter === value ? 'border-current text-neutral-900 dark:text-white' : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`}
                onClick={() => updateFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>

          <label className="relative flex shrink-0 items-center gap-2 text-[8px] tracking-[.08em] text-neutral-500" htmlFor="sort-select">
            SORT BY
            <select
              className="cursor-pointer bg-transparent py-1 text-[8px] tracking-[.08em] text-neutral-900 outline-none dark:text-white"
              id="sort-select"
              value={sort}
              onChange={(event) => updateSort(event.target.value)}
            >
              <option value="featured">FEATURED</option>
              <option value="price-low">PRICE: LOW TO HIGH</option>
              <option value="price-high">PRICE: HIGH TO LOW</option>
            </select>
          </label>
        </div>

        <ProductGrid
          products={shownProducts}
          onQuickAdd={onQuickAdd}
          onOpen={onOpen}
          wishlist={wishlist}
          onToggleWishlist={onToggleWishlist}
          featured={filter === 'all' && sort === 'featured'}
        />

        {visibleProducts.length > 6 && (
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 pt-5 text-[8px] font-semibold tracking-[.12em] text-neutral-500 dark:border-neutral-700">
            <span>
              {showMore
                ? 'THE FULL KYREONS EDIT'
                : `SHOWING 06 OF ${String(visibleProducts.length).padStart(2, '0')} PIECES`}
            </span>
            <button className="inline-flex items-center gap-2 border-b border-current pb-1 text-neutral-900 dark:text-white" onClick={() => setShowMore((value) => !value)}>
              {showMore ? 'SHOW LESS' : 'SEE MORE'} <ArrowOutwardIcon />
            </button>
            <span>TAKE YOUR TIME. FIND YOUR FIT.</span>
          </div>
        )}
      </section>

      {/* Oversized feature: campaign image and fit introduction. */}
      <section className="grid min-h-[490px] bg-neutral-100 dark:bg-neutral-900 md:grid-cols-[1.07fr_.93fr]">
        <div className="relative min-h-[400px] overflow-hidden md:min-h-[490px]">
          <img
            className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
            src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1300&q=85"
            loading="lazy"
            alt="Layered streetwear look with confident styling"
          />
          <span className="absolute bottom-4 left-4 text-[8px] font-semibold tracking-[.15em] text-white">STYLING NOTES â€” 001</span>
        </div>
        <div className="relative flex min-h-[430px] flex-col items-start justify-center px-[8%] py-12 md:px-[7%] lg:px-[10%]">
          <p className="flex items-center gap-2 text-[9px] font-semibold tracking-[.17em] text-neutral-500">
            <span className="text-lime-600">âœ³</span> MORE ROOM. MORE YOU.
          </p>
          <h2 className="my-6 font-display text-[clamp(59px,7vw,92px)] font-medium leading-[.88] tracking-[-.085em] text-neutral-900 dark:text-white">
            Good clothes<br />
            leave a little<br />
            <span className="text-[#9ca87c] dark:text-acid">space.</span>
          </h2>
          <p className="max-w-[340px] text-[13px] leading-[1.75] text-neutral-600 dark:text-neutral-300">
            Easy, oversized fits built for late starts, long walks and not having
            to explain your outfit to anyone.
          </p>
          <a href="#shop" className="mt-5 inline-flex items-center gap-3 border-b border-neutral-500 pb-1 text-[9px] font-semibold tracking-[.1em] text-neutral-900 dark:text-white">
            FIND YOUR FIT <ArrowOutwardIcon />
          </a>
          <div className="mt-10 text-[8px] font-medium tracking-[.12em] text-neutral-500">
            01 â€” CLOTHES FOR YOUR OWN KIND OF DAY.
          </div>
        </div>
      </section>

      {/* Campaign card section */}
      <CampaignCards />

      {/* Brand story section */}
      <section id="story" className="relative min-h-[430px] overflow-hidden bg-ink px-[7%] py-[73px] text-paper md:min-h-[485px] md:px-[9.3%] md:py-[94px]">
        <p className="flex items-center gap-2 text-[9px] font-semibold tracking-[.17em] text-white/75">
          <span className="h-[7px] w-[7px] rounded-full bg-acid" /> A NOTE FROM KYREONS
        </p>
        <h2 className="my-7 font-display text-[clamp(45px,11vw,70px)] font-medium leading-[.98] tracking-[-.075em] md:text-[clamp(43px,7vw,88px)]">
          Inspired by everywhere.<br />
          <span className="text-acid">Worn like it is yours.</span>
        </h2>
        <p className="max-w-[390px] text-[11px] leading-[1.7] text-neutral-300 md:text-xs">
          East Asian street style. Independent thinking. Clothes that feel like
          you had them all along.
        </p>
        <a href="#our-story" className="mt-5 inline-flex items-center justify-between gap-8 bg-paper px-4 py-4 text-[9px] font-bold tracking-[.12em] !text-[#191b17] transition-colors hover:bg-acid hover:!text-[#191b17]">
          READ OUR STORY <ArrowOutwardIcon />
        </a>
        <span className="absolute right-[7%] top-[72%] grid h-20 w-20 place-items-center rounded-full border border-white/50 text-center font-display text-sm leading-none md:right-[9%] md:top-1/2 md:h-36 md:w-36 md:-translate-y-1/2 md:text-2xl">KYR<br />Ã†ONS</span>
      </section>

      {/* Newsletter signup section */}
      <section className="grid grid-cols-1 items-center gap-6 border-b border-neutral-200 px-[7%] py-16 dark:border-neutral-700 md:grid-cols-[1fr_.8fr] md:gap-14 md:px-[9.3%] md:py-[90px]">
        <div>
          <p className="flex items-center gap-2 text-[9px] font-semibold tracking-[.17em] text-neutral-500">
            <span className="text-lime-600">âœ³</span> LETTERS FROM THE IN-BETWEEN
          </p>
          <h2 className="mt-3 font-display text-[42px] font-medium leading-none tracking-[-.07em] text-neutral-900 dark:text-white md:text-[clamp(35px,5vw,60px)]">
            Good things, <span className="text-[#9ca87c] dark:text-acid">occasionally.</span>
          </h2>
          <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">First looks, new chapters and the odd note worth opening.</p>
        </div>
        <Newsletter />
      </section>
    </>
  );
}
