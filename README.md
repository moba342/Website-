# CloudCart — AWS & Cloud Accounts

Responsive React + Vite storefront with product and provider pages, original product articles, and direct Telegram ordering.

## Links

- [Live website](https://cloudcart-store-mobarak.giftedcondor8.chatgpt.site/)
- [All product pages](https://cloudcart-store-mobarak.giftedcondor8.chatgpt.site/#all-products)
- [Cloud Service Accounts](https://cloudcart-store-mobarak.giftedcondor8.chatgpt.site/#cloud-service-accounts)
- [Contact](https://cloudcart-store-mobarak.giftedcondor8.chatgpt.site/#contact)
- [Telegram — @Eljh_Miller](https://t.me/Eljh_Miller)

The live website currently uses owner-only access.

## Run locally

Install Node.js 22 or later, then run:

```sh
npm ci
npm run dev
```

Build for deployment:

```sh
npm run build
npm run preview
```

Deploy the generated `dist/` directory to a static host. Hash-based routes support direct navigation without custom server rewrite rules.

## Included

- Home, AWS Standard, Bedrock API, Cloud Service Accounts, account configurator, Contact, FAQ, and Refund pages.
- 50 individual product/service pages and 13 provider pages with original descriptions and articles.
- Search, filters, price sorting, product quantities, and original provider logos.
- A fixed bottom-center delivery notice on every page.
- Phone contact: +1 (458) 262-4274.
- Contact and ordering buttons prepare Telegram drafts; messages are sent by the visitor.

## Edit the catalog and content

- `src/aws-products.json`: AWS account products and prices.
- `src/cloud-service-products.json`: other cloud providers and variants.
- `src/starter-products.json`: six illustrative onboarding services.
- `src/product-articles.json`: original individual product descriptions and articles.
- `src/provider-guides.json`: original provider overviews.
- `src/catalog-data.js`: shared catalog and route definitions.
- `src/contact-details.js`: contact details and delivery wording.
- `src/RefundPolicyContent.jsx`: shared refund text.
- `src/PremiumArtwork.jsx`, `src/PlatformLogo.jsx`: artwork and logo presentation.
- `src/DeliveryDock.jsx`: bottom-center delivery notice.
- `public/`: locally served artwork, logo assets, downloads, and product page index.

The storefront does not process payments, send messages automatically, or deliver credentials. Confirm commercial terms, account availability, and provider eligibility with the seller. Some onboarding service products and refund terms remain illustrative. Preserve the provider trademark and asset attribution recorded under `public/logos/`.

## Validation

Production build passed. Browser checks covered product/provider routes, original content completeness, search, filters, quantities, Telegram drafts, responsive layouts, and the delivery notice across all 72 routes. Test interactions did not send messages or place calls.
