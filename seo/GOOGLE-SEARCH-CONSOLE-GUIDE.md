# Google Search Console readiness

Status: MANUAL ACTION REQUIRED for account-side verification, sitemap submission and indexing requests. The owner previously reported verification/submission for .site, but this audit does not have Search Console account evidence to reconfirm it. Do not claim a new submission occurred.

## Verify ownership

Domain property: add cloudssupply.site in Search Console. Copy the exact google-site-verification DNS TXT value Google supplies into the authoritative DNS zone. No DNS verification token has been invented or added.

URL-prefix property: https://cloudssupply.site/. The owner-provided file remains public/googlee9c6c6adb26b90ba.html, publicly served at https://cloudssupply.site/googlee9c6c6adb26b90ba.html. Use the file Google supplies for the selected property; click Verify in that signed-in account. Retain verification files after verification.

Meta-tag alternative: set GOOGLE_SITE_VERIFICATION (or VITE_GOOGLE_SITE_VERIFICATION) in the build environment to the real token from Google's HTML-tag method, then rebuild. The generator escapes and emits it only when supplied; no placeholder is deployed. DNS and account passwords do not belong in source control.

## Submit sitemap

After verification, choose Sitemaps in the .site property and submit sitemap_index.xml. The final URL is https://cloudssupply.site/sitemap_index.xml. It links to page, provider and product sitemaps covering 74 canonical public URLs. Cart, checkout, redirects, and unknown pages are excluded. Save Google's submission status and processing errors before marking this step complete.

## Request indexing in priority order

1. https://cloudssupply.site/
2. https://cloudssupply.site/aws-standard/
3. https://cloudssupply.site/bedrock-api/
4. https://cloudssupply.site/aws-bedrock-api-key/
5. https://cloudssupply.site/cloud-service-accounts/
6. https://cloudssupply.site/all-products/
7. https://cloudssupply.site/provider/aws/
8. https://cloudssupply.site/provider/google-cloud/
9. https://cloudssupply.site/provider/azure/
10. https://cloudssupply.site/product/aws-32-vcpu-103/
11. https://cloudssupply.site/product/aws-ai-bedrock-10-rpm-32vcpus-124/
12. https://cloudssupply.site/product/aws-ai-bedrock-10k-rpm-32vcpus-116/

Use URL Inspection → Test live URL → Request indexing for selected important URLs. Let the sitemap handle the wider catalog. No unsupported bulk-indexing or fake search-engine ping was used. Google determines inclusion and timing; inspect actual Search Console indexing reports to confirm outcomes.

Documentation: https://support.google.com/webmasters/answer/9008080 ; https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap ; https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl .
