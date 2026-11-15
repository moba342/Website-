# CloudCart — AWS & Cloud Accounts

Responsive React + Vite storefront with product and provider pages, original product articles, and direct Telegram ordering.

## Links

- [GitHub repository](https://github.com/moba342/Website-)
- [Live website](https://cloudcart-store-mobarak.giftedcondor8.chatgpt.site/)
- [AWS Standard](https://cloudcart-store-mobarak.giftedcondor8.chatgpt.site/#aws-standard)
- [Bedrock API](https://cloudcart-store-mobarak.giftedcondor8.chatgpt.site/#bedrock-api)
- [FAQ](https://cloudcart-store-mobarak.giftedcondor8.chatgpt.site/#faq)
- [Refund Policy](https://cloudcart-store-mobarak.giftedcondor8.chatgpt.site/#refund)
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


## Search indexing

The production canonical origin is `https://www.cloudssupply.site`, configured in `src/site-config.js`. `npm run build` produces pre-rendered HTML for all pages, products, and providers, plus:

- `/sitemap_index.xml` and `/sitemap.xml`: sitemap indexes
- `/pages-sitemap.xml`, `/providers-sitemap.xml`, `/products-sitemap.xml`
- `/robots.txt`, canonical tags, Open Graph metadata, and JSON-LD product metadata

Vercel serves the generated page directories directly using `vercel.json`; do not add a catch-all rewrite to the home page. Existing `/#product/...` and other legacy hash routes are converted to their matching clean paths in the browser.

After deployment, verify the domain in Google Search Console and submit `https://www.cloudssupply.site/sitemap_index.xml` under Sitemaps. Sitemap generation does not submit the site to Search Console or guarantee Google indexing. Adding a product to the catalog and its original article automatically adds its page and sitemap entry on the next build.


## On-page SEO

All 74 routes have an individual title, description, canonical URL, social preview metadata, and one main H1. Product copy for search is maintained in `src/product-seo.json`; main-page and provider metadata, breadcrumbs, collections, and Product/FAQ schema are assembled in `src/seo.js`. FAQ content is shared between the visible page and structured data through `src/faqs.js`. Category guidance and contextual links are in `src/CategoryGuide.jsx`.

`npm run build` pre-renders every route and runs the SEO audit automatically. After a build, `npm run check:seo` checks unique metadata, one H1 per route, canonical tags, original articles, product breadcrumbs, structured data, and internal-link destinations. The complete per-page review is saved to `reports/on-page-seo.csv`. Do not add fabricated reviews, stock availability, credit guarantees, or publication dates to structured data.


## Homepage keyword strategy

The AWS-focused homepage uses the approved title, description, H1, and six-section structure in `src/homepage-seo.js`. See `docs/homepage-seo.md` for keyword placement, landing-page links, structured data, and the confirmed decision to retain the working `.site` canonical domain.


## Bedrock API-key landing page

`/aws-bedrock-api-key/` is a dedicated, pre-rendered page for API-key and account-access intent, linked from the homepage, Bedrock guide, and footer. Its approved search copy and FAQs live in `src/api-key-content.js`. It compares existing Bedrock account variations and makes API-key inclusion an order detail to confirm rather than inventing separate key-only products. See `docs/aws-bedrock-api-key-seo.md`. The sitemap and SEO report now cover 74 routes.


## Provider product-page SEO

The approved metadata, headings, keyword strategy, and introductory copy for 12 cloud providers are in `src/provider-seo.json`. Provider collections use that copy while individual account variations retain distinct SEO metadata and original articles. See `docs/provider-product-seo.md` for canonical URLs and primary keywords. The build audit checks these provider-page contracts.
