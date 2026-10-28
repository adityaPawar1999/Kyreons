# Kyreons storefront

A responsive React 19 storefront built with Vite, Tailwind CSS v4, and Material UI v9 icons. Product copy, prices, variants, and each product's four image paths live in the single `products.json` catalog.

## Run locally

Install the dependencies and start Vite:

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Create a production build with `npm run build`.

## Change products and photography

Edit `products.json`. Each product uses four entries in its `images` array. Use hosted image URLs or local paths under `Product Images/`, for example `/Product Images/atlas-tribal-tee/a1.png`. Vite serves that folder as the public asset directory; image paths can also use the older `/ProductImages/...` form.

Product `category` values drive the garment filters. Add `oversized` or `handcrafted` to the `tags` array to show the product in those collections. Set sizes and color names and hex values on each product. To show inventory counts, add a `stock` object keyed by size (for example, `"stock": { "S": 4, "M": 0 }`) to the product in `products.json`; sizes missing from that object are treated as out of stock. Homepage campaign photos and copy are in `src/pages/HomePage.jsx`.

The T-shirts link in the navigation opens the dedicated shirt collection at `#shirts`. Its filters use product tags such as `graphic`, `essential`, `long-sleeve`, `handcrafted`, and `oversized`. Update social profile links in `src/components/navbar/Navbar.jsx` and `src/components/layout/SiteFooter.jsx` if your handles differ.

Pages are in `src/pages/`; reusable navigation, product, cart, layout, and button components are in `src/components/`. The cart hook and catalog helpers are in `src/hooks/` and `src/utils/`. Global and component styling is grouped in `src/styles/`. Tailwind is configured through Vite in `vite.config.js`, with shared font and color tokens in `src/styles/tailwind.css`.

## Store interactions

- Browse, filter, and sort products.
- Open a product page, select one of its four photos, color, and size, then add it to the bag.
- Change quantities in the bag. Cart and theme preferences persist in browser storage.
- The newsletter form displays a demo confirmation. It is not connected to an email service.
- Checkout displays a prompt to connect a payment provider before taking orders.
