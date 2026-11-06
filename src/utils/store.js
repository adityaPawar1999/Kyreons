const productBatchFiles = import.meta.glob('../../productsJS/*.json', { eager: true, import: 'default' });
const productData = Object.entries(productBatchFiles)
  .sort(([left], [right]) => left.localeCompare(right, undefined, { numeric: true }))
  .flatMap(([path, batch]) => {
    const batchNumber = path.match(/batch[_-](\d+)/i)?.[1] || '1';
    return Array.isArray(batch)
      ? batch.map((product) => ({ ...product, __batchName: `Batch-${batchNumber}` }))
      : [];
  });

const reviewFiles = import.meta.glob('../../reviews/*.json', { eager: true, import: 'default' });
const reviewsByProductId = Object.fromEntries(
  Object.entries(reviewFiles).map(([path, reviews]) => [
    path.split('/').pop().replace(/\.json$/, ''),
    Array.isArray(reviews) ? reviews : [],
  ]),
);

const imageFallback = '/placeholder.svg';

function normalizeImagePath(path, batchName, product) {
  if (path && typeof path === 'object') path = path.url || path.src || path.path;
  if (typeof path !== 'string' || !path.trim()) return '';
  const value = path.trim().replace(/\\/g, '/');
  if (/^(https?:|data:|blob:)/i.test(value)) return value;

  // Product Images is configured as Vite's public directory, so its contents
  // are served from the site root (for example, /atlas-tee/front.jpg).
  let relativePath = value
    .replace(/^\.\//, '')
    .replace(/^\/+/, '')
    .replace(/^Product(?:%20|\s)*Images\//i, '');

  // Catalog batches use older image paths without their new batch directory.
  // Resolve those paths into the matching public image batch.
  if (!/^Batch-\d+\//i.test(relativePath)) {
    const imageBatch = /astronaut-cat/i.test(product?.id || '') ? 'Batch-2' : batchName;
    relativePath = `${imageBatch}/${relativePath.replace(/^batch-\d+\//i, '')}`;
  } else {
    relativePath = relativePath.replace(/^batch-(\d+)\//i, 'Batch-$1/');
  }
  return `/${relativePath.split('/').map(encodeURIComponent).join('/')}`;
}

function readProductImages(product, batchName) {
  const imageValue = product.images
    ?? product.productImages
    ?? product.productimages
    ?? product.imageUrls
    ?? product.image_urls
    ?? product.image;
  const paths = Array.isArray(imageValue)
    ? imageValue
    : typeof imageValue === 'string'
      ? [imageValue]
      : imageValue && typeof imageValue === 'object'
        ? Object.values(imageValue).flat(Infinity)
        : [];
  const validPaths = paths.map((path) => normalizeImagePath(path, batchName, product)).filter(Boolean);
  const firstImage = validPaths[0] || imageFallback;
  return Array.from({ length: 4 }, (_, index) => validPaths[index] || firstImage);
}

const seenIds = new Set();
export const products = productData
  .filter((product) => product && typeof product === 'object')
  .map(({ __batchName, ...product }, index) => ({
    ...product,
    id: String(product.id || `product-${index + 1}`),
    name: String(product.name || 'Kyreons garment'),
    category: String(product.category || 't-shirts'),
    tags: Array.isArray(product.tags) ? product.tags.filter((tag) => typeof tag === 'string') : [],
    description: String(product.description || ''),
    rating: Number(product.rating) || 0,
    reviews: reviewsByProductId[String(product.id || `product-${index + 1}`)]
      ?? (Array.isArray(product.reviews) ? product.reviews.filter((review) => review && typeof review === 'object') : []),
    details: Array.isArray(product.details) ? product.details : [],
    sizes: Array.isArray(product.sizes) && product.sizes.length ? product.sizes : ['S', 'M', 'L', 'XL'],
    colors: Array.isArray(product.colors) && product.colors.length
      ? product.colors
      : [{ name: 'Default', hex: '#d5d5d0' }],
    images: readProductImages(product, __batchName || 'Batch-1'),
    price: Number(product.price) || 0,
    stock: product.stock && typeof product.stock === 'object' ? product.stock : null,
    batchNumber: Number(__batchName?.match(/\d+/)?.[0]) || 1,
  }))
  .map((product) => ({
    ...product,
    rating: product.reviews.length
      ? product.reviews.reduce((total, review) => total + (Number(review.rating) || 0), 0) / product.reviews.length
      : product.rating,
  }))
  .filter((product) => {
    if (seenIds.has(product.id)) return false;
    seenIds.add(product.id);
    return true;
  })
  .sort((left, right) => {
    const leftDate = Date.parse(left.postedDate) || 0;
    const rightDate = Date.parse(right.postedDate) || 0;
    return rightDate - leftDate;
  });

export function formatMoney(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}
