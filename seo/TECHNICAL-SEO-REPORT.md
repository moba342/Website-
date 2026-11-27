# Current technical SEO report

Canonical origin: https://cloudssupply.site/.

- 14 providers and 68 variations; 82 catalog records.
- 92 indexable routes plus 2 noindex utility routes.
- Static metadata, schema identity, image assets, canonical URLs, sitemap membership and internal links: PASS.
- Maximum crawl depth: 2; orphan pages: 0.
- Current local HTTP/content crawl: NOT TESTED.
- Current production HTTP/content crawl: PASS.
- 48 renamed/retired listing redirects are configured in vercel.json and tested by merchant-catalog-qa.mjs.

Current HTTP evidence is accepted only when its manifest hash matches the current route/content manifest. Unknown routes must return genuine 404; cart and checkout remain noindex. Field Core Web Vitals, Google index membership and actual search rankings are NOT TESTED.
