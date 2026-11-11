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

Product `category` values drive the garment filters. Add `oversized` or `handcrafted` to the `tags` array to show the product in those collections. Set sizes and color names and hex values on each product. Sizes in the product catalog are always available. Homepage campaign photos and copy are in `src/pages/home/HomePage.jsx`.

The T-shirts link in the navigation opens the dedicated shirt collection at `#shirts`. Its filters use product tags such as `graphic`, `essential`, `long-sleeve`, `handcrafted`, and `oversized`. Update social profile links in `src/components/navbar/Navbar.jsx` and `src/components/layout/SiteFooter.jsx` if your handles differ.

Pages are in `src/pages/`; reusable navigation, product, cart, layout, and button components are in `src/components/`. The cart hook and catalog helpers are in `src/hooks/` and `src/utils/`. Global and component styling is grouped in `src/styles/`. Tailwind is configured through Vite in `vite.config.js`, with shared font and color tokens in `src/styles/tailwind.css`.

## Store interactions

- Browse, filter, and sort products.
- Open a product page, select one of its four photos, color, and size, then add it to the bag.
- Change quantities in the bag. Cart and theme preferences persist in browser storage.
- Newsletter signup stores normalized email addresses in Firestore's separate `newsletterSubscribers` collection without requiring sign-in. Contact submissions are saved to `contactMessages` and appear in the dashboard's Messages tab; neither form requires a customer account.
- Shipping and customer policies are linked from the footer. The storefront currently supports delivery addresses in India only.
- Checkout saves an order to Firebase and displays an invoice preview; payment processing is not connected.

## Firebase orders

Order checkout writes customer contact and delivery details, item snapshots, totals, and a `pending_payment` status to the Firestore `orders` collection. The browser signs in anonymously with Firebase Auth and the order is associated with that anonymous user ID. Customers can see their saved orders from **My orders** in the footer, in the same browser profile. Clearing browser data or switching devices loses access to that anonymous identity; add a permanent sign-in flow before offering cross-device order history.

1. Create a Firebase project and register a web app. Copy its web app configuration into a local `.env` using the variable names in `.env.example`.
2. In Firebase Console, enable **Authentication > Sign-in method > Google**, **Email/Password** (for customer accounts), and **Anonymous** (for guest order identity). Add your storefront host to Authentication's authorized domains, and create a **Cloud Firestore** database.
3. Publish the rules from `firestore.rules` in the Firestore Rules tab.
4. Add the same `VITE_FIREBASE_*` variables to your hosting provider and redeploy.

The checkout saves an order but does not process payment. Customer profiles are stored in `customerProfiles/{userId}` and each customer can read or update only their own profile. The Firestore rules scope order reading to the authenticated owner and prevent client updates or deletion. Firebase web config values are public client identifiers; Firestore security rules provide access control.
