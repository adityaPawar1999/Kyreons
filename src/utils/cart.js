import { products } from './store.js';

export function normalizeCart(cart) {
  if (!Array.isArray(cart)) return [];

  return cart.flatMap((item) => {
    const product = products.find((entry) => entry.id === item?.id);
    const quantity = Number(item?.quantity);
    if (!product || !Number.isInteger(quantity) || quantity < 1) return [];

    const size = product.sizes.includes(item.size) ? item.size : product.sizes[1] || product.sizes[0];
    const color = product.colors.find((entry) => entry.name === item.color)?.name || product.colors[0].name;
    return [{ ...item, id: product.id, size, color, key: `${product.id}::${size}::${color}`, quantity }];
  });
}
