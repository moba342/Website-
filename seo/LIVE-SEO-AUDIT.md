# Final live SEO audit

Target: https://www.cloudssupply.site/. Status: PASS.

76 intended pages were fetched from production. Failed page/HTTP checks: 0. Every title, description, H1, primary/secondary keyword, visible-content hash and JSON-LD hash is compared with the validated build, with image alt checks and linked asset requests. Unknown route response: 404; noindex: true.

The production crawl checks 200 responses, initial-HTML canonical origin, social page type, robots directives, complete visible content, JSON-LD, primary/secondary phrases, sitemap XML membership and origin, verification endpoints, real 404s and alternate-host redirect chains. HTTP-only apex requests use Vercel’s HTTPS upgrade followed by the apex-to-www redirect; this two-hop platform chain is measured, not hidden. Local content/schema/link/keyword checks are separate and are cross-checked against the same production artifact by the browser/live test suite. Raw response summaries: evidence/http-live.json. Mobile/desktop lab results are in LIGHTHOUSE-MOBILE-REPORT.md and LIGHTHOUSE-DESKTOP-REPORT.md.

- https://buyaws-account.vercel.app/: 308 → https://www.cloudssupply.site/ → 200
- http://cloudssupply.site/: 308 → https://cloudssupply.site/ → 308 → https://www.cloudssupply.site/ → 200
- https://cloudssupply.site/: 308 → https://www.cloudssupply.site/ → 200
- http://www.cloudssupply.site/: 308 → https://www.cloudssupply.site/ → 200
- https://cloudssupply.site/product/aws-32-vcpu-103/?utm_source=seo-test: 308 → https://www.cloudssupply.site/product/aws-32-vcpu-103/?utm_source=seo-test → 200
- https://buyaws-account.vercel.app/product/aws-32-vcpu-103/?utm_source=seo-test: 308 → https://www.cloudssupply.site/product/aws-32-vcpu-103/?utm_source=seo-test → 200
- https://www.cloudssupply.site/home/?utm_source=seo-test: 308 → https://www.cloudssupply.site/?utm_source=seo-test → 200
- https://www.cloudssupply.site/product/aws-32-vcpu-103: 308 → /product/aws-32-vcpu-103/ → 200

Google index membership, rankings, Search Console verification and sitemap submission are not established by this crawl.
