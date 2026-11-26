# Technical SEO report

Canonical production origin: https://www.cloudssupply.site/. Inventory: 13 providers, 51 product pages, 64 catalog records and 74 public indexable URLs. Two noindex utility routes are separate.

## Implemented

- Shared origin and brand configuration in src/site-config.js; initial HTML canonical, robots, social metadata and JSON-LD on every generated route.
- Every commercial page is mapped in src/page-seo.json, src/provider-seo.json or src/product-seo.json, accessed through src/seo-keywords.js.
- Server-rendered page content is hydrated instead of discarded. Cart and order drafts load after hydration, preserving saved browser state.
- Every product is linked through crawlable HTML; provider pages expose all account variation guides. Maximum measured crawl depth: 2. Orphan pages: 0.
- Filters/search remain browser state, not indexable generated filter URLs. Query parameters canonicalize to the clean route. Utility routes and unknown pages have noindex directives.
- Existing descriptive URL slugs are retained. No artificial product-ID removal or unsupported new category is introduced.
- Production sitemaps contain only canonical public pages. No invented lastmod dates: the catalog lacks reliable per-record content-modification timestamps.
- The old Vercel alias retains noindex cart/checkout routes so existing browser-local order drafts remain usable; public alias routes redirect to the canonical host. Vercel keeps real static 404 behavior; the local production preview also serves a genuine 404. No catch-all rewrite was introduced.
- Preview builds set noindex through VERCEL_ENV=preview or VITE_SITE_NOINDEX=true. The Sites audience remains owner-private. Keep preview deployment protection enabled in Vercel.
- Original typography and colors are retained. Active fonts are self-hosted, original brand artwork is cropped to remove the obsolete .store suffix, and responsive WebP assets replace heavy inline/logo and JPEG transfers.

## Hosting

Social metadata now uses website for collection/home pages and product only for an individual account Product.

Source: vercel.json. Vercel project: website, linked to moba342/Website- main. The existing authenticated account was used to add cloudssupply.site to the same project with a 308 redirect to www.cloudssupply.site. The response and live TLS/redirect chain are saved in evidence/apex-project-assignment.json and evidence/http-live.json. Do not disable certificate validation.

Local HTTP audit: PASS. Final production HTTP audit: PASS. Production field Core Web Vitals are NOT TESTED; lab metrics are documented separately.

If DNS becomes misconfigured: open Vercel team mo-ba2 → website → Settings → Domains, inspect both hostnames, and apply the exact A/CNAME values Vercel displays at your DNS provider. Verify the domain and wait for automatic TLS issuance. Do not move unrelated domains or change mail records.

## Remaining limits

No Google ranking, indexing, Search Console ownership, or field INP outcome is inferred from HTML checks. The longest title is 65 characters; descriptions are at most 160 characters. Editorial length guidance is not treated as an artificial pass/fail limit for specific technical labels. A passed JSON-LD or Lighthouse audit does not guarantee rich results. Existing sample service prices remain illustrative and require confirmation before payment.
