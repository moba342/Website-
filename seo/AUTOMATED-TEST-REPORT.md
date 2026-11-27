# Current automated checks

- Build and static SEO checks: PASS; 92 public routes, 68 product pages.
- Catalog/payment unit tests: 12 PASS in the merchant catalog update. The merchant fixture independently records all 68 supplied prices.
- Responsive browser audit: PASS; latest saved scope 94 routes at 9 widths. Full current product-layout audit is retained under ../design/marketplace/evidence/full-responsive-browser.json.
- Merchant variation UI, legacy redirects, cart repricing and old payment-draft protection: local PASS; production PASS.
- Local HTTP: NOT TESTED; production HTTP: PASS.

No cryptocurrency transfer or contact message was sent. Stored order drafts retain their original amounts; changed or retired records require support review rather than silently changing a prior payment instruction.
