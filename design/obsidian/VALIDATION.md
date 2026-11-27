# Obsidian Platinum validation

Production build, static SEO and schema checks: PASS. 92 indexable pages, two noindex cart/checkout pages, 68 priced Product schemas. 12 unit tests and JavaScript syntax checks pass. All 94 routes tested at 320, 375, 390, 430, 768, 1024, 1280, 1440 and 1920px: no horizontal overflow or browser errors. Existing navigation, provider variations, quantity controls, cart persistence, USDT checkout and receipt validation pass. No payment or message was sent.

Dedicated motion checks: preview categories, individual/global pause, keyboard focus pause, untabbable marquee duplicate, reduced-motion static layouts, completed scroll reveals and visible no-JavaScript server content all pass. Nine page types also independently tested at all nine widths. Original dashboard controls remain stationary while the illustration floats.

Local production-build homepage Lighthouse, isolated final runs:

| Mode | Performance | Accessibility | Best practices | SEO |
|---|---:|---:|---:|---:|
| Mobile | 98 | 100 | 100 | 100 |
| Desktop | 100 | 100 | 100 | 100 |

Both recorded runs have zero measured cumulative layout shift. These are local lab results for the homepage, not field Core Web Vitals or claims about every route. Browser screenshots and raw audits are in evidence/. Initial concurrent audit runs were superseded by isolated final runs.

All authoritative catalog, article, SEO metadata, payment, cart/order and routing source files match the preceding release byte for byte. Generated metadata/schema checks continue to pass. Public deployment is recorded separately after verification.
