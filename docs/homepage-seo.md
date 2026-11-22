# Homepage SEO — CloudsSupply

Active canonical URL: https://buyaws-account.vercel.app/

The owner requested indexing the working https://buyaws-account.vercel.app/ deployment on 2026-11-23. Canonical URLs, structured data, and sitemaps now use that origin. The previous .site Search Console property does not cover this hostname; verify and submit its sitemap as a separate URL-prefix property.

## Search intent and keywords

Primary: **buy aws account**.

Secondary phrases: buy aws accounts; buy aws accounts for sale; buy aws account online; buy aws bedrock account; buy aws bedrock api key; aws bedrock api key.

Use readable variations in context. The homepage covers account selection and Bedrock access; detailed quotas, regions, prices, and product articles belong on the linked landing and product pages. No meta-keywords tag is added.

## Exact search copy

Title: **Buy AWS Accounts & AWS Bedrock API Access | CloudsSupply**

Description: **Buy AWS accounts and explore AWS Bedrock API access at CloudsSupply. Find AWS account options, setup details, pricing, and support for your cloud projects.**

H1: **Buy AWS Accounts & AWS Bedrock API Access**

H2 sections, in order:

1. Buy AWS Accounts Online
2. AWS Accounts for Sale
3. Buy AWS Bedrock Account & API Access
4. Why Choose CloudsSupply?
5. Explore AWS Account Options
6. Frequently Asked Questions

## Content and internal linking

- Six featured AWS listings link to their original product articles and use current catalog prices.
- `/aws-standard/` covers trial, compute, and credit options.
- `/bedrock-api/` is the dedicated Bedrock account/API landing page.
- `/aws-account-configurator/` compares all AWS variations.
- `/provider/aws/` provides the AWS provider guide.
- The homepage FAQ explains AWS account selection, account access versus an included Bedrock API key, and the agreed delivery window.
- Supporting provider cards and the price-comparison table remain available for multicloud visitors.

## Structured data and performance

The homepage includes Organization, WebSite, CollectionPage, ItemList, six visible Product/Offer nodes, and a FAQPage node matching its visible questions. Breadcrumb markup remains on the inner pages where it reflects the browsing hierarchy. Do not invent reviews, availability, credit guarantees, or support claims.

The hero image has an explicit high fetch priority and intrinsic dimensions. Product illustrations below the hero load lazily with reserved image dimensions. The existing Vercel Speed Insights integration remains active; no synthetic Core Web Vitals score is claimed.

Maintain the exact copy, featured IDs, and homepage FAQs in `src/homepage-seo.js`. The build audit checks the homepage contract and validates featured structured prices against the catalog. `reports/on-page-seo.csv` includes the homepage along with all other routes.
