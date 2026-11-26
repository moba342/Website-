# SEO baseline — 2026-11-27 (Asia/Dhaka)

Audit scope: the supplied repository and public responses from https://www.cloudssupply.site/ before implementation. Evidence: `baseline/*.http.txt`, `baseline/http-summary.json`, original SEO configuration snapshots, and the per-record baseline crawl.

## Actual inventory

- 13 provider collections, 24 AWS variations, 21 other cloud variations, 6 starter service packages: 51 product pages and 64 catalog records.
- 10 other public pages make 74 intended indexable URLs; cart and checkout are noindex utilities.
- The requested former target of 14 providers / 68 variations / 82 records is not present. No products or prices will be invented.

## Prioritized findings

| Priority | Finding | Planned action |
|---|---|---|
| Critical | The required production origin is www.cloudssupply.site, but canonical URLs, structured-data URLs and sitemaps point to buyaws-account.vercel.app. | Restore one shared production origin and validate initial HTML. |
| Critical | HTTPS apex cloudssupply.site fails certificate hostname validation. | Configure host redirects in source; document DNS/certificate action if hosting access is unavailable. Do not bypass TLS validation. |
| High | Seven commercial catalog records lack explicit primary and secondary mappings (AWS provider and six sample services). | Assign unique buying/comparison intent to all 71 commercial pages. |
| High | Homepage advertises 34 providers; repository has 13. | Derive the count from catalog data. |
| High | Product schema emits Offer for illustrative service prices even though checkout requires scope/price confirmation. | Omit unsupported offers for sample/quote-only listings. |
| High | Provider variations expose only the current selected guide; products require clear server-rendered discovery paths. | Add crawlable variation guide links. |
| Medium | Product pages have original articles but no visible product-specific FAQ section or shared FAQ schema. | Add accurate per-product questions based on catalog scope. |
| Medium | Homepage, AWS provider, configurator, Bedrock collection and key landing page have overlapping broad intent. | Assign explicit separate scope; record remaining semantic overlap without claiming ranking data. |
| Medium | Outdated .store brand appears in labels, metadata and contact text. | Standardize textual brand to CloudsSupply while preserving the supplied graphic logo. |
| Medium | Several CSS @imports fetch multiple remote font families; favicon embeds about 899 KB of raster data. | Self-host the active fonts, optimize the favicon and image delivery. |
| Medium | Full client re-render replaces server HTML; no skip link is present. | Hydrate static HTML with safe browser-state loading and add accessible navigation. |
| Low | Numeric suffixes exist in otherwise descriptive, established product URLs. | Retain stable URLs; record unchanged URLs instead of triggering an unnecessary migration. |

## Baseline observations

The canonical www homepage returns 200; a nonexistent URL returns a genuine 404. HTTP www redirects to HTTPS. The apex HTTPS failure prevents a valid completed redirect chain. These checks do not establish Google indexing or Core Web Vitals field metrics. Baseline Lighthouse scores, when measured, are recorded separately with actual reports.
