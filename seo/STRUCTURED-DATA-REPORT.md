# Structured data audit

Status: PASS for the automated, documented local checks. Google Rich Results Test submission is NOT TESTED.

The initial HTML contains parseable Schema.org JSON-LD with Organization, WebSite, WebPage/CollectionPage/ItemPage/ContactPage, ItemList and BreadcrumbList as appropriate. Product pages include visible product-specific FAQ questions and answers shared with FAQPage markup. Public FAQ answers and homepage FAQ markup reflect the visible text.

45 actual account variations use Product. Six illustrative starter packages use Service. Offer is emitted only for priced account products, with the catalog price, USD currency, canonical URL and seller reference. Quote-only account products omit Offer. Sample services omit Offer because no final scope/price is confirmed. No reviews, ratings, inventory availability, provider affiliation, price expiry or delivery guarantee was invented.

No ProductGroup is forced across unrelated trial, credit, compute and Bedrock listings; these are distinct offers with materially different scope, not a verified single product family suitable for a shared variesBy assertion.

Schema.org validity and Google eligibility are distinct: quote-only products lack the Offer/review/rating data required for a Google product snippet, and service pages are not asserted eligible for product snippets. FAQ rich results have restricted Google eligibility; no display is promised. The automated audit verifies schema identity, prices, canonical URLs, no unsupported offers, and exact visible/schema FAQ parity on every product.

References: https://developers.google.com/search/docs/appearance/structured-data/product-snippet ; https://schema.org/Product ; https://schema.org/Service .
