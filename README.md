# CloudCart

Responsive React + Vite marketplace concept with Home, Contact, FAQ, and Refund pages. Custom CSS/SVG cloud illustrations, searchable and filterable products, product detail dialogs, persistent local cart, and editable content.

## Develop

Use Node.js 22 or newer. Run `npm install` then `npm run dev`. Build with `npm run build` and preview with `npm run preview`.

## Business configuration

Edit the products array and FAQ content in `src/main.jsx`, branding and contact details in that file, and styling in `src/style.css`. Products, prices, onboarding services, and refund terms are illustrative. Replace `hello@cloudcart.example` with your business address. Contact uses mailto and does not submit to a server. No payment processing, account delivery, authentication, seller management, or order backend is configured. Cart data stays in the visitor's browser. Connect a payment provider and order backend before taking real orders.

Routes use hashes so the static deployment supports direct navigation without server rewrites. Fonts use Google Fonts, with local system fallbacks. The provider marks and hero artwork are code-native graphics.

## Validation

Production build passed. Chromium checks passed at desktop (1440px), tablet (768px), and mobile (390px), with no horizontal overflow or browser errors. Provider filtering, search, cart quantities/totals, persisted cart, FAQ expansion, and all four routes were verified.

## AWS catalog update

The Home catalog includes all 23 requested AWS products with original SVG illustrations in `public/products/`. Edit the catalog in `src/aws-products.json`. Prices for 22 exact matches were read from https://bestcloudacc.com/product/buy-aws-account/ on November 15, 2026; the current displayed price is used. Provenance is recorded in `src/aws-price-reference.json`. The separate “AWS Ai Bedrock 10K RPM 256vCPUs” listing has no exact reference match and remains contact-for-pricing. Unpriced cart items are excluded from the displayed subtotal, with an explicit message. The existing example onboarding products remain available.

Browser verification covers all 23 product names/images, all 22 matched prices, unpriced product details, mixed priced/unpriced cart totals, and no horizontal overflow at 1440, 768, and 390 pixels.

## Dedicated product pages

- `#aws-standard`: 13 trial, compute, and credit listings.
- `#bedrock-api`: 10 Bedrock and Kiro listings, including the complete earlier 1024/1920-vCPU tiers.

Both pages reuse the Home product card/catalog component, support category filters and search, show original SVG artwork, and share product details/cart behavior. Header, footer, and Home collection links provide navigation. Prices were rechecked against the reference catalog on November 15, 2026. Browser checks verified all collection names/images/prices, filters, search, details, shared cart, mobile navigation, and no horizontal overflow at 1440, 1024, 768, and 390 pixels.

## Premium storefront design

The storefront uses a forest-green, ivory, and lime visual system with a custom glass-cloud SVG hero, editorial typography, updated collection and product cards, and consistent Contact/FAQ/Refund styling. Overrides are grouped in `src/premium.css`. Catalogs now support featured, ascending-price, descending-price, and alphabetical sorting; unpriced products remain at the end of price sorts. Catalog contents and prices remain unchanged.

Validation: production build; Chromium checks for both collection routes and all product names/images/prices, category filters, search, detail dialogs, shared cart, mobile menu, Home links; Home responsive layouts at 1440/1024/768/390/360px; price/name sorting, empty results/reset; Contact/FAQ/Refund layouts at desktop/tablet/mobile widths. No horizontal overflow or browser errors were observed.

## Cloud Service Accounts page

`#cloud-service-accounts` provides a grouped selector for all 23 requested account variants, a changing product illustration, current reference price, reference regular price where applicable, quantity controls (1–99), item totals, and variant-aware cart additions. It includes category preview thumbnails, product/delivery/terms tabs, and the full AWS catalog. Header, footer, and Home links lead to the new page.

Prices and regular prices for the 22 matching variants were refreshed from the supplied reference page on November 15, 2026. The unmatched 256-vCPU AI variant retains quote-only pricing. The cart quantity action accepts the requested quantity in one operation.

Validation: production build and browser checks for every variant's name/price/image, valid and invalid quantities, priced and unpriced cart totals, information tabs, navigation, and layouts at 1440/1200/1024/768/390/360px. Existing collection route/filter/search/cart checks passed again.

## Cloud Service Accounts providers

`#cloud-service-accounts` now contains 12 provider cards and 21 selectable options: Google Cloud (6), Azure (4), Amazon SES (2), and one account listing each for DigitalOcean, Linode, OVHcloud, Oracle Cloud, Hetzner, UpCloud, Atlantic, Alibaba Cloud, and AWS Marketplace. Data lives in `src/cloud-service-products.json`; page and styling are in `src/CloudServicesPage.jsx` and `src/cloud-services.css`. Each provider has original vector artwork in `public/products/cloud-*.svg`.

Pricing: Google Cloud “$300 + $10 Prepaid” uses the user's explicit $70 price, overriding the reference site's $85 price. Google Cloud “Pay As You Go 20 CAD Payment Required” is $55 from the exact reference variant; Hetzner is $55 from the product page metadata. Other options remain unpriced. The reference has a “10£ Payment Required” option that is not equated with the requested “$10 Payment Required” variant. Reference pages checked November 15, 2026: https://bestcloudacc.com/product/buy-google-cloud-account/ and https://bestcloudacc.com/product/buy-hetzner-account/. Provider charges and credit amounts are separate from account purchase prices.

The prior AWS configurator is preserved at `#aws-account-configurator` and linked from the provider page. Existing AWS Standard and Bedrock API pages remain intact. All provider variants use the existing cart and product detail dialog.

Validation: production build and Chromium checks for all 12 providers, 21 variants, prices, images, selection, quantities, invalid quantity blocking, mixed quote/priced cart totals, details, search/filter/reset, persistence, prior AWS configurator, AWS Standard catalog, and no horizontal overflow at 1440/1200/1024/768/390/360 pixels. No browser errors observed.

Provider page refinement: all 12 requested providers and 21 options were confirmed against the supplied list. Each card now shows the selected quantity and priced line total (or quote-required status), and has direct links to AWS Standard and Bedrock API. Exact-match price sources were rechecked on November 15, 2026 and recorded in `src/cloud-service-price-reference.json`. The existing explicit $70 prepaid GCP price is preserved. All provider/variant, image, quantity, quote/priced cart, persistence, search/filter/reset, AWS configurator regression, and responsive checks passed.


Latest Cloud Service Accounts request: all 12 providers and 21 options are present. Multi-variant cards now also show clickable option lists so Google Cloud, Azure, and Amazon SES choices are visible without opening a dropdown. The latest reference-pricing request updates the GCP prepaid listing from the prior configured $70 to the exact current reference price of $85; GCP 20 CAD payment-required and Hetzner remain $55. Other unmatched variants remain quote-only. Credit balances and provider funding requirements are not treated as purchase prices. Shopping links scroll to the provider collection while on this page.


## Telegram ordering

All product purchase buttons use the shared handler to navigate directly to `https://t.me/Eljh_Miller?text=...` in the current tab, including Home, AWS Standard, Bedrock API, Cloud Service Accounts, the AWS configurator, and product detail dialogs. The draft includes selected product/variant, quantity, listed unit price and line total, or quote-required status. Nothing is sent automatically. New purchase clicks do not modify the local cart; previously saved carts remain accessible and their discussion link also opens Telegram. Username and draft formatting live in `src/telegram.js`.


## AccsMarket price update

Cloud Service Accounts prices follow https://accsmarket.shop/cloud-service/, checked November 15, 2026. Twenty of the 21 options now have prices from the published comparison table. Former unspecified Standard Account listings use the reference’s explicitly named entry-level tier. Google Cloud $2,000 Credits Account remains quote-only because the reference instead lists $1,300; it is not treated as a match. Provenance and mapping notes are in `src/cloud-service-price-reference.json`. AWS Standard and Bedrock API prices are unchanged. Telegram purchase buttons retain the selected tier, quantity, and updated price.

## Reference-inspired Home page

Home now follows the layout and midnight-navy/electric-blue direction of the supplied destination https://accsmarket.shop/. The implementation uses original CloudCart copy and SVG artwork, 13 live provider cards, provider search, a comparison table, buying steps, FAQ accordions, and catalog/Telegram calls to action. Counts and prices are derived from the existing data: 44 account options and a $15 minimum. The previous detailed product catalog remains available in an expandable Home collection. Header/footer dark styling is scoped to Home through `body[data-page=home]`; other pages retain their established design.

Files: `src/HomePage.jsx`, `src/home.css`, and `public/cloud-network.svg`. Verified 13 cards/comparison rows, live counts, decoded images, provider search/reset and navigation, Telegram recipient/product draft, individual catalog/details, FAQ and mobile navigation, and no document overflow at 1440/1024/768/390/360 pixels. The comparison table scrolls within its own container on mobile. Production build passed.

Home comparison table logos: all 13 provider abbreviation badges now use locally served SVG/PNG logo assets in `public/logos/`, on light badge backgrounds for dark-table contrast. AWS Marketplace uses the AWS brand mark. Asset attribution is in `public/logos/SOURCES.md`. Logo images have empty alt text because the adjacent provider name already labels each link. Production build and browser image decoding, desktop/mobile layout, and provider navigation checks passed.

## Shared midnight design across all pages

`src/theme.css` applies the Home page's midnight navy surfaces, electric-blue controls, Space Grotesk headings, IBM Plex Mono details, borders, and readable text throughout AWS Standard, Bedrock API, Cloud Service Accounts, AWS account configurator, Contact, FAQ, Refund, product dialogs, cart, header, footer, and the expandable Home product collection. The body carries `midnight-site`; `data-page` remains available for Home-specific presentation. Existing content, data, prices, and Telegram ordering behavior are unchanged.

Validation: production build; all 8 routes checked at 1440, 1024, 768, 390, and 360 pixels without document overflow. Computed page/header/footer theme colors and dark modal/cart/form surfaces verified. Search, configurator tabs, FAQ expansion, form validation, and mobile navigation passed. The 20 reference prices and all 21 multicloud options were checked in cards, detail dialogs, quantity totals, and intercepted Telegram order drafts; images decoded and no browser errors were observed.

## Premium generated product artwork

Four original photorealistic 3D product images were created with the built-in image_gen tool: blue compute/cloud servers, amber cloud credits, violet AI processor, and a multicloud server network. Web assets are versioned JPEGs in `public/products/premium/` (1200×800, approximately 150–195 KB each). Full-resolution PNG originals are saved in `/Users/mobarak/cloudcart-artwork/`. Exact final prompts and generation metadata are saved in `public/products/premium/prompts.json`.

`src/PremiumArtwork.jsx` maps products to these visual categories and overlays the locally served provider logo and a readable HTML tier label. Integration covers Home provider cards, AWS Standard, Bedrock API, Cloud Service Accounts (including selection changes), the AWS configurator, collection hero cards, thumbnails, and product detail dialogs. `src/artwork.css` controls framing and overlays. Original SVG artwork remains in the project. Product data, prices, Telegram recipient, and ordering logic are unchanged.

Validation: production build; artwork/logo decoding across five shopping routes; 1440/768/390px layouts without horizontal overflow; category/variant/modal artwork mapping; Telegram selected variant/quantity/price draft checks using intercepted requests. No browser errors were observed.

## Simple flat product images

The current product visuals are eight flat, editable SVG illustrations in `public/products/flat/`: trial, compute, credits, Bedrock AI, Kiro development, SMTP email, marketplace, and cloud network. Solid colors and outline shapes replace the 3D renders throughout product cards, selections, collection hero art, thumbnails, and dialogs. Provider logos and tier labels remain separate overlays. `src/artwork-types.js` maps product metadata to the illustrations. Older raster assets remain stored but are no longer used by the product renderer. Product data, prices, and Telegram ordering are preserved.

Build and browser checks passed for decoded artwork/logo images, responsive layouts, product/variant/modal image mapping, and the Telegram order draft.

## Certificate-inspired product images and matching site palette

The supplied visual reference is implemented as original, editable SVG artwork: ivory paper, charcoal double frames, antique-gold rules and corner ornaments, serif provider names, burgundy account text and collection seals. There are 63 certificate-style assets in `public/products/certificates/`: 50 individual products/services plus 13 provider collections. Text comes from the actual catalog. Seals say “CloudCart Collection”; no age, verification, or provenance assurances are added. Branding is CloudCart.

`src/PremiumArtwork.jsx` displays the matching certificate; `src/artwork-types.js` resolves image paths, and catalog image references also point to certificates for selector thumbnails. `src/parchment.css` supplies the reference's ivory, brown, burgundy, and gold colors across Home, product collections, Cloud Service Accounts, configurator, Contact, FAQ, Refund, forms, dialogs, cart, header, and footer. Previous image/theme assets are retained. Products, prices, and Telegram ordering behavior are unchanged.

Validation: all 63 SVG assets return successfully; decoded image checks, eight routes at 1440/768/390/360px without document overflow, ivory page backgrounds, selector/modal certificate mapping, search, and intercepted Telegram recipient/quantity/price drafts passed without browser errors. Production build passed.

## Restore previous design

Restored the active Home/page components, artwork resolver, and catalog image paths to the midnight navy/electric-blue design and eight simple flat SVG product illustration styles from source commit `a543d0b3114504702b22c1b83a3a030391be0a87`. Certificate artwork and parchment CSS remain archived but are no longer referenced by the application. Catalog products, prices, provider logos, and Telegram ordering are retained.

## Reference-style blue cloud images with original provider logos

Product imagery now follows the supplied cobalt-blue cloud/console reference. One new unbranded background was created with the built-in image_gen tool, then original local provider logos and product-tier text are layered as separate web elements for accuracy and readability. The generated image includes no verification or age claims. The dark navy site design remains intact.

- Web background: `public/products/premium/cloud-console-v2.jpg`.
- Full-resolution original: `/Users/mobarak/cloudcart-artwork/cloud-console-v2.png`.
- Final prompt and generation details: `public/products/provider-art/prompt.json`.
- Thirteen standalone branded SVG exports, each embedding its background and original provider logo: `public/products/provider-art/*-cloud-v2.svg`.
- Download bundle: `public/products/provider-art/provider-images.zip`.

Provider marks are sourced as documented in `public/logos/SOURCES.md`; AWS Marketplace uses the AWS brand mark. Products, prices, and Telegram ordering are unchanged. Production build and browser checks passed for all 13 logo mappings and standalone exports, image loading, five shopping routes at desktop/tablet/mobile widths, and the selected variant/quantity/price Telegram draft without browser errors.

Product-logo integration refinement: product artwork now places logos directly on the blue cloud with a transparent wrapper, no border, no radius, and no shadow. Dark-background variants are stored in `public/logos/on-dark/`; AWS uses white letters with its original orange arrow. The Atlantic favicon's white backdrop is removed through a native SVG luminance-to-alpha filter. The 13 standalone SVG exports and ZIP were regenerated without the badge rectangle. The comparison table retains its existing original logo assets.

Validation: production build, computed transparency/border/shadow checks for all 13 product logos, decoded image assets, export markup, desktop/tablet/mobile shopping routes, and intercepted Telegram order drafts passed.

## Individual product pages and original articles

The site now provides 50 individual product/service pages, 13 provider collection pages, and an `#all-products` index. Product routes use `#product/<name-slug>-<id>`; provider routes use `#provider/<provider-slug>`. All direct URLs are listed in `public/product-page-index.json`. Home cards, provider comparison links, Cloud Service Accounts selections, product titles/images, and the AWS configurator link to the appropriate full page. Telegram purchase buttons retain their direct ordering behavior.

Each product has a newly authored description and a distinct editorial article of 137–157 words, with its own title, introduction, and three sections. The 50 articles contain 7,361 words in total. Provider pages have their own original overview guides. This copy was written from the supplied catalog facts; external reference-site articles were not copied or paraphrased. Numeric tiers and product names are treated as catalog labels, and account-specific conditions are identified for confirmation rather than asserted as verified capabilities.

Content files: `src/product-articles.json` (50 descriptions/articles), `src/provider-guides.json` (13 provider guides), `src/starter-products.json` (six illustrative onboarding services). Shared registry/routing lives in `src/catalog-data.js`; page components/styles are `src/ProductPages.jsx` and `src/product-pages.css`. Prices and image assets retain their existing sources. Product metadata updates each page title and description. Hash routes support direct reloads on the static host.

Validation: production build; 50 unique product URLs and descriptions/article titles, 150 distinct full section paragraphs, article completeness, prices, images, page titles, and desktop/mobile layouts; 13 provider routes/guides/option lists; direct reloads; Home, collection, and selected-variant links; quantity validation and priced/quote Telegram order drafts; no browser errors. Tablet checks cover all 63 new pages.

Platform labels now display original dark-background provider logos instead of abbreviation badges such as OCI/GCP/AZ. A reusable `src/PlatformLogo.jsx` component renders the transparent assets beside the provider name in all 13 Home cards and the four featured Cloud Service Accounts tiles. Styling is in `src/platform-logos.css`. Product artwork, provider names, prices, and page navigation are unchanged. Build and browser checks passed for logo decoding, Oracle label replacement, transparent backgrounds, mobile layout, and provider-page navigation.

## Contact details, refund policy, and delivery window

Contact now includes clickable phone `tel:+14582624274` displayed as +1 (458) 262-4274, and Telegram https://t.me/Eljh_Miller. Its form prepares a Telegram draft instead of using the former placeholder email address. Customer email is optional; the form does not store messages or send them automatically. Order-reference and account/API-key topics support delivery and refund inquiries without requesting credentials.

The Contact page includes the existing six refund sections, rendered from the same `src/RefundPolicyContent.jsx` component as the Refund page. No new automatic-refund entitlement or payment-processing behavior is introduced. Business contact values and delivery copy live in `src/contact-details.js`. Account access and any API key included in an order are stated as delivered in 30 minutes–1 hour after order and payment confirmation. This wording appears on Contact, Refund, FAQ, account product pages, and the AWS configurator. Onboarding service packages do not inherit an account-delivery promise.

Page/layout code: `src/ContactPage.jsx`, `src/contact-page.css`. Checks cover both contact links, matching refund text, responsive layouts, form draft contents and Telegram recipient, delivery wording across the affected pages, and production build. Telegram navigation was intercepted during testing; no messages or phone calls were sent.

## Global delivery notice

The delivery box is now rendered once in the shared page layout immediately below the header, so Home, all collections, product pages, provider pages, Contact, FAQ, Refund, and the configurator show the same message. Its heading is “Delivery: 30 minutes – 1 hour” and its body uses the shared account/API-key delivery wording from `src/contact-details.js`. The existing SVG clock icon and dark-blue box styling are preserved. Page-specific copies were removed to avoid duplication. The box describes account access and included API keys; it does not state a completion time for unrelated onboarding work.

Validation: production build and browser checks for exactly one visible delivery box, identical heading/body, SVG icon, and mobile layout across all 72 routes, plus desktop/tablet layout checks. No browser errors were observed.

Delivery notice placement update: the shared header-level banner was removed. The same box now appears before the primary action on each page: Home hero actions; product quantity/order controls; provider explore button; Contact form submission; FAQ contact button; Refund inquiry button; and AWS configurator order controls. Collection/catalog pages show it immediately before the product grid and purchase buttons. Nested Home/configurator catalogs suppress their extra copy so each route still has one delivery notice.

Production build and browser checks passed for exactly one notice, its position before the primary action/purchase controls, removal of the header-level banner, and mobile layouts across all 72 routes, with desktop/tablet visual checks.

Delivery notice placement: `src/DeliveryDock.jsx` now renders the box once in the shared layout as a fixed bottom-center notice on every page. Its SVG clock, text, and blue styling are preserved. The former action-adjacent notices have been removed. Responsive width and safe-area offsets keep it centered on mobile; a ResizeObserver reserves space below the footer based on the notice's actual height. Dialogs remain above the notice.

Checks: exactly one fixed, horizontally centered notice across all 72 routes; stable position during scrolling; desktop/tablet/mobile widths 1440/768/390/360px; footer clearance and dialog layering; production build. No browser errors were observed.


## Search indexing

The production canonical origin is `https://cloudssupply.site`, configured in `src/site-config.js`. `npm run build` produces pre-rendered HTML for all pages, products, and providers, plus:

- `/sitemap_index.xml` and `/sitemap.xml`: sitemap indexes
- `/pages-sitemap.xml`, `/providers-sitemap.xml`, `/products-sitemap.xml`
- `/robots.txt`, canonical tags, Open Graph metadata, and JSON-LD product metadata

Vercel serves the generated page directories directly using `vercel.json`; do not add a catch-all rewrite to the home page. Existing `/#product/...` and other legacy hash routes are converted to their matching clean paths in the browser.

After deployment, verify the domain in Google Search Console and submit `https://cloudssupply.site/sitemap_index.xml` under Sitemaps. Sitemap generation does not submit the site to Search Console or guarantee Google indexing. Adding a product to the catalog and its original article automatically adds its page and sitemap entry on the next build.


## On-page SEO

All 74 routes have an individual title, description, canonical URL, social preview metadata, and one main H1. Product copy for search is maintained in `src/product-seo.json`; main-page and provider metadata, breadcrumbs, collections, and Product/FAQ schema are assembled in `src/seo.js`. FAQ content is shared between the visible page and structured data through `src/faqs.js`. Category guidance and contextual links are in `src/CategoryGuide.jsx`.

`npm run build` pre-renders every route and runs the SEO audit automatically. After a build, `npm run check:seo` checks unique metadata, one H1 per route, canonical tags, original articles, product breadcrumbs, structured data, and internal-link destinations. The complete per-page review is saved to `reports/on-page-seo.csv`. Do not add fabricated reviews, stock availability, credit guarantees, or publication dates to structured data.


## Homepage keyword strategy

The AWS-focused homepage uses the approved title, description, H1, and six-section structure in `src/homepage-seo.js`. See `docs/homepage-seo.md` for keyword placement, landing-page links, structured data, and the current production canonical domain.


## Bedrock API-key landing page

`/aws-bedrock-api-key/` is a dedicated, pre-rendered page for API-key and account-access intent, linked from the homepage, Bedrock guide, and footer. Its approved search copy and FAQs live in `src/api-key-content.js`. It compares existing Bedrock account variations and makes API-key inclusion an order detail to confirm rather than inventing separate key-only products. See `docs/aws-bedrock-api-key-seo.md`. The sitemap and SEO report now cover 74 routes.


## Provider product-page SEO

The approved metadata, headings, keyword strategy, and introductory copy for 12 cloud providers are in `src/provider-seo.json`. Provider collections use that copy while individual account variations retain distinct SEO metadata and original articles. See `docs/provider-product-seo.md` for canonical URLs and primary keywords. The build audit checks these provider-page contracts.


## Product variant SEO

All 45 supplied account-variant SEO records are applied by product ID in `src/product-seo.json`; six existing service packages retain their prior SEO. Titles are complete search titles including the brand suffix. Product pages use the configured H1 and description while preserving original articles, catalog IDs, URLs, and prices. See `docs/product-variant-seo.md` and `reports/product-variant-seo.csv` for the full mapping.


## Google Search Console

Google HTML-file verification is configured in `public/googlee9c6c6adb26b90ba.html`. Keep it deployed at the site root. Finish ownership verification in the matching Google Search Console property, then submit `sitemap_index.xml`. See `docs/google-search-console.md`.


## Production SEO audit and QA

The current source contains 13 provider collections and 51 product pages (45 account variations plus 6 illustrative service packages), giving 64 catalog records and 74 public URLs. Cart/checkout are noindex. There are 71 commercial keyword mappings; support pages use non-commercial intent. See `seo/SEO-FINAL-REPORT.md`, `seo/SEO-LAUNCH-CHECKLIST.md`, and `seo/PRODUCT-SEO-REPORT.csv`.

Run `npm run check:syntax`, `npm test`, `npm run build`, then `npm run preview`. The preview serves real 404s and text compression. With the preview running, execute `npm run test:browser`, `node scripts/http-qa.mjs`, and `npm run test:lighthouse`. Lighthouse/browser QA uses Chrome on this Mac; no payment or Telegram message is sent. Run `node scripts/write-seo-reports.mjs` after audits to refresh the evidence-based reports.

Preview builds automatically use noindex when VERCEL_ENV is preview; VITE_SITE_NOINDEX=true is an explicit alternative. The original .site Google verification file is retained. A real Google HTML meta token can be supplied through GOOGLE_SITE_VERIFICATION at build time. No fake DNS/token values or indexing claims are generated.

The old Vercel alias redirects public URLs to the production origin; its noindex cart and checkout remain available so existing browser-local drafts are not stranded by the origin change. Provider prices and wallet receiving addresses remain unchanged.

## CloudsSupply Studio redesign

The current storefront uses an original dark editorial design with obsidian backgrounds, sapphire panels and violet accents, shared across all pages. Product artwork has separate compute, credits and AI treatments in `public/products/studio/`, with original provider SVG logos layered in HTML.

`src/studio-design.css` contains the shared responsive design system. `src/StudioMotion.jsx` adds progressive scroll reveals, pointer-aware card lighting and reading progress. Ambient motion and pointer effects respect reduced-motion and touch preferences. Server-rendered content remains visible without JavaScript.

See `docs/studio-redesign.md` for implementation/validation notes and `docs/studio-artwork.md` for the built-in image-generation prompt set and saved assets. Run `node scripts/studio-motion-qa.mjs http://localhost:4181` against the production preview for motion and payment-panel checks. Historical Lighthouse reports predate this design; new homepage reports are in `seo/lighthouse/studio/`.

## Merchant catalog — November 27, 2026

The current complete catalog has 14 providers and 68 variations, supplied by the merchant. Source prices are independently recorded in `tests/fixtures/merchant-catalog-2026-11-27.json`; review `seo/CATALOG-PRICE-UPDATE.csv` for the full price table. Current inventory is 82 provider/product records and 92 public URLs plus two noindex checkout/cart routes. Old unlisted products and starter packages are retired; 48 changed/retired URLs are permanently redirected using `src/catalog-redirects.json` and `vercel.json`. Historical source is preserved under `seo/baseline/`.

`node scripts/merchant-catalog-qa.mjs <origin>` checks every live variation price, all legacy redirects, restored cart prices and old-order payment safeguards. `node scripts/write-seo-reports.mjs` builds current catalog reports without treating historical Lighthouse evidence as a new-release measurement. HTTP report freshness is tied to the source content-manifest hash.

## Obsidian Platinum redesign

Original CloudsSupply control-room identity, self-hosted Manrope/Geist typography, custom SVG infrastructure/credit/AI artwork, responsive split product tiles and accessible pausable motion. See [design notes](design/obsidian/DESIGN-NOTES.md). Rebuild the original vector-derived WebP assets with `node scripts/create-platinum-art.mjs`. Run `node scripts/obsidian-qa.mjs http://localhost:4181` for motion, no-JS and nine-width checks. Production remains on the existing Vercel `website` project and `https://cloudssupply.site/`; all catalog and payment data are unchanged.
