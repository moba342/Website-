# Mobile Lighthouse report

Actual Lighthouse reports, not estimated scores. Local environment: production preview at http://localhost:4173, Chrome on macOS, Node 24.22.3. Tests run serially to avoid parallel browser load; scores are a lab snapshot and can vary. Target: Performance 90+, Accessibility 95+, Best Practices 95+, SEO 100.

## Local production preview

| Page | Performance | Accessibility | Best Practices | SEO | LCP | CLS | Saved report |
|---|---|---|---|---|---|---|---|
| home | 100 | 100 | 100 | 100 | 0.90 s | 0.000 | [HTML](lighthouse/local-mobile-home.report.html) |
| category | 100 | 100 | 100 | 100 | 0.91 s | 0.000 | [HTML](lighthouse/local-mobile-category.report.html) |
| provider | 96 | 100 | 100 | 100 | 2.78 s | 0.000 | [HTML](lighthouse/local-mobile-provider.report.html) |
| product | 96 | 100 | 100 | 100 | 2.81 s | 0.000 | [HTML](lighthouse/local-mobile-product.report.html) |
| products | 100 | 100 | 100 | 100 | 0.90 s | 0.000 | [HTML](lighthouse/local-mobile-products.report.html) |

## Live production

| Page | Performance | Accessibility | Best Practices | SEO | LCP | CLS | Saved report |
|---|---|---|---|---|---|---|---|
| home | 100 | 100 | 100 | 100 | 1.13 s | 0.000 | [HTML](lighthouse/live-mobile-home.report.html) |
| category | 100 | 100 | 100 | 100 | 0.95 s | 0.000 | [HTML](lighthouse/live-mobile-category.report.html) |
| provider | 99 | 100 | 100 | 100 | 2.14 s | 0.000 | [HTML](lighthouse/live-mobile-provider.report.html) |
| product | 99 | 100 | 100 | 100 | 2.14 s | 0.000 | [HTML](lighthouse/live-mobile-product.report.html) |
| products | 100 | 100 | 100 | 100 | 1.10 s | 0.000 | [HTML](lighthouse/live-mobile-products.report.html) |

A temporary uncompressed local preview produced reproducibly lower mobile scores on product/provider pages; text compression was added to represent actual Vercel delivery, and the complete suite was rerun. Intermediate reports are retained under baseline/intermediate-uncompressed-*.json.

The baseline local mobile homepage was measured at Performance 74, Accessibility 100, Best Practices 96 and SEO 100; its raw files are in baseline/. Fonts, logo/favicon and responsive image delivery were optimized, and accessible heading/button labeling was corrected. INP is a field responsiveness metric and is not inferred from Lighthouse TBT. No real-user Core Web Vitals pass is claimed. See evidence/lighthouse-local.json and evidence/lighthouse-live.json for scores, metrics and remaining opportunities.
