import { useMemo, useState } from 'react';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import ProductGrid from '../../components/product/ProductGrid.jsx';
import NotFoundPage from '../not-found/NotFoundPage.jsx';
import { products } from '../../utils/store.js';

const collectionSettings = {
  shirts: {
    title: 'Shirts for your own world.',
    eyebrow: 'THE KYREONS TEE DEPARTMENT',
    description: 'Graphic hits, everyday essentials and oversized fits. Find the one that feels like you.',
    imageAlt: 'A relaxed everyday graphic tee',
    matches: (product) => product.category === 't-shirts',
    filters: [
      ['graphic', 'Graphic'],
      ['essential', 'Essentials'],
      ['long-sleeve', 'Long sleeve'],
      ['handcrafted', 'Hand finished'],
      ['oversized', 'Oversized'],
    ],
  },
  oversized: {
    title: 'Room to move. Space to be.',
    eyebrow: 'THE OVERSIZED EDIT',
    description: 'Relaxed silhouettes with a little more room, made for moving through the day your way.',
    imageAlt: 'An oversized streetwear look',
    matches: (product) => product.tags.includes('oversized'),
    filters: [
      ['graphic', 'Graphic'],
      ['handcrafted', 'Hand finished'],
    ],
  },
  handcrafted: {
    title: 'Finished by hand.',
    eyebrow: 'THE HANDCRAFTED EDIT',
    description: 'Thoughtful details and individually finished pieces that make the everyday feel personal.',
    imageAlt: 'A handcrafted graphic tee detail',
    matches: (product) => product.tags.includes('handcrafted'),
    filters: [
      ['oversized', 'Oversized'],
      ['graphic', 'Graphic'],
    ],
  },
};

const sortProducts = (items, sort) => {
  if (sort === 'price-low') return [...items].sort((a, b) => a.price - b.price);
  if (sort === 'price-high') return [...items].sort((a, b) => b.price - a.price);
  return items;
};

export default function CollectionPage({ type, onOpen, onQuickAdd, wishlist, onToggleWishlist }) {
  const settings = collectionSettings[type];
  const [activeFilter, setActiveFilter] = useState('all');
  const [sort, setSort] = useState('featured');
  const [showAll, setShowAll] = useState(false);

  const collectionProducts = useMemo(
    () => products.filter(settings?.matches ?? (() => false)),
    [settings],
  );

  const visibleProducts = useMemo(() => {
    const filtered = activeFilter === 'all'
      ? collectionProducts
      : collectionProducts.filter((product) => product.tags.includes(activeFilter));

    return sortProducts(filtered, sort);
  }, [activeFilter, collectionProducts, sort]);

  if (!settings) return <NotFoundPage />;

  const shownProducts = showAll ? visibleProducts : visibleProducts.slice(0, 6);
  const leadImage = collectionProducts[0]?.images[0] || '/placeholder.svg';
  const collectionName = type === 'shirts' ? 'T-SHIRTS' : type.toUpperCase();

  const filters = [
    ['all', type === 'shirts' ? 'All tees' : 'All pieces', collectionProducts.length],
    ...settings.filters.map(([tag, label]) => [
      tag,
      label,
      collectionProducts.filter((product) => product.tags.includes(tag)).length,
    ]).filter(([, , count]) => count > 0),
  ];

  return (
    <section className="mx-auto w-full max-w-[1450px] px-4 pb-16 pt-5 sm:px-8 lg:px-[5.2%] lg:pb-24 lg:pt-8">
      <nav className="mb-6 flex items-center gap-2 text-[9px] font-semibold tracking-[0.14em] text-neutral-500" aria-label="Breadcrumb">
        <a className="transition-colors hover:text-neutral-900 dark:hover:text-white" href="#home">HOME</a>
        <span aria-hidden="true">/</span>
        <span className="text-neutral-900 dark:text-white">{collectionName}</span>
      </nav>

      <header className="grid items-center gap-6 pb-7 md:grid-cols-[1.05fr_.95fr] md:gap-10 md:pb-10">
        <div>
          <p className="mb-4 flex items-center gap-2 text-[9px] font-semibold tracking-[0.17em] text-neutral-500">
            <span className="text-lime-600" aria-hidden="true">✳</span>
            {settings.eyebrow}
          </p>
          <h1 className="max-w-2xl font-display text-5xl font-medium leading-[.95] tracking-[-.075em] text-neutral-900 dark:text-white sm:text-6xl lg:text-7xl">
            {settings.title}
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-7 text-neutral-600 dark:text-neutral-300">
            {settings.description}
          </p>
        </div>

        <div className="relative h-56 overflow-hidden bg-neutral-200 md:h-72">
          <img className="h-full w-full object-cover" src={leadImage} alt={settings.imageAlt} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          <span className="absolute bottom-4 right-4 text-right font-display text-4xl font-semibold leading-[.85] tracking-[-.08em] text-white sm:text-5xl">
            KYREONS<br />{collectionName}
          </span>
          <span className="absolute left-4 top-4 text-[8px] font-semibold tracking-[.16em] text-white/85">
            THE COLLECTION / 001
          </span>
        </div>
      </header>

      <div className="mb-6 flex flex-col gap-4 border-y border-neutral-200 py-4 dark:border-neutral-700 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-5 overflow-x-auto" aria-label="Filter products">
          {filters.map(([value, label, count]) => (
            <button
              key={value}
              type="button"
              className={`shrink-0 border-b pb-2 text-[9px] font-semibold uppercase tracking-[.1em] transition-colors ${activeFilter === value ? 'border-neutral-900 text-neutral-900 dark:border-white dark:text-white' : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`}
              onClick={() => {
                setActiveFilter(value);
                setShowAll(false);
              }}
            >
              {label} <span className="ml-1 text-neutral-400">{count}</span>
            </button>
          ))}
        </div>

        <label className="flex shrink-0 items-center gap-2 text-[8px] font-semibold tracking-[.12em] text-neutral-500">
          SORT BY
          <select
            className="cursor-pointer bg-transparent py-1 text-[9px] text-neutral-900 outline-none dark:text-white"
            value={sort}
            onChange={(event) => {
              setSort(event.target.value);
              setShowAll(false);
            }}
          >
            <option value="featured">FEATURED</option>
            <option value="price-low">PRICE: LOW TO HIGH</option>
            <option value="price-high">PRICE: HIGH TO LOW</option>
          </select>
        </label>
      </div>

      <ProductGrid
        products={shownProducts}
        onOpen={onOpen}
        onQuickAdd={onQuickAdd}
        wishlist={wishlist}
        onToggleWishlist={onToggleWishlist}
      />

      {visibleProducts.length > 6 && (
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 pt-5 text-[8px] font-semibold tracking-[.12em] text-neutral-500 dark:border-neutral-700">
          <span>
            {showAll ? `ALL ${collectionName}` : `SHOWING 06 OF ${String(visibleProducts.length).padStart(2, '0')}`}
          </span>
          <button
            type="button"
            className="inline-flex items-center gap-2 border-b border-current pb-1 text-neutral-900 dark:text-white"
            onClick={() => setShowAll((value) => !value)}
          >
            {showAll ? 'SHOW LESS' : 'SEE MORE'} <ArrowOutwardIcon fontSize="small" />
          </button>
          <span>TAKE YOUR TIME. FIND YOUR FIT.</span>
        </div>
      )}
    </section>
  );
}
