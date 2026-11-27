# CloudsSupply — current merchant catalog

Canonical origin: https://cloudssupply.site/. Merchant price list supplied 2026-11-27; owner confirmed complete catalog replacement.

14 providers, 68 priced account variations and 82 catalog records. Ten other public pages produce 92 indexable URLs; cart/checkout remain noindex.

Prices match tests/fixtures/merchant-catalog-2026-11-27.json and CATALOG-PRICE-UPDATE.csv. Retired introductory services and unlisted providers are removed from the active assortment; previous data is preserved in baseline/catalog-before-2026-11-27-price-update.json. Renamed or retired URLs have permanent redirects; old carts use current prices and report removed items. Existing payment drafts retain their original amounts and require support review if the catalog changed.

Merchant model/version labels are displayed as supplied and must be confirmed for the actual order; no official model availability, numeric TPM limits or provider endorsement was invented. The duplicated GCP F5.2 label was normalized once.

| Item | Status | Evidence / remaining action |
|---|---|---|
| Product SEO | PASS | 68 product pages; product descriptions, guides, FAQs and prices match the merchant catalog. |
| Primary & Secondary Buying Keywords | PASS | 89 unique primary mappings and three secondaries per commercial page. |
| SEO-Friendly URLs | PASS | 48 legacy redirects; URL-REDIRECT-MAPPING.csv. |
| Technical SEO | PASS | Static and current-manifest HTTP evidence; field Core Web Vitals not tested. |
| Structured Data | PASS | Catalog-backed prices and visible FAQ/schema parity. |
| Production Build | PASS | 92 public + 2 utility routes. |
| Automated Tests | PASS | 12 unit tests, responsive routes, all variation prices and draft/cart safeguards. |
| Mobile Lighthouse Testing | NOT TESTED | Historical reports retained; no current-release score claimed. |
| Desktop Lighthouse Testing | NOT TESTED | Historical reports retained; no current-release score claimed. |
| Live Deployment | PASS | Current source/content manifest matches production. |
| Hosting Redirect Optimization | PASS | Canonical domain and listing redirects verified live. |
| Final Live Technical SEO Audit | PASS | LIVE-SEO-AUDIT.md and current HTTP evidence. |
| Google Search Console Verification | MANUAL ACTION REQUIRED | Owner previously reported verification; current account not checked. |
| XML Sitemap Submission | MANUAL ACTION REQUIRED | https://cloudssupply.site/sitemap_index.xml; no new submission performed. |
| Request Indexing | MANUAL ACTION REQUIRED | Owner URL Inspection; no actual indexing claim. |

The older buyaws-account.vercel.app address currently reports DEPLOYMENT_NOT_FOUND and its project is not found in the connected Vercel team. The main-domain production audit is explicitly scoped to cloudssupply.site; full-alias failures are retained in evidence/merchant-catalog/http-with-retired-alias.json. No replacement legacy project was created.

Historical audit/performance evidence is retained under baseline/, lighthouse/ and earlier release folders. Baseline SEO-AUDIT-BEFORE.md remains unchanged. Google indexing, Search Console submission and current-release field performance are not claimed.
