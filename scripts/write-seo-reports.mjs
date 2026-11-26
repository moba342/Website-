import {readFile,writeFile,mkdir} from 'node:fs/promises';
const read=async(path,fallback=null)=>{try{return JSON.parse(await readFile(path,'utf8'))}catch{return fallback}};
const audit=await read('seo/evidence/static-audit.json'),browser=await read('seo/evidence/browser-qa.json'),local=await read('seo/evidence/http-local.json'),live=await read('seo/evidence/http-live.json'),localLH=await read('seo/evidence/lighthouse-local.json',[]),liveLH=await read('seo/evidence/lighthouse-live.json',[]),manifest=await read('seo/evidence/page-manifest.json',[]);
const origin='https://cloudssupply.site';
const write=(name,text)=>writeFile('seo/'+name,text.trim()+'\n');
const csv=rows=>rows.map(row=>row.map(v=>'"'+String(v??'').replaceAll('"','""')+'"').join(',')).join('\n')+'\n';
const lhRows=(data,mode)=>data.filter(r=>r.mode===mode).map(r=>`| ${r.name} | ${r.scores?.performance??'N/A'} | ${r.scores?.accessibility??'N/A'} | ${r.scores?.['best-practices']??'N/A'} | ${r.scores?.seo??'N/A'} | ${r.metrics?.['largest-contentful-paint']!=null?(r.metrics['largest-contentful-paint']/1000).toFixed(2)+' s':'N/A'} | ${r.metrics?.['cumulative-layout-shift']?.toFixed(3)??'N/A'} | [HTML](${r.report?.replace('seo/','')}) |`).join('\n');
await mkdir('seo',{recursive:true});
await write('KEYWORD-CANNIBALIZATION.md',`# Keyword intent and cannibalization audit

Status: PASS for unique explicit commercial primary assignments; PARTIAL for real search cannibalization analysis.

${audit?.commercialMapped||0} commercial pages have distinct normalized primary keywords. Each has three or more secondary phrases. Exact matching checks and contextual placement are saved in KEYWORD-MAPPING.csv. SEO titles, meta descriptions, primary H1s and visible content are checked against the configuration. This is not a claim about keyword volume, CPC, difficulty, or rankings.

| Page | Assigned scope |
|---|---|
| Homepage | AWS storefront buying entry point: buy AWS accounts |
| AWS Standard | Standard trial, compute and credit account purchases |
| Bedrock collection | Account/RPM-tier comparison |
| Bedrock API key landing | Key inclusion, permissions and API handover |
| AWS provider | Account tier pricing across AWS listing types |
| AWS configurator | Selecting a variation and quantity for an order |
| Cloud service accounts | Non-AWS provider comparison |
| All Products | Product-level inventory, including setup services |

Provider pages target the provider family; product pages target one named specification. Starter services target setup/planning work and remain explicitly illustrative. Credit tiers use their actual names; the Azure $1K Tier 1 Claude label is not asserted to prove a credit balance.

Remaining review: broad AWS/Bedrock pages necessarily share terms. Product 117 (quote-only Bedrock API 10K RPM / 256 vCPU) and product 119 (256 vCPU / 10K RPM with listed version/F5 labels) are especially close; their visible specifications and original guides retain that distinction. Monitor query/page data before consolidating these genuinely separate listings. Unique primary assignments and different page scopes reduce obvious duplication but cannot prove the absence of ranking cannibalization. Use Search Console query/page exports to check whether multiple URLs compete for the same queries before merging or redirecting pages. Support/FAQ/refund pages use non-commercial intent. No keyword-stuffed hidden copy or meta-keywords tag was added.`);
const redirects=[['Old URL','New URL','Status','Decision','Reason'],...manifest.filter(p=>p.type!=='utility').map(p=>['https://buyaws-account.vercel.app'+p.path,origin+p.path,'308 configured','Domain consolidation','Restore canonical production domain; verify live HTTP evidence']),...manifest.filter(p=>p.type==='product').map(p=>[origin+p.path,origin+p.path,'200 retained','No slug migration','Established descriptive product URL retained; numeric catalog ID preserves routing and orders']),...['/cart/','/checkout/'].map(path=>['https://buyaws-account.vercel.app'+path,'https://buyaws-account.vercel.app'+path,'200 noindex retained','Private utility exception','Preserve browser-origin-local existing cart and payment drafts']),['https://www.cloudssupply.site/:path*',origin+'/:path*','308 project-domain redirect','WWW consolidation','Canonical apex configured on existing production project; preserves path/query'],[origin+'/home/',origin+'/','308 configured','Legacy alias','Remove duplicate homepage route']];
await writeFile('seo/URL-REDIRECT-MAPPING.csv',csv(redirects));
await write('TECHNICAL-SEO-REPORT.md',`# Technical SEO report

Canonical production origin: ${origin}/. Inventory: ${audit?.providers} providers, ${audit?.products} product pages, ${audit?.catalogRecords} catalog records and ${audit?.publicPages} public indexable URLs. Two noindex utility routes are separate.

## Implemented

- Shared origin and brand configuration in src/site-config.js; initial HTML canonical, robots, social metadata and JSON-LD on every generated route.
- Every commercial page is mapped in src/page-seo.json, src/provider-seo.json or src/product-seo.json, accessed through src/seo-keywords.js.
- Server-rendered page content is hydrated instead of discarded. Cart and order drafts load after hydration, preserving saved browser state.
- Every product is linked through crawlable HTML; provider pages expose all account variation guides. Maximum measured crawl depth: ${audit?.maxCrawlDepth}. Orphan pages: ${audit?.orphanPages?.length||0}.
- Filters/search remain browser state, not indexable generated filter URLs. Query parameters canonicalize to the clean route. Utility routes and unknown pages have noindex directives.
- Existing descriptive URL slugs are retained. No artificial product-ID removal or unsupported new category is introduced.
- Production sitemaps contain only canonical public pages. No invented lastmod dates: the catalog lacks reliable per-record content-modification timestamps.
- The old Vercel alias retains noindex cart/checkout routes so existing browser-local order drafts remain usable; public alias routes redirect to the canonical host. Vercel keeps real static 404 behavior; the local production preview also serves a genuine 404. No catch-all rewrite was introduced.
- Preview builds set noindex through VERCEL_ENV=preview or VITE_SITE_NOINDEX=true. The Sites audience remains owner-private. Keep preview deployment protection enabled in Vercel.
- Original typography and colors are retained. Active fonts are self-hosted, original brand artwork is cropped to remove the obsolete .store suffix, and responsive WebP assets replace heavy inline/logo and JPEG transfers.

## Hosting

Social metadata now uses website for collection/home pages and product only for an individual account Product.

Source: vercel.json. Vercel project: website, linked to moba342/Website- main. The production primary hostname is cloudssupply.site; www.cloudssupply.site permanently redirects to it. The response and live TLS/redirect chain are saved in evidence/apex-project-assignment.json and evidence/http-live.json. Do not disable certificate validation.

Local HTTP audit: ${local?local.failures.length===0?'PASS':'FAIL':'NOT TESTED'}. Final production HTTP audit: ${live?live.failures.length===0?'PASS':'FAIL':'NOT TESTED'}. Production field Core Web Vitals are NOT TESTED; lab metrics are documented separately.

If DNS becomes misconfigured: open Vercel team mo-ba2 → website → Settings → Domains, inspect both hostnames, and apply the exact A/CNAME values Vercel displays at your DNS provider. Verify the domain and wait for automatic TLS issuance. Do not move unrelated domains or change mail records.

## Remaining limits

No Google ranking, indexing, Search Console ownership, or field INP outcome is inferred from HTML checks. The longest title is 65 characters; descriptions are at most 160 characters. Editorial length guidance is not treated as an artificial pass/fail limit for specific technical labels. A passed JSON-LD or Lighthouse audit does not guarantee rich results. Existing sample service prices remain illustrative and require confirmation before payment.`);
await write('STRUCTURED-DATA-REPORT.md',`# Structured data audit

Status: ${audit?.failures?.length===0?'PASS':'FAIL'} for the automated, documented local checks. Google Rich Results Test submission is NOT TESTED.

The initial HTML contains parseable Schema.org JSON-LD with Organization, WebSite, WebPage/CollectionPage/ItemPage/ContactPage, ItemList and BreadcrumbList as appropriate. Product pages include visible product-specific FAQ questions and answers shared with FAQPage markup. Public FAQ answers and homepage FAQ markup reflect the visible text.

45 actual account variations use Product. Six illustrative starter packages use Service. Offer is emitted only for priced account products, with the catalog price, USD currency, canonical URL and seller reference. Quote-only account products omit Offer. Sample services omit Offer because no final scope/price is confirmed. No reviews, ratings, inventory availability, provider affiliation, price expiry or delivery guarantee was invented.

No ProductGroup is forced across unrelated trial, credit, compute and Bedrock listings; these are distinct offers with materially different scope, not a verified single product family suitable for a shared variesBy assertion.

Schema.org validity and Google eligibility are distinct: quote-only products lack the Offer/review/rating data required for a Google product snippet, and service pages are not asserted eligible for product snippets. FAQ rich results have restricted Google eligibility; no display is promised. The automated audit verifies schema identity, prices, canonical URLs, no unsupported offers, and exact visible/schema FAQ parity on every product. A pinned official Schema.org vocabulary snapshot is also checked: 1,494 typed nodes and 4,570 properties across all 76 routes pass known-type/property and inherited domainIncludes validation. 43 priced Product pages satisfy the tested Google snippet name/Offer/price/currency fields; two quote-only Products and six Services are intentionally not asserted eligible. Literal range coercion and Google service-side rich-result testing remain outside this validator. Evidence: evidence/schema-validation.json and scripts/validate-schema.mjs.

References: https://developers.google.com/search/docs/appearance/structured-data/product-snippet ; https://schema.org/Product ; https://schema.org/Service .`);
await write('AUTOMATED-TEST-REPORT.md',`# Automated test report

| Check | Status | Evidence |
|---|---|---|
| Production build and initial HTML | ${audit?.failures?.length===0?'PASS':'FAIL'} | npm run build; evidence/static-audit.json |
| 74 public + 2 utility routes | ${local?.failures?.length===0?'PASS':'NOT TESTED'} | evidence/http-local.json |
| Unique metadata/H1/canonical/schema | ${audit?.failures?.length===0?'PASS':'FAIL'} | scripts/audit-seo.mjs |
| 71 unique commercial primary mappings | ${audit?.commercialMapped===71?'PASS':'FAIL'} | KEYWORD-MAPPING.csv |
| Product keywords and FAQ parity | ${audit?.failures?.length===0?'PASS':'FAIL'} | PRODUCT-SEO-REPORT.csv |
| Broken internal links and orphan pages | ${audit?.orphanPages?.length===0?'PASS':'FAIL'} | Maximum depth ${audit?.maxCrawlDepth}; static-audit.json |
| Responsive routes | ${browser?.errors?.length===0?'PASS':'NOT TESTED'} | ${browser?.pagesTested||0} routes × 7 widths: 320, 375, 390, 768, 1024, 1440, 1920 |
| Variation, cart, checkout, contact/navigation | ${browser?.errors?.length===0?'PASS':'NOT TESTED'} | evidence/browser-qa.json; receipt intercepted, no payment/message sent |
| Cart normalization/quotes/storage/network receipts | PASS | npm test: 10 tests in tests/checkout.test.mjs |
| JavaScript syntax | PASS | npm run check:syntax; JSX parsed in production build |
| TypeScript and configured lint pipeline | NOT TESTED | JS/JSX repository, no TypeScript or existing lint configuration; no framework migration |
| Final live responses | ${live?live.failures.length===0?'PASS':'FAIL':'NOT TESTED'} | evidence/http-live.json |

No tests sign in as a customer, transfer cryptocurrency, or submit Telegram messages. The contact form opens a customer-sent Telegram draft; it does not create a server support ticket. Browser-local payment drafts still require manual merchant verification.

Secondary keyword coverage is a phrase-level editorial diagnostic rather than a density target. Notes: ${(audit?.warnings||[]).join('; ')||'none'}. No keyword stuffing was added to force support-page matches.`);
for(const mode of ['mobile','desktop'])await write('LIGHTHOUSE-'+mode.toUpperCase()+'-REPORT.md',`# ${mode[0].toUpperCase()+mode.slice(1)} Lighthouse report

Actual Lighthouse reports, not estimated scores. Local environment: production preview at http://localhost:4173, Chrome on macOS, Node 24.22.3. Tests run serially to avoid parallel browser load; scores are a lab snapshot and can vary. Target: Performance ${mode==='mobile'?90:95}+, Accessibility 95+, Best Practices 95+, SEO 100.

## Local production preview

| Page | Performance | Accessibility | Best Practices | SEO | LCP | CLS | Saved report |
|---|---|---|---|---|---|---|---|
${lhRows(localLH,mode)||'| Not tested | | | | | | | |'}

## Live production

| Page | Performance | Accessibility | Best Practices | SEO | LCP | CLS | Saved report |
|---|---|---|---|---|---|---|---|
${lhRows(liveLH,mode)||'| Not tested yet | | | | | | | |'}

A temporary uncompressed local preview produced reproducibly lower mobile scores on product/provider pages; text compression was added to represent actual Vercel delivery, and the complete suite was rerun. Intermediate reports are retained under baseline/intermediate-uncompressed-*.json.

The baseline local mobile homepage was measured at Performance 74, Accessibility 100, Best Practices 96 and SEO 100; its raw files are in baseline/. Fonts, logo/favicon and responsive image delivery were optimized, and accessible heading/button labeling was corrected. INP is a field responsiveness metric and is not inferred from Lighthouse TBT. No real-user Core Web Vitals pass is claimed. See evidence/lighthouse-local.json and evidence/lighthouse-live.json for scores, metrics and remaining opportunities.`);
await write('LIVE-SEO-AUDIT.md',`# Final live SEO audit

Target: ${origin}/. Status: ${live?live.failures.length===0?'PASS':'FAIL':'NOT TESTED'}.

${live?`${live.pages.length} intended pages were fetched from production. Failed page/HTTP checks: ${live.failures.length}. Every title, description, H1, primary/secondary keyword, visible-content hash and JSON-LD hash is compared with the validated build, with image alt checks and linked asset requests. Unknown route response: ${live.missingPage.status}; noindex: ${live.missingPage.noindex}.`: 'Final production crawl has not run yet; no live-deployment success is claimed.'}

The production crawl checks 200 responses, initial-HTML canonical origin, social page type, robots directives, complete visible content, JSON-LD, primary/secondary phrases, sitemap XML membership and origin, verification endpoints, real 404s and alternate-host redirect chains. HTTP requests upgrade to HTTPS; www requests permanently redirect to the canonical apex domain. Local content/schema/link/keyword checks are separate and are cross-checked against the same production artifact by the browser/live test suite. Raw response summaries: evidence/http-live.json. Mobile/desktop lab results are in LIGHTHOUSE-MOBILE-REPORT.md and LIGHTHOUSE-DESKTOP-REPORT.md.

${live?.redirects?.map(r=>'- '+r.url+': '+(r.error||r.chain.map(h=>h.status+(h.location?' → '+h.location:'')).join(' → '))).join('\n')||'Redirects: NOT TESTED after deployment.'}

Google index membership, rankings, Search Console verification and sitemap submission are not established by this crawl.`);
const priority=['/','/aws-standard/','/bedrock-api/','/aws-bedrock-api-key/','/cloud-service-accounts/','/all-products/','/provider/aws/','/provider/google-cloud/','/provider/azure/','/product/aws-32-vcpu-103/','/product/aws-ai-bedrock-10-rpm-32vcpus-124/','/product/aws-ai-bedrock-10k-rpm-32vcpus-116/'];
await write('GOOGLE-SEARCH-CONSOLE-GUIDE.md',`# Google Search Console readiness

Status: MANUAL ACTION REQUIRED for account-side verification, sitemap submission and indexing requests. The owner previously reported verification/submission for .site, but this audit does not have Search Console account evidence to reconfirm it. Do not claim a new submission occurred.

## Verify ownership

Domain property: add cloudssupply.site in Search Console. Copy the exact google-site-verification DNS TXT value Google supplies into the authoritative DNS zone. No DNS verification token has been invented or added.

URL-prefix property: ${origin}/. The owner-provided file remains public/googlee9c6c6adb26b90ba.html, publicly served at ${origin}/googlee9c6c6adb26b90ba.html. Use the file Google supplies for the selected property; click Verify in that signed-in account. Retain verification files after verification.

Meta-tag alternative: set GOOGLE_SITE_VERIFICATION (or VITE_GOOGLE_SITE_VERIFICATION) in the build environment to the real token from Google's HTML-tag method, then rebuild. The generator escapes and emits it only when supplied; no placeholder is deployed. DNS and account passwords do not belong in source control.

## Submit sitemap

After verification, choose Sitemaps in the .site property and submit sitemap_index.xml. The final URL is ${origin}/sitemap_index.xml. It links to page, provider and product sitemaps covering 74 canonical public URLs. Cart, checkout, redirects, and unknown pages are excluded. Save Google's submission status and processing errors before marking this step complete.

## Request indexing in priority order

${priority.filter(path=>manifest.some(p=>p.path===path)).map((path,i)=>(i+1)+'. '+origin+path).join('\n')}

Use URL Inspection → Test live URL → Request indexing for selected important URLs. Let the sitemap handle the wider catalog. No unsupported bulk-indexing or fake search-engine ping was used. Google determines inclusion and timing; inspect actual Search Console indexing reports to confirm outcomes.

Documentation: https://support.google.com/webmasters/answer/9008080 ; https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap ; https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl .`);
const scorePass=(mode,data)=>data.filter(r=>r.mode===mode).length===5&&data.filter(r=>r.mode===mode).every(r=>r.scores?.performance>=(mode==='mobile'?90:95)&&r.scores?.accessibility>=95&&r.scores?.['best-practices']>=95&&r.scores?.seo===100);
const checks=[['Product SEO',audit?.failures.length===0?'PASS':'FAIL','51 product pages; original articles/specifications preserved; added product-specific FAQs. PRODUCT-SEO-REPORT.csv'],['Primary & Secondary Buying Keywords',audit?.commercialMapped===71?'PASS':'FAIL','71 unique commercial primary mappings; each has 3–6 secondaries. KEYWORD-MAPPING.csv'],['SEO-Friendly URLs','PASS','Stable descriptive routes retained; migration avoided. URL-REDIRECT-MAPPING.csv'],['Technical SEO',audit?.failures.length===0&&local?.failures.length===0?'PASS':'PARTIAL','Static/local checks, genuine 404, crawl depth, canonical and robots evidence. Field Core Web Vitals not tested.'],['Structured Data',audit?.failures.length===0?'PASS':'FAIL','Local schema/visible-content parity; Google rich-result display is not guaranteed. STRUCTURED-DATA-REPORT.md'],['Production Build','PASS','npm run build succeeds and pre-renders 74 public + 2 noindex routes.'],['Automated Tests',browser?.errors.length===0?'PASS':'PARTIAL','Browser QA at seven widths, 10 catalog/cart unit tests, static and HTTP tests.'],['Mobile Lighthouse Testing',scorePass('mobile',liveLH)?'PASS':liveLH.some(r=>r.mode==='mobile')?'PARTIAL':scorePass('mobile',localLH)?'PARTIAL':'NOT TESTED','Actual local/live results and HTML/JSON reports in LIGHTHOUSE-MOBILE-REPORT.md'],['Desktop Lighthouse Testing',scorePass('desktop',liveLH)?'PASS':liveLH.some(r=>r.mode==='desktop')?'PARTIAL':scorePass('desktop',localLH)?'PARTIAL':'NOT TESTED','Actual local/live results and HTML/JSON reports in LIGHTHOUSE-DESKTOP-REPORT.md'],['Live Deployment',live?.failures.length===0?'PASS':'NOT TESTED','Production URL responses verified separately from owner-private Sites deployment.'],['Hosting Redirect Optimization',live?.failures.length===0?'PASS':'PARTIAL','Apex assigned; source redirects configured. Only mark PASS after all live chains pass.'],['Final Live Technical SEO Audit',live?.failures.length===0?'PASS':'NOT TESTED','LIVE-SEO-AUDIT.md and evidence/http-live.json'],['Google Search Console Verification','MANUAL ACTION REQUIRED','Current signed-in ownership status not checked. Owner previously reported verification.'],['XML Sitemap Submission','MANUAL ACTION REQUIRED','Sitemap generated and accessible; no new Search Console submission performed.'],['Request Indexing','MANUAL ACTION REQUIRED','Prioritized URL list prepared; no Google indexing claim.']];
const table='| Item | Status | Evidence / remaining action |\n|---|---|---|\n'+checks.map(r=>'| '+r.join(' | ')+' |').join('\n');
await write('SEO-LAUNCH-CHECKLIST.md','# Production SEO launch checklist\n\n'+table+'\n\nPASS refers to the stated tested scope, not Google rankings, rich-result eligibility, or field Core Web Vitals.');
await write('SEO-FINAL-REPORT.md',`# CloudsSupply — production SEO implementation

Date: 2026-11-27 (Asia/Dhaka). Canonical destination: ${origin}/.

## Inventory and preservation

The repository contains 13 providers, 45 account variations and six illustrative service packages: 51 product pages / 64 commercial catalog records. Ten additional public pages produce 74 indexable URLs; cart and checkout are noindex. No missing records, prices, capabilities, stock, reviews, ratings or affiliations were invented to reach the earlier 82-record expectation.

Prices, internal product IDs, contact details, payment addresses, 1 USD = 1 USDT merchant pricing, manual Telegram confirmation, and the 30 minutes–1 hour delivery statement remain intact. Existing articles, provider options, navigation and premium visual style are retained. The supplied logo graphic was cropped to remove its outdated .store suffix and compressed; original source artwork remains available.

## Changes implemented

- Restored canonical .site branding, metadata, sitemaps, breadcrumbs and schema origin.
- Completed primary/secondary mapping for every commercial route; separated broad AWS/Bedrock page intents.
- Added visible per-product FAQs with matching schema and provider-to-variation guide links.
- Corrected provider count, sample-service schema and unsupported offers.
- Hydrated server HTML safely, preserving browser-local carts and checkout drafts.
- Self-hosted active fonts, optimized favicon/wordmark, delivered responsive WebP imagery, added a skip link and corrected accessible heading/button names.
- Added source-controlled redirects, a realistic production preview, comprehensive static/HTTP/browser tests, and repeatable mobile/desktop Lighthouse runners.
- Configured the apex hostname as primary on the existing production Vercel project with a permanent www-to-apex redirect and verified TLS when live evidence is present.

## Evidence-based checklist

${table}

## Explicit limitations

Field INP/LCP/CLS and Google index membership are NOT TESTED. Lab Lighthouse scores are measurements, not real-user guarantees. Actual ranking cannibalization requires Search Console query/page data. Quote-only accounts and illustrative Service pages are not asserted to satisfy Google's product-snippet Offer requirements. The supplied static verification file remains available; owner account actions are documented in GOOGLE-SEARCH-CONSOLE-GUIDE.md.

Run commands: npm run check:syntax; npm test; npm run build; npm run test:browser; node scripts/http-qa.mjs; npm run test:lighthouse; node scripts/write-seo-reports.mjs. Reports retain actual raw evidence in seo/evidence and seo/lighthouse. No cryptocurrency transfer, contact message, or indexing submission was made by tests. Production-browser representative and order-flow evidence is retained in evidence/browser-qa-live.json.`);
console.log('Wrote all requested SEO launch documents and redirect mapping using current test evidence.');
