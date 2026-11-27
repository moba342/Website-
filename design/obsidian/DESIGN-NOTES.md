# CloudsSupply — Obsidian Platinum

Latest owner-requested cleanup: footer artwork, pause controls and floating delivery dock removed. See CLEANUP.md. Original design decisions and validation below describe the initial redesign release.

The owner requested an independent identity and preservation of all catalog/checkout/SEO behavior.

Three explored directions: (1) terminal-first technical utility, (2) editorial metallic product journal, (3) infrastructure control room. Selected (3), with asymmetric editorial sections from (2). The homepage is a catalog instrument, not fabricated operational telemetry. Native category controls preview the merchant's actual ranges. No testimonials or customer activity have been invented.

Reference: https://www.dotcloudshop.com/ inspected in Chrome on 2026-11-27. Measured styles and desktop/mobile captures are in evidence/reference-*. The web reader could not access the site, but Chrome succeeded. Observed Inter typography, body rgb(10,10,12), navigation 14px and 0.25s link transitions; header 0.5s cubic-bezier(.4,0,.2,1). Its current homepage advertises virtual cards. These are observations, not styles or content copied into this implementation. No reference assets downloaded or reused. Layouts, typography, catalog instruments, SVG artwork and motion choreography are independent.

Palette: #09090B / #111113 / #18181B / #202023 with #27272A borders and #C0C7D1 platinum. Success/warning/error remain semantic. Legacy blue/purple CSS surfaces were migrated to neutral values. Provider logos retain their legitimate marks; the existing brand wordmark is presented monochromatically.

Typography: self-hosted Manrope / Geist / Geist Mono with OFL licenses. No runtime Google Fonts dependency. Original SVG scenes produce small responsive WebP derivatives through scripts/create-platinum-art.mjs; source SVGs retained. Engraved infrastructure, credits and AI artwork is labeled illustrative. Official provider identities remain separate overlays.

Motion: 800ms hero, 650ms reveal, 250ms controls/cards, 450ms metallic shine, 6s dashboard float, 35s marquee, 12s signal/spotlight. Global pause plus independent dashboard and marquee controls. Decorative duplication is aria-hidden and untabbable. Reduced motion removes animation and reveals content; a wrapped static provider rail replaces scrolling. Existing server-rendered text remains available without JS. Fine-pointer lighting and bounded click halos are retained in neutral platinum.

Product collection uses horizontal split inventory tiles on desktop and stacked artwork on mobile; homepage curated tiles, provider comparison rows and product order desk each have distinct roles. All 14 providers / 68 variations, URLs, articles, structured data, payment wallets and manual review workflow remain intact.

The floating motion is confined to the signal-map illustration so controls do not move during pointer or keyboard interaction. Product-article sections use fine horizontal rules and unboxed reading surfaces, alongside a separate purchase desk.
