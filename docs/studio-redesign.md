# CloudsSupply Studio redesign

An original React storefront with pre-rendered HTML for every public route. The buyawsaccounts.com reference informed interaction types (hover lighting, scrolling motion and pointer effects), not copied page artwork, text or source code.

## Design

Dark editorial layouts, obsidian backgrounds, sapphire product stages and blue-to-violet calls to action, distinct compute/credit/AI artwork, compact provider directory, a consistent system for collections, providers, articles, contact, FAQs, refund policy, cart and checkout. The existing CloudsSupply logo is retained.

## Motion

StudioMotion progressively enhances server-rendered content with IntersectionObserver reveals, requestAnimationFrame pointer lighting and a scroll progress indicator. Cards have hover lighting and elevation. Hero artwork, orbital details and labels move gently. Mouse effects require a fine pointer. Reduced-motion preferences disable ambient animation, reveals and pointer glow. No custom cursor, scroll hijacking or large animation dependency.

## Preservation

Canonical production origin: https://cloudssupply.site/. Existing routes, metadata, keyword mappings, product IDs, specifications, prices, article copy, provider logos, payment addresses, merchant conversion, browser-local carts and manual payment review remain intact. The homepage has original new content, preserves assigned SEO terms and retains visible FAQ/schema parity.

## Validation

npm test; npm run build; node scripts/browser-qa.mjs http://localhost:4181; node scripts/studio-motion-qa.mjs http://localhost:4181. Live HTTP and browser checks use the actual production URL after Vercel deploys. Evidence is saved in seo/evidence/. Historical Lighthouse reports refer to the previous design and are not new-design scores.

## Completed local checks

- Production build, all 74 public route SEO checks and Schema.org checks: PASS.
- Catalog and checkout unit tests: 10/10 PASS.
- Full browser audit: 76 routes at 320, 375, 390, 768, 1024, 1440 and 1920 pixels, zero browser/overflow errors. Saved in seo/evidence/studio/full-route-responsive-qa.json. After the final contrast/accessibility correction, representative smoke and payment tests also passed.
- Motion, reduced-motion, touch, BEP20 rendering and narrow payment layout: PASS.
- Homepage Lighthouse: mobile Performance 94; desktop Performance 100. Accessibility, Best Practices and SEO 100 on both. These are local production-preview lab measurements, not field Core Web Vitals or scores for every route. The first concurrent run is preserved separately as a diagnostic baseline.

Production checks are recorded in seo/evidence/http-live.json and seo/evidence/browser-qa-live.json after the Vercel release is ready.

## First production verification

The Studio release deployed to the existing website and buyaws-account Vercel production projects successfully. Production HTTP/content checks passed 76 routes, 28 assets, 74 sitemap URLs and a genuine 404. Production browser smoke checks passed five representative routes at seven widths plus the complete manual-checkout flow. Social sharing and structured-data images are now connected to the same new artwork used on visible product pages.

## Nocturne dark theme update

The current design uses obsidian backgrounds (#080e1b), sapphire surfaces, ice-blue text and violet highlights across all routes. Card lighting follows pointer position; supported desktop browsers show a rotating luminous border on hover or keyboard focus. Click halos are short-lived, capped at five, never intercept events, and are cleaned up on route changes. Inputs, text areas and selects do not trigger halos. Reduced-motion preferences suppress halos and ambient animation; touch interfaces skip cursor tracking and animated border layers. QR codes deliberately retain white backing for readability.

The prior Studio Lighthouse reports describe the earlier light release. Dark-release lab results, when run, are saved separately under seo/lighthouse/nocturne/.

Nocturne validation: production build, schema/SEO generation and all 10 unit tests passed. All 76 routes passed seven viewport widths; final representative browser, checkout and effects checks passed. Click halo creation/cleanup, viewport-edge clipping, pointer-following card illumination, animated border and reduced-motion suppression were verified in the browser. No payment or message was sent. New local homepage Lighthouse: mobile Performance 93, desktop Performance 100; Accessibility, Best Practices and SEO 100 for both. These measurements apply to the dark homepage production preview, not every page or real-user Core Web Vitals.
