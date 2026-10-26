# Zaya Luxe — Design System (Provisional)

**Version:** 0.1 (provisional) · **Date:** 2026-10-26
**Status:** Direction proposal — replace with client brand guidelines when supplied.
**Related:** [`prd.md`](./prd.md) · [`architecture.md`](./architecture.md)

> This document is a **starting direction**, not a final brand. If the client has
> existing guidelines, they win and this file is rewritten. Do not build a visual
> identity the client has not approved.

---

## 1. Design intent

**Quiet luxury, editorial, warm.** The store should feel like a fashion magazine that
happens to sell — not a discount marketplace and not a generic Shopify theme.

Five principles:

1. **Product first.** Photography is the hero. Chrome recedes: thin rules, generous
   whitespace, restrained colour.
2. **Editorial rhythm.** Alternate full-bleed imagery with quiet text sections; avoid
   a uniform grid of identical cards.
3. **Bilingual by design.** Arabic is not a translation layer; RTL layouts are composed
   with the same care as LTR.
4. **Calm interaction.** Slow, subtle motion (150–250ms); no bounce, no parallax that
   hurts mobile performance.
5. **Trust through clarity.** Delivery dates, duties, returns, and payment options are
   visible before checkout — luxury is not vagueness.

**Explicitly avoid:** gold gradients, glassmorphism, neon, autoplay carousels, stock
"Arial + blue button" SaaS look, fake urgency timers, and 12 competing badge colours.

---

## 2. Colour

Warm neutral base with a deep ink and a muted metal accent. Gold is **decorative only**
(it fails contrast for text).

| Token | Hex | Usage | Contrast note |
|---|---|---|---|
| `--ink` | `#14110F` | Primary text, headlines | 16.8:1 on ivory |
| `--ink-soft` | `#3A342E` | Secondary text | 10.4:1 on ivory |
| `--muted` | `#5C554C` | Captions, meta | 6.1:1 on ivory |
| `--ivory` | `#F7F3EC` | Page background | — |
| `--sand` | `#E6DCCB` | Section background, cards | — |
| `--line` | `#D8CDBC` | Rules, borders | — |
| `--gold` | `#B08D57` | Decorative rules, icons only | **2.4:1 — never text** |
| `--gold-text` | `#7A5A2E` | Links/accents that need contrast | 5.6:1 on ivory |
| `--clay` | `#9A5B45` | Editorial accent, small areas | 4.9:1 on ivory |
| `--success` | `#2F6B4F` | In-stock, success | 5.2:1 on ivory |
| `--error` | `#A33A2B` | Errors, sold out | 6.0:1 on ivory |
| `--white` | `#FFFFFF` | Cards, modals | — |

**Rules**
- Body text is `--ink` or `--ink-soft` on `--ivory`/`--white`; never gold on ivory for text.
- Buttons: ink background + ivory text (high contrast), or ivory with ink border.
- Status is never communicated by colour alone — pair with text/icon.
- Dark mode is out of scope for v1; the brand is warm-light.

---

## 3. Typography

| Role | Latin | Arabic | Notes |
|---|---|---|---|
| Display / headlines | **Cormorant Garamond** (or client serif) | **Noto Naskh Arabic** | Editorial, high contrast; use 500–600 |
| Body / UI | **Inter** | **IBM Plex Sans Arabic** | Neutral, legible at 14–16px |
| Numerals / prices | Inter tabular | IBM Plex Sans Arabic | `font-variant-numeric: tabular-nums` |

- Fallbacks: `Georgia, "Times New Roman", serif` and `system-ui, sans-serif`.
- Load with `next/font`, subset Latin + Arabic, `display: swap`, preload only the
  primary weights (400/500/600).
- **Arabic:** no letter-spacing, line-height 1.75–1.9, slightly larger size (+1px) than
  Latin at the same role, no italic (use weight/colour for emphasis).
- Scale (mobile → desktop):
  - Display: 40 → 72px, line-height 1.05
  - H1: 32 → 48px, 1.1
  - H2: 24 → 32px, 1.2
  - H3: 18 → 22px, 1.3
  - Body: 15 → 16px, 1.6
  - Small/meta: 12 → 13px, 1.5

---

## 4. Spacing, grid, and shape

- **Spacing scale:** 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 (px).
- **Container:** max 1440px, gutters 20px mobile / 40px tablet / 64px desktop.
- **Grid:** 4 columns mobile, 8 tablet, 12 desktop; product grids 2/3/4 columns.
- **Radius:** 0 for editorial imagery and primary cards; 2px for inputs/buttons;
  full for avatars only. Sharp edges read more luxury than rounded cards.
- **Borders:** 1px `--line`; avoid heavy shadows. One soft shadow token for modals only:
  `0 24px 64px rgba(20,17,15,0.18)`.
- **Motion:** 150ms ease-out for hover/focus, 250ms for drawers/modals; respect
  `prefers-reduced-motion` (disable transforms, keep opacity).

---

## 5. Layout blueprints

### Home
1. Slim announcement bar (delivery promise / free shipping threshold, bilingual).
2. Header: logo centre or left; nav (Women, Men, Accessories, New In, Journal);
   search, account, cart; language/currency switcher.
3. Hero: full-bleed editorial image (16:9 desktop, 4:5 mobile) + one line of copy +
   one CTA. No carousel.
4. Category entry: 2–4 image tiles with generous whitespace.
5. "The Edit" — 3–4 products with editorial captions.
6. Brand/craft statement with one image and short copy.
7. Lookbook strip (full-bleed, horizontal scroll on mobile).
8. Trust bar: delivery, returns, payment methods, WhatsApp.
9. Newsletter/WhatsApp capture.
10. Footer: policies, contact, social, payment icons, language.

### PLP
- Editorial header (category name, 1–2 line description), then sticky filter bar.
- Filters in a drawer on mobile, sidebar on desktop; active filter chips.
- Product card: image (4:5), hover second image, name, price, colour swatches,
  quick-add (desktop) / tap-through (mobile). No badges unless meaningful
  (New, Low stock, Sold out).
- Sort, result count, load-more or pagination (SEO-friendly links).
- SEO copy below the grid, not above it.

### PDP
- Sticky gallery (desktop split view), thumbnails, zoom, video.
- Right column: brand/category eyebrow, title, price (market currency), short copy,
  variant selector (size/colour with availability), size guide link, quantity,
  add-to-cart, delivery estimate, returns note, payment icons, accordions
  (Details, Materials & Care, Shipping & Returns).
- Dynamic spec table from category attributes (the category-agnostic proof).
- "Complete the look" / related products.
- Sticky add-to-cart on mobile after scroll.

### Cart / checkout
- Cart drawer: line items, quantity, remove, subtotal, free-shipping progress, CTA.
- Checkout: single column on mobile, two-column desktop (form + summary).
- Show delivery date range and landed cost before payment.
- Payment methods as recognisable tiles: online gateway + **COD**. Show any COD fee and
  the exact amount to prepare; the hosted page opens with clear context.
- Error states inline, never a generic toast only.

### Account
- Orders, order detail with tracking, returns, addresses, preferences, logout.
- Minimal, list-based, no dashboard clutter.

---

## 6. Component inventory

Build on `@storefront-ui/react` + Tailwind preset; add brand primitives.

**Primitives:** Button (primary/secondary/ghost/link), Input, Select, Checkbox, Radio,
Textarea, Badge, Accordion, Modal/Drawer, Tabs, Tooltip, Skeleton, Toast, Breadcrumb,
Pagination, QuantityStepper, Price, Rating (phase 2).

**Commerce blocks:** Header, MegaMenu (optional), MobileNav, SearchOverlay,
ProductCard, ProductGrid, ProductGallery, VariantSelector, SizeGuide,
AddToCart, CartDrawer, CartLine, OrderSummary, AddressForm, ShippingOptions,
PaymentMethods, TrustBar, Newsletter, Footer, FilterPanel, ActiveFilters,
SortSelect, EmptyState, ErrorState, EditorialBlock, LookbookStrip.

**Admin (Medusa):** custom widget for market availability + attribute completeness
(phase 2 candidate); otherwise use stock Medusa Admin.

---

## 7. Imagery direction

| Type | Ratio | Notes |
|---|---|---|
| Hero desktop | 16:9 or 3:2 | Full-bleed, negative space for text |
| Hero mobile | 4:5 | Separate crop, not a squashed desktop image |
| Product | 4:5 | Consistent background, colour-accurate |
| Product detail | 1:1 / 4:5 | Fabric, stitching, hardware close-ups |
| Editorial | 3:2 or 4:5 | Natural light, warm grade, no heavy filters |
| Lookbook | 4:5 / 9:16 | Mobile-first, scrollable |

**Minimum spec:** 2000px on the long edge, sRGB, no watermark, rights confirmed.
Deliver AVIF/WebP derivatives via the image pipeline; keep originals in R2.
**Do not** use AI-generated models for products without disclosure and client approval;
AI imagery is acceptable for abstract/editorial backgrounds only.

---

## 8. Bilingual and RTL rules

- `<html lang="ar" dir="rtl">` for Arabic; `dir="ltr"` for English.
- Use logical properties; test every component in both directions.
- Mirror directional icons (arrows, back, chevrons); do not mirror logos, product
  images, or payment brand marks.
- Arabic line lengths: keep body text 45–70 characters; avoid justified text.
- Prices: `١٢٣٤ ر.ق` vs `QAR 1,234` — follow brand preference; be consistent.
- Language switcher preserves the current page and region where possible.
- Arabic copy is written, not transliterated; English brand names may stay Latin.
- Forms: phone placeholder local format, but store E.164.

---

## 9. Accessibility in design

- Contrast checked for every text/background pair (see colour table).
- Focus ring: 2px `--ink` offset 2px on light surfaces; 2px `--ivory` on dark.
- Touch targets ≥ 44×44px mobile, ≥ 24×24px desktop minimum.
- Form errors: icon + text + `aria-describedby`, not colour alone.
- Motion: honour reduced motion; no auto-playing video with sound.
- Images carry meaningful alt text in both languages.
- Modals/drawers trap focus, close on Escape, and restore focus.

---

## 10. Content voice

- **English:** restrained, sensory, specific. Short sentences. No exclamation marks.
  Example: "Cut from weighted linen. Made to soften with wear."
- **Arabic:** formal but warm (فصحى معاصرة), not literal translation. Avoid dialect
  unless the brand explicitly wants it.
- Product names stay consistent across languages; translate descriptors, not SKUs.
- Never overclaim (certifications, origin, delivery) without a source.
- Microcopy: clear, human, no jargon. "Arrives Tue 3 Nov" beats "Standard shipping".

---

## 11. What the client must provide

- [ ] Logo (SVG + PNG), clear-space rules, minimum size.
- [ ] Brand colours + any existing palette, and permission to extend it.
- [ ] Font licences, or approval to use the proposed open-source pairing.
- [ ] Photography and usage rights; model releases.
- [ ] Tone-of-voice guide or examples.
- [ ] Arabic brand name treatment (Zaya Luxe / زايا لوكس?) and preferred numerals.
- [ ] Packaging/insert design if it appears on-site.
- [ ] Social handles and WhatsApp number.

Until these arrive, this file is **provisional** and no visual work is considered final.

---

## 12. Design QA checklist

- [ ] All text meets 4.5:1 (or 3:1 large).
- [ ] Every interactive element has hover, focus, active, disabled states.
- [ ] Arabic layout has no overflow, clipped text, or mirrored logos.
- [ ] 320px, 360px, 390px, 768px, 1024px, 1440px checked.
- [ ] Images have width/height and do not shift layout.
- [ ] Loading, empty, error, and sold-out states designed.
- [ ] Forms have labels, help text, and error messages.
- [ ] Motion respects reduced-motion.
- [ ] Product card works with 1–4 word titles and long Arabic titles.
- [ ] Price with 4 digits and currency symbol does not wrap awkwardly.
