# Primary domain migration

Canonical production origin: https://cloudssupply.site/

The owner requested the bare domain instead of www. Both Vercel production projects deployed commit 9cc6507 successfully. The primary website project serves cloudssupply.site directly; www.cloudssupply.site redirects permanently (308) to cloudssupply.site. Paths and query parameters are preserved.

Validation: production build, static SEO audit, Schema.org checks and all 10 unit tests passed. Live HTTP/content audit passed all 76 routes, 25 assets and 74 sitemap URLs with zero failures; missing routes return 404. Browser smoke tests passed five routes at seven widths plus navigation, variations, cart and checkout. No payment or message was sent.

Evidence: evidence/http-live.json, evidence/browser-qa-live.json, evidence/page-manifest.json, KEYWORD-MAPPING.csv and URL-REDIRECT-MAPPING.csv.

Historical Lighthouse reports retain their original www test URLs and were not rerun for this hostname-only migration. Earlier baseline evidence is retained unchanged as history.

Google Search Console: use a Domain property for cloudssupply.site or add the URL-prefix property https://cloudssupply.site/. Submit https://cloudssupply.site/sitemap_index.xml. Ownership and submissions were not performed in this migration; existing www URL-prefix ownership does not by itself confirm ownership of the bare-domain URL-prefix property. Actual Google indexing has not been confirmed.
