# Product variant SEO

The supplied SEO records cover 45 account variants: 24 AWS variants and 21 other cloud account variants. Each record has an exact SEO title, meta description, H1, primary keyword, and secondary-keyword strategy in `src/product-seo.json`.

All supplied records were matched to existing product IDs. There are no unmatched or missing account variants. The six existing onboarding service packages retain their prior titles, descriptions, and headings. The complete catalog therefore contains 51 individually optimized product pages.

## Content and URLs

Product titles in this configuration are complete search titles, including the requested brand suffix. Product-page H1s and introductory descriptions use the configured copy. Each original product article remains in `src/product-articles.json`.

Catalog product names and IDs remain unchanged so the existing product URLs, prices, variation labels, and ordering behavior stay stable. Product and Offer structured data continues to use the actual catalog item and current price. Keyword lists are maintained for strategy and reporting rather than output as repetitive visible lists.

Provider collection pages use the separate `src/provider-seo.json` configuration. Account variations keep their own distinct search copy and self-referencing canonical URLs under `https://www.cloudssupply.site/product/`.

## Validation and reports

`npm run build` pre-renders all 74 site routes and audits unique metadata, one H1 per page, exact product search copy, original articles, canonical URLs, structured prices, and internal-link destinations.

- `reports/product-variant-seo.csv`: all 51 product IDs, canonical URLs, supplied labels, keywords, SEO titles, descriptions, and H1s.
- `reports/on-page-seo.csv`: the complete 74-page site audit.

The 45 supplied account-variant records were applied from both user-provided text files. No catalog prices, credit balances, account specifications, or provider terms were changed by this SEO update.
