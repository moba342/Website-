# Automated test report

| Check | Status | Evidence |
|---|---|---|
| Production build and initial HTML | PASS | npm run build; evidence/static-audit.json |
| 74 public + 2 utility routes | PASS | evidence/http-local.json |
| Unique metadata/H1/canonical/schema | PASS | scripts/audit-seo.mjs |
| 71 unique commercial primary mappings | PASS | KEYWORD-MAPPING.csv |
| Product keywords and FAQ parity | PASS | PRODUCT-SEO-REPORT.csv |
| Broken internal links and orphan pages | PASS | Maximum depth 2; static-audit.json |
| Responsive routes | PASS | 76 routes × 7 widths: 320, 375, 390, 768, 1024, 1440, 1920 |
| Variation, cart, checkout, contact/navigation | PASS | evidence/browser-qa.json; receipt intercepted, no payment/message sent |
| Cart normalization/quotes/storage/network receipts | PASS | npm test: 10 tests in tests/checkout.test.mjs |
| JavaScript syntax | PASS | npm run check:syntax; JSX parsed in production build |
| TypeScript and configured lint pipeline | NOT TESTED | JS/JSX repository, no TypeScript or existing lint configuration; no framework migration |
| Final live responses | PASS | evidence/http-live.json |

No tests sign in as a customer, transfer cryptocurrency, or submit Telegram messages. The contact form opens a customer-sent Telegram draft; it does not create a server support ticket. Browser-local payment drafts still require manual merchant verification.

Secondary keyword coverage is a phrase-level editorial diagnostic rather than a density target. Notes: none. No keyword stuffing was added to force support-page matches.
