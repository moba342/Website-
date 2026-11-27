# Marketplace validation — 2026-11-27

- Production build, schema vocabulary and static SEO validation: PASS. 92 public pages plus two noindex utility pages; all 68 priced Product records retained.
- Authoritative catalog, articles, provider guides, SEO configuration, routing/redirects, wallets and cart/order modules: unchanged from the preceding production release. See evidence/data-integrity.json.
- Full responsive browser sweep: all 94 routes at 320, 375, 390, 430, 768, 1024, 1280, 1440 and 1920px, no layout/browser errors. Full evidence preserved in full-responsive-browser.json; a final smoke repeated five page types after the last Details-link fix.
- All 68 independent Add to cart actions: PASS for product identity, current price and quantity. All 14 provider grids, Details URLs, search, reset, category counts, sorting, mobile dropdown, dynamic entrance, reduced-motion changes and no-JavaScript visibility: PASS.
- Dedicated layout assertions: all 68 cards at nine widths have no clipped prices/buttons, correct column counts and horizontally aligned controls. The 320px five-digit-price issue was fixed. Desktop, tablet and mobile screenshots were captured and inspected.
- Single-product quantity, related-product navigation, the Details button's article jump, cart totals, checkout, receipt validation and contact links: PASS. No payment or message was sent.
- Existing unit tests: 12 PASS. Syntax checks and production JSX compilation: PASS.

Local Lighthouse audit results and the main-domain deployment check are recorded with the release evidence. Lab measurements are not field Core Web Vitals or guarantees about every route. Google index membership is not claimed.

Production release: product redesign b6d8626 plus footer spacing 8aec2a0 are deployed on the existing Vercel website project. The main domain passes all 94 HTTP/content routes, 27 tested assets, 92 sitemap URLs and a genuine 404. Live browser smoke passes five page types at nine widths, cart/checkout and receipt validation. The added 32–64px page-to-footer gap was verified at all nine widths on the live Bedrock page.

Targeted local production-build Lighthouse: AWS provider page on mobile — performance 96, accessibility 100, best practices 100, SEO 100; AWS 32-vCPU product page on desktop — 100 in all four categories. These are scoped lab results, not homepage/all-page scores or field metrics. Raw reports and summary are under evidence/.
