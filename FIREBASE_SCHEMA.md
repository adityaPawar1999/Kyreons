# Firebase / Firestore schema

This documents the Firestore data paths used by the Kyreons storefront. The configured Firebase project ID in `src/services/firebase.js` is `kyreons`.

## Collection and document paths

| Collection path | Document ID | Child collection | Purpose |
| --- | --- | --- | --- |
| `orders` | Firestore-generated ID | — | Checkout orders |
| `newsletterSubscribers` | Normalized email (trimmed, lowercase) | — | Newsletter subscriptions |
| `customerProfiles` | Firebase Auth UID | — | Customer details and cart |
| `customerWishlists` | Firebase Auth UID | — | Saved product IDs |
| `review/{productId}/reviews` | Firestore-generated ID | `reviews` under product ID | Ratings and comments for a product |

Review path example: `review/kyreons-sunburst-tee/reviews/{autoId}`. The `productId` is the same string ID used by that product in `products.json`. Firestore can store the nested review documents even when the parent `review/{productId}` document has no fields or has not been created.

## Document fields

### `orders/{autoId}`

Created when checkout is submitted. `orderNumber` is a separate human-readable value such as `KYR-1790000000000`; it is not the Firestore document ID.

```js
{
  userId: string,                 // Firebase Auth UID
  email: string,
  orderNumber: string,
  customer: {
    name: string,
    firstName: string,
    lastName: string,
    phone: string,
    address: string,
    address2: string,
    city: string,
    region: string,
    postalCode: string,
    country: string
  },
  items: [{
    productId: string,
    name: string,
    price: number,
    quantity: number,
    size: string,
    color: string
  }],
  subtotal: number,
  total: number,
  currency: "INR",
  status: "pending_payment",
  paymentStatus?: "pending" | "received" | "failed" | "refunded",
  currentCity?: string,
  estimatedDeliveryAt?: string,   // YYYY-MM-DD, shown to the customer
  returnEstimatedAt?: string,     // YYYY-MM-DD, shown during a return
  statusUpdatedAt?: Timestamp,
  createdAt: Timestamp
}
```

Dashboard admins update order tracking with one of these `status` values: `pending_payment`, `order_received`, `payment_received`, `in_progress`, `dispatched`, `delivered`, `return_requested`, `return_in_progress`, `returned`, or `cancelled`. The customer's My Orders view displays the order/payment states, the latest city, delivery estimate, and return estimate when present. Only a signed-in user with the Firebase `admin` custom claim can update tracking fields.

### `newsletterSubscribers/{normalizedEmail}`

```js
{
  email: string,                  // lowercase, trimmed; also the document ID
  createdAt: Timestamp
}
```

### `customerProfiles/{uid}`

Profile fields are optional until supplied by the customer. Signup and profile editing write these fields; cart synchronization also stores the cart here.

```js
{
  name?: string,
  firstName?: string,
  lastName?: string,
  phone?: string,
  address?: string,
  address2?: string,
  city?: string,
  region?: string,
  postalCode?: string,
  country?: string,
  email?: string,
  cart?: [{                       // cart line shape used by the storefront
    id: string,                   // product ID from products.json
    size: string,
    color: string,
    key: string,                  // `${id}::${size}::${color}`
    quantity: number
  }],
  updatedAt?: Timestamp
}
```

The cart is an array stored on the profile document, not a separate Firestore collection. The exact cart line can include extra storefront fields; the application validates that `cart` is an array.

### `customerWishlists/{uid}`

```js
{
  productIds: string[],           // product IDs from products.json
  updatedAt: Timestamp
}
```

### `review/{productId}/reviews/{autoId}`

Each rating/comment is its own document, so one customer can post multiple reviews for a product. Rating-only posts use an empty `comment` string.

```js
{
  userId: string,                 // Firebase Auth UID
  name: string,
  rating: number,                 // integer from 1 to 5
  comment: string,                // empty or up to 1,000 characters
  date: string,                   // YYYY-MM-DD
  createdAt: Timestamp
}
```

## Access notes for a separate dashboard

The storefront Firestore rules are designed for customer access, not an admin dashboard. Based on the rules used by this project:

- Orders can be created by an authenticated user and read by their owner or listed/read by an admin. Only admins can update the tracking fields documented above.
- Customer profiles and wishlists can be read/written by their owner; collection listing is denied.
- Newsletter subscriptions can be submitted/updated, but reads are denied.
- Product reviews are publicly readable; creating a review requires a signed-in user. Parent review documents are not writable.

Because the dashboard needs to list all customers, orders, and newsletter subscribers, do not weaken these rules or put Firebase Admin credentials in a browser app. Build the dashboard with a trusted server using the Firebase Admin SDK, protect its endpoints with admin authentication, and let that server read Firestore. A browser-only dashboard using the existing customer rules will not be able to list all records.

Firebase Authentication accounts are stored in Firebase Authentication, not in a Firestore collection. An admin dashboard that needs to list accounts must use the Admin SDK's Authentication API on the trusted server.

## Source references

- Collection paths and reads/writes: `src/services/firebase.js`
- Order fields: `src/pages/checkout/CheckoutPage.jsx`
- Product IDs: `products.json`
- Firestore security rules: Firebase Console → Firestore Database → Rules
